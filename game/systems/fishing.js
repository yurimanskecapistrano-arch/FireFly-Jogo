/* =========================================================
   PESCA
   ========================================================= */

import { clamp, chance } from '../core/utils.js';
import { state, addParticles } from '../core/state.js';
import { save, saveGame } from './save.js';
import { names, rarity } from '../data/game-data.js';
import { notify } from '../render/notify.js';
import { AudioManager } from './audio.js';

export function startFishing() {
  if (state.fishing) return;
  state.fishing = { stage: 'wait', time: 1.2, ready: false, tension: 0.5, progress: 0, fishType: null };
  state.player.action = 1; notify('Você lança a linha. Espere a boia mexer...'); AudioManager.playSFX('fish');
}
function failFishing(message) { state.fishing = null; state.player.action = 0; notify(message); }
function landFish() { const f = state.fishing; const fish = f.fishType || 'moonfish'; save.catches[fish] = (save.catches[fish] || 0) + 1; save.discovered[fish] = true; save.coins += rarity[fish] === 'incomum' ? 6 : 3; state.fishing = null; state.player.action = 0.7; addParticles(760, 500, '#9ce4e2', 16); saveGame(); notify('Fisgou ' + names[fish] + '!'); AudioManager.playSFX('capture'); }
export function hookFish() { const f = state.fishing; if (!f || f.stage !== 'bite') return; f.stage = 'reel'; f.tension = 0.5; f.progress = 0; }
export function handleSpaceKey() { const f = state.fishing; if (f && f.stage === 'bite') { hookFish(); return; } if (!f || f.stage !== 'reel') { import('./capture.js').then(({ capture }) => capture()); } }
export function tickFishing(dt, holding) {
  const f = state.fishing; if (!f) return;
  if (f.stage === 'wait') { f.time -= dt; if (f.time <= 0) { f.stage = 'bite'; f.ready = true; f.fishType = chance(0.26) ? 'stripefish' : 'moonfish'; notify('A boia afundou! Aperte ESPAÇO!'); AudioManager.playSFX('fish-bite'); } return; }
  if (f.stage === 'bite') { f.time -= dt; if (f.time < -1.8) failFishing('O peixe escapou. Tente de novo.'); return; }
  if (f.stage === 'reel') { f.tension = clamp(f.tension + (holding ? 0.9 : -0.6) * dt, 0, 1); if (f.tension > 0.4 && f.tension < 0.78) f.progress += dt * 0.5; else f.progress = Math.max(0, f.progress - dt * 0.25); if (f.tension >= 1) { failFishing('A linha arrebentou!'); AudioManager.playSFX('line-snap'); return; } if (f.tension <= 0) { failFishing('O peixe escapou.'); return; } if (f.progress >= 1) landFish(); }
}
