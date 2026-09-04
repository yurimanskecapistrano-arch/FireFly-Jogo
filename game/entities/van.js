/* =========================================================
   VAN
   ========================================================= */

import { state } from '../core/state.js';
import { notify } from '../render/notify.js';
import { AudioManager } from '../systems/audio.js';

export function startVan() {
  if (state.travel) return;
  state.travel = 1.5;
  AudioManager.playSFX('van-door');
  notify('A van sacode, a porta fecha...');
}
