/* =========================================================
   NOTIFICAÇÃO
   ========================================================= */

import { ui } from '../core/dom.js';
export function notify(message) { if (!ui.toast) return; ui.toast.textContent = message; ui.toast.classList.add('show'); clearTimeout(notify.timer); notify.timer = setTimeout(() => ui.toast.classList.remove('show'), 2300); }
