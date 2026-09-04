/* =========================================================
   MUNDO VIVO — relógio, rotinas, eventos e comportamento social
   ========================================================= */
import { state, addParticles, isNight } from '../core/state.js';
import { save, saveGame } from './save.js';
import { NPCS, EVENTS } from '../data/living-world-data.js';
import { AudioManager } from './audio.js';

const DEST = {home:120,square:380,shop:630,workshop:820,lake:1080,flowers:1160,tavern:940};
let eventRoll=0;

export function worldHour(){ return state.clock*24; }
export function clockLabel(){ const h=worldHour(), hh=Math.floor(h)%24, mm=Math.floor((h%1)*60); return `${String(hh).padStart(2,'0')}:${String(mm).padStart(2,'0')}`; }
function targetFor(npc){
 const h=worldHour(); let chosen=npc.schedule[0][1];
 for(const [time,place] of npc.schedule){const [th,tm]=time.split(':').map(Number);if(h>=th+tm/60)chosen=place;}
 return DEST[chosen] ?? 380;
}
export function updateLivingWorld(dt){
 if(state.map!=='village') return;
 for(const npc of state.npcs||[]){const target=targetFor(npc);const speed=38;npc.x += Math.sign(target-npc.x)*Math.min(Math.abs(target-npc.x),speed*dt);npc.place=Math.abs(target-npc.x)<8 ? npc.place : npc.place;}
 eventRoll+=dt;
 if(eventRoll>18){eventRoll=0;tryStartEvent();}
}
export function tryStartEvent(){
 const h=worldHour(); const active=EVENTS.filter(e=>e.maps.includes(state.map)&&inHours(h,e.hours));
 if(!active.length||Math.random()>Math.max(...active.map(e=>e.chance)))return;
 const e=active[Math.floor(Math.random()*active.length)];state.worldEvent={id:e.id,name:e.name,time:e.duration};addParticles(state.player.x,state.player.y,'#f7df88',22);AudioManager.playSFX('discover');save.progression.stats.events=(save.progression.stats.events||0)+1;saveGame();
}
function inHours(h,[a,b]){ if(a<=b)return h>=a&&h<b;return h>=a||h<b; }
export function tickWorldEvent(dt){if(!state.worldEvent)return;state.worldEvent.time-=dt;if(state.worldEvent.time<=0)state.worldEvent=null;}
export function spawnVillageNPCs(){
 state.npcs=[
  {id:'tito',x:460,y:505,homeX:120,place:'square'},
  {id:'luna',x:720,y:505,homeX:180,place:'shop'},
  {id:'theo',x:820,y:505,homeX:260,place:'workshop'},
  {id:'maya',x:630,y:505,homeX:350,place:'shop'},
  {id:'nico',x:1080,y:505,homeX:420,place:'lake'}
 ];
}
export function npcInfo(id){return NPCS[id]||{};}
