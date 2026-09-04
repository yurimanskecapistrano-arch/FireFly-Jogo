import { state, addParticles } from '../core/state.js';
import { save, saveGame } from './save.js';
import { RESOURCE_TYPES, RECIPES, LEVELS, UPGRADES, zoneAt } from '../data/progression-data.js';
import { notify } from '../render/notify.js';
import { AudioManager } from './audio.js';

const RESPAWN_JITTER = 0.35;

export function ensureProgression(){
  save.progression ??= { xp:0, level:1, resources:{}, crafted:{}, upgrades:{}, stats:{gathered:0,crafted:0,steps:0} };
  save.progression.resources ??= {};
  save.progression.crafted ??= {};
  save.progression.upgrades ??= {};
  save.progression.stats ??= {gathered:0,crafted:0,steps:0};
  save.progression.level ??= levelFromXp(save.progression.xp||0);
}

export function levelFromXp(xp){
  let level=1;
  for(let i=1;i<LEVELS.length;i++) if(xp>=LEVELS[i]) level=i+1;
  return level;
}
export function xpForNext(){ ensureProgression(); return LEVELS[save.progression.level] ?? LEVELS.at(-1); }
export function addXp(amount, reason=''){
  ensureProgression();
  const old=save.progression.level;
  save.progression.xp += Math.max(0,amount);
  save.progression.level=levelFromXp(save.progression.xp);
  if(save.progression.level>old){
    notify(`✨ Nível ${save.progression.level}! Novas possibilidades desbloqueadas.`);
    addParticles(state.player.x,state.player.y,'#ffe37b',22);
    AudioManager.playSFX('success');
  }
  saveGame();
}

function resourceAmount(id){ return save.progression.resources[id]||0; }
function addResource(id,amount=1){ ensureProgression(); save.progression.resources[id]=(save.progression.resources[id]||0)+amount; }

export function spawnResources(){
  ensureProgression();
  state.resources=[];
  const map=state.map;
  const specs=map==='cave'?[
    ['crystal',1450,1800,8],['ore',700,3500,10],['mushroom',900,3200,7]
  ]:[
    ['wood',180,5100,18],['fiber',700,5000,17],['mushroom',2400,5100,7],['ore',3500,5000,7]
  ];
  for(const [type,from,to,count] of specs){
    const data=RESOURCE_TYPES[type];
    for(let i=0;i<count;i++){
      let x=from+((i*791+type.length*137)%Math.max(1,to-from));
      const zone=zoneAt(map,x);
      if(data.zones.includes(zone)||map==='cave'&&data.zones.includes(zone)) state.resources.push({id:`${type}-${i}`,type,x,y:type==='wood'?500:525,alive:true,respawn:0,phase:i*.8});
    }
  }
}

export function updateResources(dt){
  if(!state.resources)return;
  for(const r of state.resources){
    if(!r.alive){r.respawn-=dt;if(r.respawn<=0){r.alive=true;notify(`${RESOURCE_TYPES[r.type].name} reapareceu.`);}}
  }
}

export function nearestResource(){
  const p=state.player;
  return (state.resources||[]).filter(r=>r.alive&&Math.abs(r.x-p.x)<78&&Math.abs(r.y-p.y)<90).sort((a,b)=>Math.abs(a.x-p.x)-Math.abs(b.x-p.x))[0];
}

export function gatherNearest(){
  const r=nearestResource();
  if(!r)return false;
  const data=RESOURCE_TYPES[r.type];
  const bonus=save.progression.upgrades.pocket?1:0;
  const amount=1+(Math.random()<.22?1:0)+bonus;
  addResource(r.type,amount);r.alive=false;r.respawn=data.respawn*(0.9+Math.random()*RESPAWN_JITTER);
  save.progression.stats.gathered += amount;
  addXp(7+amount*2,`coleta:${r.type}`);
  addParticles(r.x,r.y,data.color,12);
  AudioManager.playSFX('collect');
  notify(`${data.icon} +${amount} ${data.name}`);
  saveGame();return true;
}

