/* FireFly 5 — diálogos */
import { ui } from '../core/dom.js';

export function dialog(title = '', body = '', actions = []) {
  if (!ui.dialog) return;
  const normalized = (Array.isArray(actions) ? actions : (actions == null ? [] : [actions])).map(action => {
    if (Array.isArray(action)) return [String(action[0] ?? 'OK'), typeof action[1] === 'function' ? action[1] : closeDialog];
    if (action && typeof action === 'object') return [String(action.label ?? action.text ?? action.title ?? 'OK'), typeof action.onClick === 'function' ? action.onClick : closeDialog];
    return [String(action ?? 'OK'), closeDialog];
  });
  ui.dialog.innerHTML = `<button class="close">×</button><h2>${String(title ?? '')}</h2><p>${String(body ?? '')}</p>${normalized.map((action,index)=>`<button class="choice action-${index}">${action[0]}</button>`).join('')}`;
  ui.dialog.classList.remove('hidden');
  const close = ui.dialog.querySelector('.close');
  if (close) close.onclick = closeDialog;
  normalized.forEach((action,index) => {
    const button = ui.dialog.querySelector('.action-' + index);
    if (button) button.onclick = action[1];
  });
}

export function closeDialog() {
  if (ui.dialog) ui.dialog.classList.add('hidden');
}
