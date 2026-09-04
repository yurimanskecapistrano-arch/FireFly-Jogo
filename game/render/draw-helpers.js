/* =========================================================
   DRAW HELPERS
   ========================================================= */

import { ctx } from '../core/dom.js';
import { state } from '../core/state.js';

export function wx(x) { return x - state.camera.x; }
export function poly(points, fill, stroke) { ctx.beginPath(); points.forEach(([x,y], i) => i === 0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y)); ctx.closePath(); if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 3; ctx.stroke(); } }
export function txt(string, x, y, size = 15, color = '#fff', align = 'left') { ctx.fillStyle = color; ctx.font = `700 ${size}px system-ui`; ctx.textAlign = align; ctx.fillText(string, x, y); }
