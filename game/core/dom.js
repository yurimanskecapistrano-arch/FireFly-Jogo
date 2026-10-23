/* =========================================================
   CANVAS / DOM
   ========================================================= */

export const canvas = document.querySelector('#game');

if (!canvas) {
  throw new Error('FireFly: elemento #game não encontrado no index.html.');
}

// Render at 320×180, then upscale with nearest-neighbour for a chunky pixel look.
canvas.width = 320;
canvas.height = 180;
export const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;
ctx.scale(0.25, 0.25);
export const $ = (selector) => document.querySelector(selector);

export const ui = {
  coins: $('#coins'),
  time: $('#time'),
  prompt: $('#prompt'),
  panel: $('#panel'),
  dialog: $('#dialog'),
  toast: $('#toast'),
  mute: $('#mute')
};
