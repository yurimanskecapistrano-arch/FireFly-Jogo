/* =========================================================
   PAINÉIS
   ========================================================= */
import { ui } from '../core/dom.js';
import { save } from '../systems/save.js';
import { names, rarity, itemNames, QUESTS } from '../data/game-data.js';
import { quest } from '../systems/quests.js';
export function panel(kind) {
  if (!ui.panel) return;
  let body = '';
  if (kind === 'bag') {
    const entries = [...Object.entries(save.inventory), ...Object.entries(save.catches)].filter(([, amount]) => amount > 0);
    body = entries.length ? entries.map(([id, amount]) => { const displayName = names[id] || itemNames[id] || id; return `<div class="card"><div><b>${displayName}</b><small>Quantidade: ${amount}</small></div></div>`; }).join('') : '<p>A mochila está vazia.</p>';
    ui.panel.innerHTML = `<button class="close">×</button><h2 class="panel-title">Mochila</h2><p class="panel-sub">Seus equipamentos e criaturas.</p>${body}`;
  }
  if (kind === 'book') {
    body = Object.keys(names).map((id) => { const discovered = !!save.discovered[id]; return `<div class="card"><div><b>${discovered ? names[id] : '???'}</b><small>${discovered ? rarity[id] : 'continue explorando'}</small></div></div>`; }).join('');
    const discoveredCount = Object.keys(names).filter((id) => save.discovered[id]).length;
    ui.panel.innerHTML = `<button class="close">×</button><h2 class="panel-title">Bestiário</h2><p class="panel-sub">Descobertas: ${discoveredCount}/${Object.keys(names).length}</p>${body}`;
  }
  if (kind === 'quest') {
    const q = quest(); const progress = q.status === 'claimed' ? 3 : q.progress; const percentage = Math.min(100, (progress / 3) * 100);
    const statusText = q.status === 'available' ? 'Fale com Tito' : q.status === 'claimed' ? 'Concluída' : q.status === 'complete' ? 'Volte para Tito' : q.progress + ' / 3 sapos';
    ui.panel.innerHTML = `<button class="close">×</button><h2 class="panel-title">Missões</h2><div class="card"><div><b>${QUESTS.tito_frogs.title}</b><small>${statusText}</small><div class="bar"><i style="width:${percentage}%"></i></div><small>Recompensa: 50 moedas + 1 isca</small></div></div>`;
  }
  ui.panel.classList.remove('hidden');
  const close = ui.panel.querySelector('.close');
  if (close) close.onclick = () => ui.panel.classList.add('hidden');
}
