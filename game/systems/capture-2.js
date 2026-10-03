/* FireFly 4.1 — Captura 2.0 */
import {clamp,chance} from '../core/utils.js';
import {state,addParticles} from '../core/state.js';
import {save,saveGame} from './save.js';
import {SPECIES_2,NETS,VARIANTS} from '../data/capture-2-data.js';
import {notify} from '../render/notify.js';
import {AudioManager} from './audio.js';
import {addOrderProgress} from './orders.js';

function net(){
  if(save.inventory.masterNet>0)return NETS.prism;
  if(save.inventory.reinforcedNet>0)return NETS.reinforced;
  const night=state.clock<.22||state.clock>.78;
  if(save.inventory.luckyCharm>0&&night)return NETS.lunar;
  return NETS.basic;
}
function distance(e,p){return Math.hypot(e.x-p.x,e.y-p.y);}
function variantFor(type){
  const data=SPECIES_2[type];if(!data?.variants?.length)return null;
  const rollChance=.18+(save.inventory.luckyCharm?.08:0);
  if(Math.random()>rollChance)return null;
  return data.variants[Math.floor(Math.random()*data.variants.length)];
}
function captureDifficulty(e){const d=SPECIES_2[e.type]||SPECIES_2.butterfly;let value=d.baseDifficulty;if(e.variant)value+=.18;if(e.aiState==='flee'||e.aiState==='dart'||e.aiState==='skitter')value+=.45;if(e.aiState==='landed'||e.aiState==='rest'||e.aiState==='sun')value-=.18;if(e.mood==='alert')value+=.2;return value;}
function conditionsBonus(e){const d=SPECIES_2[e.type];let bonus=0;if(state.weather?.type&&d?.weather?.includes(state.weather.type))bonus+=.12;if(state.clock<.22||state.clock>.78)bonus+=d?.time==='night'?.2:0;if(save.inventory.explorationKit)bonus+=.06;if(save.inventory.luckyCharm&&d?.rarity==='raro')bonus+=.12;return bonus;}
export function capture(){
  if(state.capture)return captureKey();
  if(state.map==='village'||state.map==='lobby'||state.fishing)return;
  const p=state.player;const candidates=state.entities.filter(e=>e.alive&&e.visible!==false&&SPECIES_2[e.type]).sort((a,b)=>distance(a,p)-distance(b,p));const e=candidates[0];const n=net();
  state.capture={stage:'timing',timer:n.window,window:n.window,entity:e?.type||null,power:0,net:n.key,target:null};p.action=.7;AudioManager.playSFX('net-swing');
  if(!e||distance(e,p)>n.range){state.capture.result='miss';state.capture.timer=.22;state.capture.stage='miss';notify('A rede passou longe. Espere o momento certo.');addParticles(p.x+35*p.face,p.y,'#a5cf7d',6);return;}
  state.capture.target=e;notify(`SEGURE O MOMENTO · ${n.name} · aperte ESPAÇO para lançar.`);
}
export function captureKey(){
  const c=state.capture;if(!c||c.stage==='miss')return false;
  const e=c.target;if(!e||!e.alive){state.capture=null;return false;}
  const ratio=clamp(c.timer/c.window,0,1);const timing=1-Math.abs(ratio-.5)*2;c.skill=timing;c.stage='resolve';resolveCapture();return true;
}
function resolveCapture(){
  const c=state.capture;if(!c)return;
  if(c.stage==='miss'){state.capture=null;return;}
  const e=c.target;if(!e||!e.alive){state.capture=null;return;}
  const d=SPECIES_2[e.type]||SPECIES_2.butterfly;const n=NETS[c.net==='masterNet'?'prism':c.net==='reinforcedNet'?'reinforced':c.net==='luckyCharm'?'lunar':'basic'];
  const skillBonus=(c.skill||0)*.28;let score=(n.power+conditionsBonus(e)+skillBonus)/captureDifficulty(e);
  if(e.rarity==='raro')score-=.16;if(e.variant)score-=.12;
  const roll=chance(clamp(.38+score*.38,.12,.96));
  if(roll){finishCapture(e,n);}else{e.aiState='flee';e.mood='alert';e.vx=(e.x>=state.player.x?1:-1)*(d.fleeSpeed||150);notify(`${d.name} escapou da rede!`);addParticles(e.x,e.y,'#a5cf7d',10);AudioManager.playSFX('error');}
  state.capture=null;
}
export function tickCapture(dt){
  const c=state.capture;if(!c)return;
  if(c.stage==='miss'){c.timer-=dt;if(c.timer<=0)state.capture=null;return;}
  if(c.stage!=='timing')return;
  c.timer-=dt;if(c.timer<=0){c.timer=0;c.skill=0;resolveCapture();}
}
function finishCapture(e,n){
  const d=SPECIES_2[e.type]||SPECIES_2.butterfly;if(!e.variant)e.variant=variantFor(e.type);const key=e.variant?`${e.type}:${e.variant}`:e.type;
  save.catches[key]=(save.catches[key]||0)+1;save.discovered[e.type]=true;if(e.variant)save.discovered[key]=true;
  const v=e.variant?VARIANTS[e.variant]:null;const mastery=save.progression?.upgrades?.mastery?1.2:1;const value=Math.round(d.value*(v?.multiplier||1)*mastery);save.coins+=Math.max(3,Math.round(value/4));
  if(!save.captureBook)save.captureBook={};save.captureBook[key]={type:e.type,variant:e.variant||null,firstCaught:Date.now(),map:state.map};
  save.progression.stats.captures=(save.progression.stats.captures||0)+1;if(e.variant)save.progression.stats.variants=(save.progression.stats.variants||0)+1;
  addOrderProgress('catch',e.type,1);
  e.alive=false;state.camera.shake=9;addParticles(e.x,e.y,e.rarity==='raro'?'#d8a5ff':'#ffe47a',22);const discovery=e.variant?` VARIANTE ${v?.name?.toUpperCase()||''}!`:'';notify(`CAPTURADO · ${d.name}${discovery}`);AudioManager.playSFX('capture');saveGame();
}
export function captureHud(){const c=state.capture;if(!c)return null;return {label:c.stage==='timing'?'MIRE O TEMPO':'CAPTURANDO',target:c.entity,net:c.net,timer:c.timer,window:c.window,skill:c.skill??null};}
