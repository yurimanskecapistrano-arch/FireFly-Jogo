/* =========================================================
   FIREFLY 6 — EVENTOS
   Eventos temporários, enxames, migrações e acontecimentos únicos.
   ========================================================= */
import {state,addParticles,isNight} from '../core/state.js';
import {save,saveGame} from './save.js';
import {EVENT_DEFINITIONS} from '../data/events-data.js';
import {SPECIES_2} from '../data/capture-2-data.js';
import {AudioManager} from './audio.js';
import {notify} from '../render/notify.js';

let rollTimer=0;
let lastClock=-1;

const EVENT_TYPES={
  rain_front:['frog','otter'],
  thunderstorm:['owl','firefly'],
  firefly_night:['firefly','firefly','firefly','firefly','firefly','firefly','firefly','firefly'],
  migration:['deer','deer','deer','otter','deer'],
  butterfly_bloom:['butterfly','butterfly','butterfly','butterfly','butterfly','butterfly'],
  crystal_resonance:['cavefly','crystalbug','glowmoth','crystalbug'],
  moonfall:['rare','glowmoth','glowmoth']
};

function inHours(h,[a,b]){return a<=b?h>=a&&h<b:h>=a||h<b;}
function canRun(e){return e.maps.includes(state.map)&&inHours(state.clock*24,e.hours);}
function eventAlreadyUsed(id){return !!save.world?.eventFlags?.[id];}

export function updateEvents(dt){
  if(!state.eventRuntime){
    rollTimer+=dt;
    if(rollTimer>24){rollTimer=0;tryStartEvent();}
    return;
  }
  const r=state.eventRuntime;
  r.time-=dt;
  if(r.weather)state.weather={type:r.weather==='clear'?'sunny':r.weather,time:0};
  updateEventCreatures(dt);
  if(r.type==='storm'&&Math.random()<dt*.28){
    state.camera.shake=Math.max(state.camera.shake,7);
    addParticles(state.player.x+Math.random()*500-250,340, '#fff4c2',5);
    AudioManager.playSFX('discover');
  }
  if(r.time<=0)endEvent();
}

export function tryStartEvent(forceId=null){
  if(state.map!=='forest'&&state.map!=='cave')return false;
  if(state.eventRuntime||state.worldEvent)return false;
  const hour=state.clock*24;
  const pool=Object.values(EVENT_DEFINITIONS).filter(e=>canRun(e)&&(!e.unique||!eventAlreadyUsed(e.id)));
  if(!pool.length)return false;
  let chosen=forceId?EVENT_DEFINITIONS[forceId]:null;
  if(chosen&&!canRun(chosen))chosen=null;
  if(!chosen){
    const eligible=pool.filter(e=>!e.unique||!eventAlreadyUsed(e.id));
    if(!eligible.length)return false;
    if(Math.random()>Math.max(...eligible.map(e=>e.chance)))return false;
    chosen=eligible[Math.floor(Math.random()*eligible.length)];
  }
  startEvent(chosen);
  return true;
}

function startEvent(def){
  const previous=state.weather?.type||'sunny';
  state.eventRuntime={id:def.id,type:def.type,time:def.duration,weather:def.weather,previousWeather:previous};
  state.worldEvent={id:def.id,name:def.name,time:def.duration};
  state.eventCreatures=[];
  if(!save.world.eventFlags)save.world.eventFlags={};
  if(def.type==='unique')save.world.eventFlags[def.id]=true;
  save.progression.stats.events=(save.progression.stats.events||0)+1;
  spawnEventCreatures(def.id);
  addParticles(state.player.x,state.player.y,'#f7df88',30);
  notify(`EVENTO · ${def.name}`);
  saveGame();
  AudioManager.playSFX('discover');
}

function spawnEventCreatures(id){
  const types=EVENT_TYPES[id]||[];
  const center=Math.max(140,Math.min(5000,state.player.x+260));
  types.forEach((type,i)=>{
    const d=SPECIES_2[type];if(!d)return;
    const direction=i%2?-1:1;
    const x=Math.max(100,Math.min(5100,center+direction*(80+i*75)));
    const y=type==='owl'||type==='bat'?300+(i%3)*20:type==='firefly'||type==='glowmoth'?360+(i%3)*22:type==='deer'?505:515;
    state.eventCreatures.push({type,x,y,homeX:x,homeY:y,vx:direction*65,vy:0,phase:Math.random()*6.28,orbitAngle:Math.random()*6.28,alive:true,visible:true,rarity:d.rarity,mood:'calm',aiState:'event',capture2:true,variant:null,event:true});
  });
}

function updateEventCreatures(dt){
  for(const e of state.eventCreatures){
    if(!e.alive)continue;
    const speed=e.type==='deer'?70:e.type==='otter'?55:e.type==='butterfly'?42:50;
    if(state.eventRuntime.type==='migration'){
      e.x+=e.vx*dt;
      e.y=e.homeY+Math.sin(state.t*2+e.phase)*7;
    }else if(state.eventRuntime.type==='swarm'||state.eventRuntime.type==='specialNight'){
      e.x=e.homeX+Math.sin(state.t*.8+e.phase)*55;
      e.y=e.homeY+Math.cos(state.t*1.4+e.phase)*20;
    }else{
      e.x+=Math.sin(state.t*.7+e.phase)*speed*dt;
      e.y=e.homeY+Math.sin(state.t*1.6+e.phase)*5;
    }
    e.x+=state.eventRuntime.type==='migration'?0:Math.sin(state.t+e.phase)*dt*10;
    e.visible=true;
  }
}

function endEvent(){
  const r=state.eventRuntime;
  state.eventRuntime=null;
  state.eventCreatures=[];
  if(state.worldEvent?.id===r.id)state.worldEvent=null;
  state.weather={type:r.previousWeather==='storm'?'sunny':r.previousWeather,time:0};
  notify(`FIM DO EVENTO · ${EVENT_DEFINITIONS[r.id]?.name||'acontecimento'}`);
  saveGame();
}

export function eventCreatures(){return state.eventCreatures;}
export function eventActive(id){return state.eventRuntime?.id===id;}
export function eventProgress(){const r=state.eventRuntime;if(!r)return null;const d=EVENT_DEFINITIONS[r.id];return {id:r.id,name:d?.name||r.id,time:Math.max(0,r.time),duration:d?.duration||1,type:r.type};}
