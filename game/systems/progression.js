import { state, addParticles } from '../core/state.js';
import { save, saveGame } from './save.js';
import { RESOURCE_TYPES, RECIPES, LEVELS, UPGRADES, zoneAt } from '../data/progression-data.js';
import { notify } from '../render/notify.js';
import { AudioManager } from './audio.js';

const RESPAWN_JITTER = 0.35;
const BASE_RESOURCE_CAPACITY = 20;

export function ensureProgression(){
  save.progression ??= { xp:0, level:1, resources:{}, crafted:{}, upgrades:{}, stats:{gathered:0,crafted:0,steps:0} };
  save.progression.resources ??= {};
  save.progression.crafted ??= {};
  save.progression.upgrades ??= {};
  save.progression.stats ??= {gathered:0,crafted:0,steps:0};
  save.progression.level ??= levelFromXp(save.progression.xp||0);
}
export function levelFromXp(xp){let level=1;for(let i=1;i<LEVELS.length;i++)if(xp>=LEVELS[i])level=i+1;return level;}
export function xpForNext(){ensureProgression();return LEVELS[save.progression.level]??LEVELS.at(-1);}
export function addXp(amount,reason=''){ensureProgression();const old=save.progression.level;save.progression.xp+=Math.max(0,amount);save.progression.level=levelFromXp(save.progression.xp);if(save.progression.level>old){notify(`✨ Nível ${save.progression.level}! Novas possibilidades desbloqueadas.`);addParticles(state.player.x,state.player.y,'#ffe37b',22);AudioManager.playSFX('success');}saveGame();}
function resourceAmount(id){return save.progression.resources[id]||0;}
function addResource(id,amount=1){ensureProgression();save.progression.resources[id]=(save.progression.resources[id]||0)+amount;}
export function resourceCapacity(){ensureProgression();let cap=BASE_RESOURCE_CAPACITY;if(save.progression.upgrades.pocket)cap+=8;if(save.progression.upgrades.van_storage)cap+=20;return cap;}
export function resourceLoad(){ensureProgression();return Object.values(save.progression.resources).reduce((sum,n)=>sum+(Number(n)||0),0);}
export function resourceSpace(){return Math.max(0,resourceCapacity()-resourceLoad());}
export function spawnResources(){ensureProgression();state.resources=[];const map=state.map;const specs=map==='cave'?[['crystal',1450,1800,8],['ore',700,3500,10],['mushroom',900,3200,7]]:[['wood',180,5100,18],['fiber',700,5000,17],['mushroom',2400,5100,7],['ore',3500,5000,7]];for(const [type,from,to,count] of specs){const data=RESOURCE_TYPES[type];for(let i=0;i<count;i++){const x=from+((i*791+type.length*137)%Math.max(1,to-from));const zone=zoneAt(map,x);if(data.zones.includes(zone)||map==='cave'&&data.zones.includes(zone))state.resources.push({id:`${type}-${i}`,type,x,y:type==='wood'?500:525,alive:true,respawn:0,phase:i*.8});}}}
export function updateResources(dt){if(!state.resources)return;for(const r of state.resources)if(!r.alive){r.respawn-=dt;if(r.respawn<=0){r.alive=true;notify(`${RESOURCE_TYPES[r.type].name} reapareceu.`);}}}
export function nearestResource(){const p=state.player;return(state.resources||[]).filter(r=>r.alive&&Math.abs(r.x-p.x)<78&&Math.abs(r.y-p.y)<90).sort((a,b)=>Math.abs(a.x-p.x)-Math.abs(b.x-p.x))[0];}
export function gatherNearest(){const r=nearestResource();if(!r)return false;const data=RESOURCE_TYPES[r.type];const space=resourceSpace();if(space<=0){notify(`Mochila cheia · ${resourceLoad()}/${resourceCapacity()} recursos.`);AudioManager.playSFX('error');return false;}const bonus=save.progression.upgrades.pocket?1:0;const wanted=1+(Math.random()<.22?1:0)+bonus;const amount=Math.min(space,wanted);addResource(r.type,amount);r.alive=false;r.respawn=data.respawn*(0.9+Math.random()*RESPAWN_JITTER);save.progression.stats.gathered+=amount;addXp(7+amount*2,`coleta:${r.type}`);import('./orders.js').then(({addOrderProgress})=>addOrderProgress('resource',r.type,amount));addParticles(r.x,r.y,data.color,12);AudioManager.playSFX('collect');notify(`${data.icon} +${amount} ${data.name} · ${resourceLoad()}/${resourceCapacity()}`);saveGame();return true;}
function hasCost(cost){return Object.entries(cost).every(([id,n])=>resourceAmount(id)>=n);}
function payCost(cost){for(const [id,n] of Object.entries(cost))save.progression.resources[id]-=n;}
export function craft(id){ensureProgression();const recipe=RECIPES.find(r=>r.id===id);if(!recipe)return false;if(save.progression.level<recipe.unlockLevel){notify(`🔒 Requer nível ${recipe.unlockLevel}.`);return false;}if(save.progression.crafted[id]){notify('Você já fabricou este item.');return false;}if(!hasCost(recipe.cost)){notify('Faltam materiais para fabricar isso.');return false;}payCost(recipe.cost);save.progression.crafted[id]=true;save.progression.stats.crafted++;if(id==='better_net')save.inventory.reinforcedNet=1;if(id==='lantern')save.inventory.lantern=1;if(id==='exploration_kit')save.inventory.explorationKit=1;if(id==='lucky_charm')save.inventory.luckyCharm=1;if(id==='master_net')save.inventory.masterNet=1;addXp(30+recipe.unlockLevel*8,'craft');notify(`🔧 ${recipe.name} fabricada!`);AudioManager.playSFX('success');saveGame();return true;}
export function buyUpgrade(id){ensureProgression();const up=UPGRADES.find(u=>u.id===id);if(!up)return false;if(save.progression.level<up.level){notify(`🔒 Requer nível ${up.level}.`);return false;}if(save.progression.upgrades[id]){notify('Upgrade já instalado.');return false;}if(save.coins<up.cost){notify('Moedas insuficientes.');return false;}save.coins-=up.cost;save.progression.upgrades[id]=true;addXp(20,'upgrade');notify(`⬆ ${up.name} instalado.`);saveGame();return true;}
export function progressSummary(){ensureProgression();const lvl=save.progression.level;const prev=LEVELS[lvl-1]||0;const next=LEVELS[lvl]||LEVELS.at(-1);return{level:lvl,xp:save.progression.xp,next,nextDelta:Math.max(0,next-save.progression.xp),ratio:next===prev?1:Math.min(1,(save.progression.xp-prev)/(next-prev)),capacity:resourceCapacity(),load:resourceLoad()};}
export function drawResources(ctx,wx){
  const px=n=>Math.round(n/4)*4;
  const tile=(x,y,w,h,color)=>{ctx.fillStyle=color;ctx.fillRect(px(x),px(y),Math.max(4,px(w)),Math.max(4,px(h)));};
  for(const r of state.resources||[]){
    if(!r.alive)continue;
    const d=RESOURCE_TYPES[r.type],x=wx(r.x),y=px(r.y+Math.sin(state.t*1.4+r.phase)*1.5);
    ctx.save();
    // Tiny ground shadow, shared by every collectible.
    tile(x-18,y+3,36,5,'#49654a');
    if(r.type==='wood'){
      // Warm log with bark, cut ends and visible growth rings.
      tile(x-24,y-20,48,20,'#76513e');
      tile(x-20,y-24,40,20,'#a97850');
      tile(x-16,y-20,32,12,'#c99665');
      tile(x-24,y-16,8,12,'#d8b17a');
      tile(x-20,y-16,4,8,'#f0d4a0');
      tile(x+16,y-16,8,12,'#d8b17a');
      tile(x+20,y-16,4,8,'#f0d4a0');
      tile(x-12,y-4,24,4,'#8a5e43');
      tile(x-8,y-12,4,4,'#e3bc82');
    }else if(r.type==='crystal'){
      // Three facets: teal shadow, mint body and a pale reflected edge.
      tile(x-4,y-48,12,8,'#6bb9b5');
      tile(x-8,y-40,20,8,'#8edbd0');
      tile(x-12,y-32,28,16,'#6fc4bd');
      tile(x-8,y-16,20,12,'#4b999e');
      tile(x-20,y-28,12,20,'#5ca9ad');
      tile(x+12,y-36,12,24,'#b9f0d9');
      tile(x-4,y-40,4,24,'#e4f7d7');
      tile(x-12,y-8,32,4,'#3d747b');
    }else if(r.type==='ore'){
      // Rounded stone cluster, with warm mineral flecks.
      tile(x-16,y-24,32,8,'#6c7776');
      tile(x-24,y-16,48,16,'#858e87');
      tile(x-20,y,40,4,'#535f5c');
      tile(x-12,y-28,24,8,'#aeb7a6');
      tile(x-12,y-16,8,8,'#c5bd98');
      tile(x+4,y-12,8,4,'#d8c98f');
      tile(x-4,y-8,4,4,'#a5b6a5');
    }else if(r.type==='mushroom'){
      // A soft cream stalk and a rosy, clustered cap with spots.
      tile(x-8,y-20,16,20,'#e9d9b8');
      tile(x-12,y-12,24,8,'#f5e8cc');
      tile(x-24,y-28,48,12,'#b77b9b');
      tile(x-20,y-36,40,8,'#d69bb7');
      tile(x-8,y-40,24,4,'#e8b6ca');
      tile(x-16,y-28,8,4,'#f5dfc9');
      tile(x+4,y-32,8,4,'#f5dfc9');
      tile(x+12,y-24,4,4,'#f5dfc9');
      tile(x-20,y-16,8,4,'#9a5f80');
    }else if(r.type==='fiber'){
      // Lunar fiber: three distinct leaf clusters rather than a generic block.
      tile(x-4,y-12,8,16,'#527d4d');
      tile(x-16,y-28,16,12,'#6eaa68');
      tile(x-24,y-32,12,8,'#9dcb82');
      tile(x+4,y-36,16,12,'#83b96f');
      tile(x+12,y-28,12,8,'#b5d991');
      tile(x-4,y-44,8,12,'#c7e2a0');
      tile(x-20,y-20,12,8,'#47734b');
      tile(x+8,y-20,16,8,'#5c965b');
      tile(x-4,y-4,8,8,'#d8bd7c');
    }
    // One tiny highlight pixel gives each object a consistent light direction.
    if(r.type!=='fiber')tile(x+20,y-32,4,4,'#f2e7c6');
    ctx.restore();
  }
}
