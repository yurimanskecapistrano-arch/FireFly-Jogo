/* =========================================================
   DIÁLOGOS
   ========================================================= */

import { ui } from '../core/dom.js';

export function dialog(title, body, actions) {
  if (!ui.dialog) return;
  ui.dialog.innerHTML = `<button class="close">×</button><h2>${title}</h2><p>${body}</p>${actions.map((action, index) => `<button class="choice action-${index}">${action[0]}</button>`).join('')}`;
  ui.dialog.classList.remove('hidden');
  const close = ui.dialog.querySelector('.close'); if (close) close.onclick = closeDialog;
  actions.forEach((action, index) => { const button = ui.dialog.querySelector('.action-' + index); if (button) button.onclick = action[1]; });
}
export function closeDialog() { if (ui.dialog) ui.dialog.classList.add('hidden'); }
