/* FireFly 5 — pedidos específicos dos moradores */
import {save,saveGame} from './save.js';
import {ORDERS} from '../data/economy-data.js';
import {notify} from '../render/notify.js';
import {addXp} from './progression.js';
import {AudioManager} from './audio.js';

export function ensureOrders(){save.economy??={reputation:0,totalSold:0,totalEarned:0,shopTier:1,orders:{},salesLog:[]};save.economy.orders??={};}
export function orderState(id){ensureOrders();return save.economy.orders[id]||{status:'available',progress:0};}
export function acceptOrder(id){ensureOrders();const d=ORDERS.find(o=>o.id===id);if(!d)return false;const q=orderState(id);if(q.status!=='available')return false;q.status='active';q.progress=0;save.economy.orders[id]=q;saveGame();notify(`📦 Pedido aceito: ${d.title}`);AudioManager.playSFX('coin');return true;}
export function addOrderProgress(kind,target,amount=1){ensureOrders();for(const d of ORDERS){const q=orderState(d.id);if(q.status!=='active'||d.kind!==kind||d.target!==target)continue;q.progress=Math.min(d.required,q.progress+amount);if(q.progress>=d.required){q.status='complete';notify(`✓ Pedido pronto: ${d.title}. Volte para ${d.giver}.`);AudioManager.playSFX('success');}}saveGame();}
export function claimOrder(id){ensureOrders();const d=ORDERS.find(o=>o.id===id);const q=orderState(id);if(!d||q.status!=='complete')return false;q.status='claimed';save.coins+=d.reward;save.progression.xp+=d.xp;save.progression.level=Math.max(save.progression.level,1);save.economy.reputation+=d.rep;saveGame();notify(`PEDIDO ENTREGUE · +${d.reward}✦ · +${d.rep} reputação`);AudioManager.playSFX('quest-complete');return true;}
export function orderList(){ensureOrders();return ORDERS.map(d=>({...d,state:orderState(d.id)}));}
