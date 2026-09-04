/* FireFly 5 — economia viva */
import {save,saveGame} from './save.js';
import {state,addParticles} from '../core/state.js';
import {ECONOMY_ITEMS,SHOP_TIERS,shopTierFor} from '../data/economy-data.js';
import {notify} from '../render/notify.js';
import {AudioManager} from './audio.js';
import {addXp} from './progression.js';

export function ensureEconomy(){
 save.economy??={reputation:0,totalSold:0,totalEarned:0,shopTier:1,orders:{},salesLog:[]};
 save.economy.orders??={};save.economy.salesLog??=[];
 save.economy.shopTier=shopTierFor(save.economy.reputation);
}
function wallet(){return save.coins||0;}
function addRep(n){ensureEconomy();const before=save.economy.shopTier;save.economy.reputation+=n;save.economy.shopTier=shopTierFor(save.economy.reputation);if(save.economy.shopTier>before)notify(`🏪 A loja evoluiu para ${SHOP_TIERS[save.economy.shopTier-1].name}!`);}
function payout(base){const tier=save.economy.shopTier||1;const bonus=1+(tier-1)*.04;return Math.max(1,Math.round(base*bonus));}
export function sellResource(id,amount=1){ensureEconomy();const have=save.progression?.resources?.[id]||0;if(have<amount)return false;const item=ECONOMY_ITEMS[id];if(!item)return false;save.progression.resources[id]-=amount;const total=payout(item.sell*amount);save.coins+=total;save.economy.totalSold+=amount;save.economy.totalEarned+=total;addRep(Math.max(1,Math.ceil(amount/3)));save.economy.salesLog.unshift({id,amount,total,time:Date.now()});save.economy.salesLog=save.economy.salesLog.slice(0,12);addXp(Math.min(20,amount*2),'venda');saveGame();addParticles(state.player.x,state.player.y,'#ffd66e',14);AudioManager.playSFX('coin');notify(`VENDIDO · ${item.icon} ${amount}x ${item.name} · +${total}✦`);return true;}
export function sellCatch(key,amount=1){ensureEconomy();const have=save.catches?.[key]||0;if(have<amount)return false;const type=key.split(':')[0],item=ECONOMY_ITEMS[type];if(!item)return false;const variant=key.includes(':');const multiplier=variant?1.35:1;save.catches[key]-=amount;const total=payout(Math.round(item.sell*multiplier)*amount);save.coins+=total;save.economy.totalSold+=amount;save.economy.totalEarned+=total;addRep(Math.max(2,Math.ceil(amount/2)));save.economy.salesLog.unshift({id:key,amount,total,time:Date.now()});save.economy.salesLog=save.economy.salesLog.slice(0,12);addXp(Math.min(24,amount*3),'venda captura');saveGame();addParticles(state.player.x,state.player.y,'#ffe47a',18);AudioManager.playSFX('coin');notify(`VENDA · ${item.name}${variant?' (variante)':''} · +${total}✦`);return true;}
export function buyShopItem(id,basePrice){ensureEconomy();const tier=SHOP_TIERS[save.economy.shopTier-1];const price=Math.max(1,Math.round(basePrice*(1-tier.discount)));if(save.coins<price){notify(`Faltam ${price-save.coins} moedas.`);AudioManager.playSFX('error');return false;}save.coins-=price;save.inventory[id]=(save.inventory[id]||0)+1;save.economy.reputation+=1;saveGame();addParticles(state.player.x,state.player.y,'#ffe08a',12);AudioManager.playSFX('purchase');notify(`COMPRADO · ${id} · -${price}✦`);return true;}
export function economySummary(){ensureEconomy();return {rep:save.economy.reputation,tier:save.economy.shopTier,earned:save.economy.totalEarned,sold:save.economy.totalSold};}
export function shopCatalog(){ensureEconomy();return SHOP_TIERS[save.economy.shopTier-1].items.map(([id,name,price])=>({id,name,price:Math.max(1,Math.round(price*(1-SHOP_TIERS[save.economy.shopTier-1].discount)))}));}
