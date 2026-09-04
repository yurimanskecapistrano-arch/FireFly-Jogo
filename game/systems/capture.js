/* =========================================================
   CAPTURA
   ========================================================= */

import { chance } from '../core/utils.js';
import { state, addParticles } from '../core/state.js';
import { save, saveGame } from './save.js';
import { names, rarity, QUESTS, SPECIES } from '../data/game-data.js';
import { notify } from '../render/notify.js';
import { AudioManager } from './audio.js';
import { quest } from './quests.js';

function catchChance(entity) {
  const species = SPECIES[entity.type] || SPECIES.butterfly;
  let base = 0.92 / species.catchDifficulty;
  if (entity.aiState === 'landed') base += 0.2;
  if (entity.aiState === 'flee' || entity.aiState === 'dart' || entity.aiState === 'skitter') base -= 0.3;
  return Math.max(0.15, Math.min(0.98, base));
}

export function capture() {
  if (state.map === 'village' || state.fishing) return;
  const p = state.player;
  const nearby = state.entities.filter((entity) => entity.alive && entity.visible !== false).sort((a, b) => Math.abs(a.x - p.x) - Math.abs(b.x - p.x));
  const entity = nearby[0];
  p.action = 0.6; AudioManager.playSFX('net-swing');
  if (!entity || Math.abs(entity.x - p.x) > 105) { notify('Escapou! A rede só pegou folhas.'); addParticles(p.x + 35 * p.face, p.y, '#a5cf7d', 5); AudioManager.playSFX('error'); return; }
  if (entity.rarity === 'raro' && !save.inventory.reinforcedNet) { entity.mode = 'flee'; entity.aiState = 'flee'; entity.vx = entity.x >= p.x ? 260 : -260; notify('É raro demais para a sua rede atual!'); AudioManager.playSFX('error'); return; }
  if (!chance(catchChance(entity))) { notify(names[entity.type] + ' escapou da rede!'); addParticles(entity.x, entity.y, '#a5cf7d', 8); AudioManager.playSFX('error'); entity.aiState = 'flee'; entity.vx = (entity.x >= p.x ? 1 : -1) * (SPECIES[entity.type]?.fleeSpeed || 150); return; }
  entity.alive = false;
  save.catches[entity.type] = (save.catches[entity.type] || 0) + 1;
  const fresh = !save.discovered[entity.type]; save.discovered[entity.type] = true;
  save.coins += entity.rarity === 'raro' ? 12 : entity.rarity === 'incomum' ? 5 : 3;
  if (entity.type === 'frog' && quest().status === 'active') { quest().progress++; if (quest().progress >= QUESTS.tito_frogs.required) { quest().status = 'complete'; addParticles(entity.x, entity.y, '#ffe875', 30); notify('MISSÃO COMPLETA! Volte para Tito.'); AudioManager.playSFX('quest-complete'); } else notify('Sapo capturado! ' + quest().progress + '/3 para Tito.'); }
  else notify((fresh ? 'NOVA DESCOBERTA! ' : '') + names[entity.type] + ' capturado!');
  addParticles(entity.x, entity.y, entity.rarity === 'raro' ? '#d2a1ff' : '#ffe47a', 16); state.camera.shake = 8; saveGame(); AudioManager.playSFX('capture');
}