function hasCost(cost){return Object.entries(cost).every(([id,n])=>resourceAmount(id)>=n);}
function payCost(cost){for(const [id,n] of Object.entries(cost))save.progression.resources[id]-=n;}

export function craft(id){
  ensureProgression();
  const recipe=RECIPES.find(r=>r.id===id);if(!recipe)return false;
  if(save.progression.level<recipe.unlockLevel){notify(`🔒 Requer nível ${recipe.unlockLevel}.`);return false;}
  if(save.progression.crafted[id]){notify('Você já fabricou este item.');return false;}
  if(!hasCost(recipe.cost)){notify('Faltam materiais para fabricar isso.');return false;}
  payCost(recipe.cost);save.progression.crafted[id]=true;save.progression.stats.crafted++;
  if(id==='better_net')save.inventory.reinforcedNet=1;
  if(id==='lantern')save.inventory.lantern=1;
  if(id==='exploration_kit')save.inventory.explorationKit=1;
  if(id==='lucky_charm')save.inventory.luckyCharm=1;
  if(id==='master_net')save.inventory.masterNet=1;
  addXp(30+recipe.unlockLevel*8,'craft');
  notify(`🔧 ${recipe.name} fabricada!`);AudioManager.playSFX('success');saveGame();return true;
}

export function buyUpgrade(id){
  ensureProgression();const up=UPGRADES.find(u=>u.id===id);if(!up)return false;
  if(save.progression.level<up.level){notify(`🔒 Requer nível ${up.level}.`);return false;}
  if(save.progression.upgrades[id]){notify('Upgrade já instalado.');return false;}
  if(save.coins<up.cost){notify('Moedas insuficientes.');return false;}
  save.coins-=up.cost;save.progression.upgrades[id]=true;addXp(20,'upgrade');notify(`⬆ ${up.name} instalado.`);saveGame();return true;
}

export function progressSummary(){ensureProgression();const lvl=save.progression.level;const prev=LEVELS[lvl-1]||0;const next=LEVELS[lvl]||LEVELS.at(-1);return {level:lvl,xp:save.progression.xp,next,nextDelta:Math.max(0,next-save.progression.xp),ratio:next===prev?1:Math.min(1,(save.progression.xp-prev)/(next-prev))};}

export function drawResources(ctx,wx){
  for(const r of state.resources||[]){if(!r.alive)continue;const d=RESOURCE_TYPES[r.type],x=wx(r.x),y=r.y+Math.sin(state.t*1.4+r.phase)*2;ctx.save();ctx.globalAlpha=.96;ctx.shadowColor=d.color;ctx.shadowBlur=8;ctx.fillStyle=d.color;
    if(r.type==='wood'){ctx.fillRect(x-10,y-35,20,35);ctx.fillStyle='#d19a69';ctx.beginPath();ctx.arc(x,y-39,13,0,Math.PI*2);ctx.fill();}
    else if(r.type==='crystal'||r.type==='ore'){ctx.beginPath();ctx.moveTo(x,y-40);ctx.lineTo(x+14,y-17);ctx.lineTo(x+5,y);ctx.lineTo(x-12,y);ctx.lineTo(x-15,y-22);ctx.closePath();ctx.fill();}
    else if(r.type==='mushroom'){ctx.fillStyle='#ead7bf';ctx.fillRect(x-3,y-18,6,18);ctx.fillStyle=d.color;ctx.beginPath();ctx.arc(x,y-20,13,Math.PI,0);ctx.fill();}
    else {ctx.beginPath();ctx.ellipse(x,y-18,17,6,0,0,Math.PI*2);ctx.fill();ctx.fillRect(x-3,y-18,6,18);}
    ctx.shadowBlur=0;ctx.restore();
  }
}
