/* =========================================================
   MAPAS — interactables, transição entre áreas e a caverna
   ========================================================= */

import { state } from '../core/state.js';
import { save, saveGame } from '../systems/save.js';
import { AudioManager } from '../systems/audio.js';
import { spawnForest, spawnCave } from '../entities/creatures.js';
import { titoDialog } from '../systems/quests.js';
import { shopDialog } from '../systems/shop.js';
import { startVan } from '../entities/van.js';
import { startFishing } from '../systems/fishing.js';
import { dialog, closeDialog } from '../render/dialog.js';

export function transition(job) { if (state.fade.job) return; state.fade.job = job; state.fade.value = 0.01; }
export function beginMap(id, x = 250) { transition(() => { state.map = id; save.map = id; state.player.x = x; state.player.y = 515; state.player.vx = 0; state.camera.x = 0; state.entities = []; state.interactables = []; state.fishing = null; buildMap(); saveGame(); AudioManager.playMusic(id); AudioManager.playAmbient(id); }); }
export function addInteractable(id, x, y, radius, type, onInteract, label) { state.interactables.push({ id, x, y, radius, type, onInteract, label }); }
export function activeInteractable() { const p = state.player; return state.interactables.filter((object) => Math.abs(object.x - p.x) < object.radius && Math.abs(object.y - p.y) < 90).sort((a,b) => Math.abs(a.x-p.x)-Math.abs(b.x-p.x))[0]; }
export function caveDialog() { dialog('Fenda Cintilante', 'Uma corrente fria e um brilho azul escapam lá de dentro.', [['ENTRAR NA CAVERNA', () => { closeDialog(); beginMap('cave', 240); }], ['AGORA NÃO', closeDialog]]); }
export function buildMap() {
  state.interactables = [];
  if (state.map === 'village') { addInteractable('tito',460,505,85,'npc',titoDialog,'Falar com Tito'); addInteractable('shop',630,505,125,'shop',shopDialog,'Entrar na lojinha'); addInteractable('van',980,510,145,'vehicle',startVan,'Subir na van'); }
  if (state.map === 'forest') { spawnForest(); addInteractable('fish',760,520,190,'fishing',startFishing,'Pescar no lago'); addInteractable('cave',1590,510,135,'door',caveDialog,'Entrar na caverna'); addInteractable('village',100,510,95,'door',() => beginMap('village',1090),'Voltar para Vila Lumina'); }
  if (state.map === 'cave') { spawnCave(); addInteractable('exit',120,510,100,'door',() => beginMap('forest',1500),'Sair da caverna'); }
}
