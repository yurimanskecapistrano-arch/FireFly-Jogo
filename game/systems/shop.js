/* =========================================================
   LOJA
   ========================================================= */

import { save, saveGame } from './save.js';
import { state, addParticles } from '../core/state.js';
import { SHOP } from '../data/game-data.js';
import { ui } from '../core/dom.js';
import { closeDialog } from '../render/dialog.js';
import { notify } from '../render/notify.js';
import { AudioManager } from './audio.js';

export function shopDialog() {
  const rows = SHOP.map(([id, name, description, price]) => {
    const owned = save.inventory[id] || 0; const canBuy = save.coins >= price;
    return `<div class="card"><div><b>${name}</b><small>${description}</small><small>${price} moedas · possui ${owned}</small></div><button class="buy" data-buy="${id}" ${canBuy ? '' : 'disabled'}>COMPRAR</button></div>`;
  }).join('');
  ui.dialog.innerHTML = `<button class="close">×</button><h2>Lojinha da Lumina</h2><p>Ferramentas honestas. Preços mais ou menos.</p><p><b>✦ ${save.coins} moedas</b></p>${rows}`;
  ui.dialog.classList.remove('hidden');
  const closeButton = ui.dialog.querySelector('.close'); if (closeButton) closeButton.onclick = closeDialog;
  ui.dialog.querySelectorAll('[data-buy]').forEach((button) => { button.onclick = () => buy(button.dataset.buy); });
}

export function buy(id) {
  const item = SHOP.find((entry) => entry[0] === id); if (!item) return;
  const [itemId, itemName, , price] = item;
  if (save.coins < price) { notify('Você não tem moedas suficientes.'); AudioManager.playSFX('error'); return; }
  save.coins -= price; save.inventory[itemId] = (save.inventory[itemId] || 0) + 1; saveGame(); addParticles(state.player.x, state.player.y, '#ffd66e', 10); AudioManager.playSFX('purchase'); notify('COMPRADO! +1 ' + itemName); shopDialog();
}
