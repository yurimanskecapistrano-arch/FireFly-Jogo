/* =========================================================
   CANVAS / DOM
   ========================================================= */

export const canvas = document.querySelector('#game');

if (!canvas) {
  throw new Error('FireFly: elemento #game não encontrado no index.html.');
}

// Render at 640×360, then upscale with nearest-neighbour. Two canvas pixels map to one 4-unit art tile.
canvas.width = 640;
canvas.height = 360;
export const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;
ctx.scale(0.5, 0.5);
export const $ = (selector) => document.querySelector(selector);

export const ui = {
  coins: $('#coins'),
  time: $('#time'),
  prompt: $('#prompt'),
  panel: $('#panel'),
  dialog: $('#dialog'),
  toast: $('#toast'),
  mute: $('#mute'),
  location: $('#locationBadge'),
  locationTitle: $('#locationTitle'),
  locationSub: $('#locationSub')
};
