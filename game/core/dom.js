/* =========================================================
   CANVAS / DOM
   ========================================================= */

export const canvas = document.querySelector('#game');

if (!canvas) {
  throw new Error('FireFly: elemento #game não encontrado no index.html.');
}

export const ctx = canvas.getContext('2d');
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
