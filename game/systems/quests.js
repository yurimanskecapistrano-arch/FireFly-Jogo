/* =========================================================
   QUEST SYSTEM
   ========================================================= */

import { save, saveGame } from './save.js';
import { state, addParticles } from '../core/state.js';
import { QUESTS } from '../data/game-data.js';
import { dialog, closeDialog } from '../render/dialog.js';
import { notify } from '../render/notify.js';
import { AudioManager } from './audio.js';

export function quest() {
  if (!save.quests.tito_frogs) save.quests.tito_frogs = { status: 'available', progress: 0 };
  return save.quests.tito_frogs;
}

export function acceptQuest() {
  const q = quest(); q.status = 'active'; q.progress = 0; saveGame(); closeDialog(); notify('Missão aceita: capture 3 sapos.'); AudioManager.playSFX('coin');
}

export function claimQuest() {
  const q = quest(); const definition = QUESTS.tito_frogs;
  if (q.status !== 'complete') return;
  q.status = 'claimed'; save.coins += definition.reward.coins;
  for (const [item, amount] of Object.entries(definition.reward.items)) save.inventory[item] = (save.inventory[item] || 0) + amount;
  saveGame(); closeDialog(); addParticles(state.player.x, state.player.y, '#ffd66e', 28); notify('MISSÃO CONCLUÍDA! +50 moedas, +1 Isca'); AudioManager.playSFX('quest-complete');
}

export function titoDialog() {
  const q = quest();
  if (q.status === 'available') { dialog('Tito, inventor de redes', 'Ei! Você viu quantos sapos apareceram perto da floresta? Me traz 3 sapos e eu te dou umas moedas.', [['ACEITAR', acceptQuest], ['AINDA NÃO', closeDialog]]); return; }
  if (q.status === 'active') { dialog('Tito', 'Estou ouvindo a lagoa daqui. Sapos encontrados: ' + q.progress + ' / 3.', [['VOLTAR', closeDialog]]); return; }
  if (q.status === 'complete') { dialog('Tito', 'Você conseguiu! Caramba, esses sapos são rápidos. Vamos acertar sua recompensa.', [['ENTREGAR SAPOS', claimQuest]]); return; }
  dialog('Tito', 'A rede parece feliz com você por perto. Obrigado pela ajuda com a lagoa!', [['TCHAU', closeDialog]]);
}
