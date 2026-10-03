/* =========================================================
   MUNDO VIVO — relógio, rotinas e atividades dos NPCs
   Eventos globais pertencem exclusivamente a systems/events.js.
   ========================================================= */
import {state} from '../core/state.js';
import {NPCS} from '../data/living-world-data.js';

const DEST={home:120,square:380,shop:520,workshop:780,lake:1160,flowers:1320,tavern:1420};

export function worldHour(){return state.clock*24;}
export function clockLabel(){const h=worldHour(),hh=Math.floor(h)%24,mm=Math.floor((h%1)*60);return `${String(hh).padStart(2,'0')}:${String(mm).padStart(2,'0')}`;}

function targetFor(npc){
  const h=worldHour();
  const schedule=NPCS[npc.id]?.schedule;
  if(!schedule?.length)return npc.x??380;
  let chosen=schedule[schedule.length-1][1];
  for(const [time,place] of schedule){
    const [th,tm]=time.split(':').map(Number);
    if(h>=th+tm/60)chosen=place;
  }
  return DEST[chosen]??380;
}

function currentPlace(npc){
  const target=targetFor(npc);let best='square',dist=Infinity;
  for(const [place,x] of Object.entries(DEST)){
    const d=Math.abs(x-target);
    if(d<dist){dist=d;best=place;}
  }
  return best;
}

export function updateLivingWorld(dt){
  if(state.map!=='village')return;
  for(const npc of state.npcs||[]){
    const target=targetFor(npc),speed=npc.id==='nico'?45:38;
    npc.targetX=target;
    npc.x+=Math.sign(target-npc.x)*Math.min(Math.abs(target-npc.x),speed*dt);
    npc.place=currentPlace(npc);
    npc.activity={tito:'research',luna:'botany',theo:'forge',maya:'trade',nico:'fish'}[npc.id]||'idle';
    const i=state.interactables?.find(o=>o.id==='npc-'+npc.id);
    if(i){i.x=npc.x;i.y=npc.y;}
  }
}

export function spawnVillageNPCs(){
  state.npcs=[
    {id:'tito',x:380,y:505,homeX:120,place:'square',activity:'research'},
    {id:'luna',x:520,y:505,homeX:180,place:'shop',activity:'botany'},
    {id:'theo',x:780,y:505,homeX:260,place:'workshop',activity:'forge'},
    {id:'maya',x:1050,y:505,homeX:350,place:'shop',activity:'trade'},
    {id:'nico',x:1160,y:505,homeX:420,place:'lake',activity:'fish'}
  ];
}

export function npcInfo(id){return NPCS[id]||{};}
