/* =========================================================
   SAVE / DATA — FireFly 3.0
   ========================================================= */
import { ui } from '../core/dom.js';

export const DEFAULT_DATA = {
  version: 3, coins: 25, map: 'village',
  inventory: { bait: 0, reinforcedNet: 0, lantern: 0, explorationKit: 0, luckyCharm: 0, masterNet: 0 },
  catches: {}, discovered: {},
  quests: { tito_frogs: { status: 'available', progress: 0 } },
  progression: { xp:0, level:1, resources:{}, crafted:{}, upgrades:{}, stats:{gathered:0,crafted:0,steps:0} },
  audioEnabled: true
};

export function cloneDefaultData() { return JSON.parse(JSON.stringify(DEFAULT_DATA)); }

export function loadGame() {
  try {
    const raw = localStorage.getItem('firefly-save');
    if (!raw) return cloneDefaultData();
    const parsed = JSON.parse(raw);
    return {
      ...cloneDefaultData(), ...parsed, version:3,
      inventory: { ...DEFAULT_DATA.inventory, ...(parsed.inventory || {}) },
      catches: { ...DEFAULT_DATA.catches, ...(parsed.catches || {}) },
      discovered: { ...DEFAULT_DATA.discovered, ...(parsed.discovered || {}) },
      quests: { ...DEFAULT_DATA.quests, ...(parsed.quests || {}) },
      progression: { ...DEFAULT_DATA.progression, ...(parsed.progression || {}),
        resources:{...(parsed.progression?.resources||{})}, crafted:{...(parsed.progression?.crafted||{})},
        upgrades:{...(parsed.progression?.upgrades||{})}, stats:{...DEFAULT_DATA.progression.stats,...(parsed.progression?.stats||{})}
      }
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
