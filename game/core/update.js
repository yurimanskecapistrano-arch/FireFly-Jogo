/* =========================================================
   UPDATE 2.0 — simulação contínua, áudio e vida do mundo
   ========================================================= */
import { state, addParticles, tickParticles, tickFade, isNight } from './state.js';
import { clamp } from './utils.js';
import { isDown } from './input.js';
import { ui } from './dom.js';
import { W } from './constants.js';
import { updatePlayer } from '../entities/player.js';
import { updateCreature } from '../entities/creatures.js';
import { tickFishing } from '../systems/fishing.js';
import { AudioManager } from '../systems/audio.js';
import { beginMap } from '../world/maps.js';

let lastNight = null;
let lastMap = null;

export function update(dt) {
  state.t += dt;
  state.clock = (state.clock + dt / 180) % 1;
  const night = isNight();
  if (ui.time) ui.time.textContent = night ? '☾ NOITE' : '☀ DIA';
  if (night !== lastNight) { lastNight = night; AudioManager.setTime(night); }
  if (state.map !== lastMap) { lastMap = state.map; AudioManager.playMusic(state.map); }

  const maxX = updatePlayer(dt);
  const p = state.player;
  state.camera.target = clamp(p.x - W * 0.46, 0, Math.max(0, maxX - W + 100));
  state.camera.x += (state.camera.target - state.camera.x) * Math.min(1, dt * 4.5);
  state.camera.shake *= Math.pow(.08, dt);

  const world = { playerX:p.x, playerY:p.y, isNight:night, maxX };
  for (const entity of state.entities) updateCreature(entity,dt,world);
  tickFishing(dt,isDown(' '));

  if (state.travel) {
    state.travel -= dt;
    if (state.travel < .65) addParticles(890,state.player.y,'#d9ded0',2);
    if (state.travel <= 0) { state.travel=0; AudioManager.playSFX('van-engine'); beginMap('forest',170); }
  }
  tickParticles(dt);
  tickFade(dt);
}
