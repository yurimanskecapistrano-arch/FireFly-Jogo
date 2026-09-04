/* =========================================================
   SAVE / DATA
   ========================================================= */

import { ui } from '../core/dom.js';

export const DEFAULT_DATA = {
  version: 2, coins: 25, map: 'village',
  inventory: { bait: 0, reinforcedNet: 0, lantern: 0, explorationKit: 0 },
  catches: {}, discovered: {},
  quests: { tito_frogs: { status: 'available', progress: 0 } }, audioEnabled: true
};

export function cloneDefaultData() { return JSON.parse(JSON.stringify(DEFAULT_DATA)); }

export function loadGame() {
  try {
    const raw = localStorage.getItem('firefly-save');
    if (!raw) return cloneDefaultData();
    const parsed = JSON.parse(raw);
    return {
      ...cloneDefaultData(), ...parsed,
      inventory: { ...DEFAULT_DATA.inventory, ...(parsed.inventory || {}) },
      catches: { ...DEFAULT_DATA.catches, ...(parsed.catches || {}) },
      discovered: { ...DEFAULT_DATA.discovered, ...(parsed.discovered || {}) },
      quests: { ...DEFAULT_DATA.quests, ...(parsed.quests || {}) }
    };
  } catch (error) {
    console.warn('FireFly: save inválido, iniciando novo jogo.', error);
    return cloneDefaultData();
  }
}

export const save = loadGame();

export function saveGame() {
  try { localStorage.setItem('firefly-save', JSON.stringify(save)); }
  catch (error) { console.warn('FireFly: não foi possível salvar.', error); }
  if (ui.coins) ui.coins.textContent = save.coins;
}
