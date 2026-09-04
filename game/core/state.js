/* =========================================================
   GAME STATE
   ========================================================= */

import { rnd } from './utils.js';
import { save } from '../systems/save.js';

export const state = {
  map: save.map || 'village',
  clock: 0.54,
  t: 0,
  player: { x: save.map === 'village' ? 300 : 260, y: 515, vx: 0, face: 1, mode: 'idle', action: 0 },
  camera: { x: 0, target: 0, shake: 0 },
  entities: [],
  particles: [],
  interactables: [],
  fade: { value: 0, job: null },
  travel: 0,
  fishing: null
};

export function addParticles(x, y, color, count = 12) {
  for (let i = 0; i < count; i++) {
    state.particles.push({ x, y, vx: rnd(-2.4, 2.4), vy: rnd(-3.4, -0.2), life: rnd(0.45, 1), maxLife: 1, color, size: rnd(2, 5) });
  }
}

export function tickParticles(dt) {
  for (let i = state.particles.length - 1; i >= 0; i--) {
    const particle = state.particles[i];
    particle.life -= dt;
    particle.x += particle.vx * 60 * dt;
    particle.y += particle.vy * 60 * dt;
    particle.vy += 1.2 * dt;
    if (particle.life <= 0) state.particles.splice(i, 1);
  }
}

export function tickFade(dt) {
  if (state.fade.job) {
    state.fade.value += dt * 1.9;
    if (state.fade.value >= 1) {
      const job = state.fade.job;
      state.fade.job = null;
      job();
    }
  } else if (state.fade.value > 0) {
    state.fade.value -= dt * 1.9;
    if (state.fade.value < 0) state.fade.value = 0;
  }
}

export function isDay() {
  return state.clock > 0.22 && state.clock < 0.78;
}

export function isNight() {
  return !isDay();
}
