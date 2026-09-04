/* =========================================================
   PLAYER — física e desenho
   ========================================================= */

import { ctx } from '../core/dom.js';
import { state } from '../core/state.js';
import { clamp } from '../core/utils.js';
import { moveAxis, isRunning } from '../core/input.js';
import { MAP_LIMITS } from '../core/constants.js';
import { wx, poly } from '../render/draw-helpers.js';

export function mapMaxX(mapId = state.map) {
  return MAP_LIMITS[mapId] ?? MAP_LIMITS.village;
}

export function updatePlayer(dt) {
  const p = state.player;
  const direction = moveAxis();
  const running = isRunning();
  const acceleration = running ? 900 : 580;
  p.vx += (direction * acceleration - p.vx) * Math.min(1, dt * 7);
  if (!direction) p.vx *= Math.max(0, 1 - dt * 9);
  const maxX = mapMaxX();
  p.x = clamp(p.x + p.vx * dt, 50, maxX);
  if (direction) p.face = direction;
  p.mode = Math.abs(p.vx) > 20 ? 'walk' : 'idle';
  p.action = Math.max(0, p.action - dt * 2.5);
  return maxX;
}

export function drawPlayer() {
  const p = state.player;
  const x = wx(p.x);
  const walk = p.mode === 'walk' ? Math.sin(state.t * 15) * 4 : Math.sin(state.t * 2);
  const action = p.action;
  ctx.save();
  ctx.translate(x, p.y + walk);
  ctx.scale(p.face, 1);
  if (action) ctx.rotate(-0.45 * Math.sin(action * 7));
  ctx.fillStyle = '#324a55';
  ctx.fillRect(-15, 38 + Math.abs(walk), 10, 11);
  ctx.fillRect(6, 38 - Math.abs(walk), 10, 11);
  poly([[-17, 10],[-22, 34],[-13, 45],[18, 43],[25, 24],[15, 9]], '#d36b55', '#293d49');
  ctx.fillStyle = '#7a4f45'; ctx.beginPath(); ctx.arc(-20, 26, 11, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#ffd29d'; ctx.beginPath(); ctx.arc(2, 1, 18, 0, Math.PI * 2); ctx.fill();
  poly([[-20, -1],[-11, -21],[12, -28],[25, -9],[15, -7],[-8, -8]], '#593d57', '#293d49');
  ctx.fillStyle = '#263d48'; ctx.fillRect(11, 2, 3, 3);
  ctx.strokeStyle = '#f3dec4'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(18, 20); ctx.lineTo(44, 2); ctx.stroke();
  ctx.beginPath(); ctx.arc(49, -3, 14, 0.4, 4.4); ctx.stroke();
  ctx.restore();
}
