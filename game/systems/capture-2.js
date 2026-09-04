/* FireFly 4.1 — Captura 2.0 */
import {clamp,chance} from '../core/utils.js';
import {state,addParticles} from '../core/state.js';
import {save,saveGame} from './save.js';
import {SPECIES_2,NETS,VARIANTS} from '../data/capture-2-data.js';
import {notify} from '../render/notify.js';
import {AudioManager} from './audio.js';

function net(){if(save.inventory.masterNet>0)return NETS.prism;if(save.inventory.reinforcedNet>0)return NETS.reinforced;return NETS.basic;}
function distance(e,p){return Math.hypot(e.x-p.x,e.y-p.y);}
function variantFor(type){const data=SPECIES_2[type];if(!data?.variants?.length)return null;const roll=Math.random();if(roll>.18)return null;return data.variants[Math.floor(Math.random()*data.variants.length)];}
function captureDifficulty(e){const d=SPECIES_2[e.type]||SPECIES_2.butterfly;let value=d.baseDifficulty;if(e.variant)value+=.18;if(e.aiState==='flee'||e.aiState==='dart'||e.aiState==='skitter')value+=.45;if(e.aiState==='landed'||e.aiState==='rest'||e.aiState==='sun')value-=.18;if(e.mood==='alert')value+=.2;return value;}
function conditionsBonus(e){const d=SPECIES_2[e.type];let bonus=0;if(state.weather?.type&&d?.weather?.includes(state.weather.type))bonus+=.12;if(state.clock<.22||state.clock>.78)bonus+=d?.time==='night'?.2:0;if(save.inventory.explorationKit)bonus+=.06;return bonus;}
export function capture(){
 if(state.map==='village'||state.map==='lobby'||state.fishing||state.capture)return;
 const p=state.player;const candidates=state.entities.filter(e=>e.alive&&e.visible!==false&&SPECIES_2[e.type]).sort((a,b)=>distance(a,p)-distance(b,p));const e=candidates[0];const n=net();
 state.capture={stage:'swing',timer:.18,entity:e?.type||null,power:0,net:n.key};p.action=.7;AudioManager.playSFX('net-swing');
 if(!e||distance(e,p)>n.range){state.capture.result='miss';state.capture.timer=.22;notify('A rede passou longe. Espere o momento certo.');addParticles(p.x+35*p.face,p.y,'#a5cf7d',6);return;}
 state.capture.target=e;state.capture.stage='check';state.capture.timer=.16;
}
export function tickCapture(dt){const c=state.capture;if(!c)return;c.timer-=dt;if(c.stage==='swing'&&c.timer<=0){if(c.result==='miss'){state.capture=null;return;}c.stage='resolve';c.timer=.12;return;}if(c.stage==='check'&&c.timer<=0){c.stage='resolve';return;}if(c.stage!=='resolve')return;const e=c.target;if(!e||!e.alive){state.capture=null;return;}const d=SPECIES_2[e.type]||SPECIES_2.butterfly;const n=NETS[c.net==='masterNet'?'prism':c.net==='reinforcedNet'?'reinforced':'basic'];let score=(n.power+conditionsBonus(e))/captureDifficulty(e);if(e.rarity==='raro')score-=.16;if(e.variant)score-=.12;const roll=chance(clamp(.48+score*.34,.16,.94));if(roll){finishCapture(e,n);}else{e.aiState='flee';e.mood='alert';e.vx=(e.x>=state.player.x?1:-1)*(d.fleeSpeed||150);notify(`${d.name} escapou da rede!`);addParticles(e.x,e.y,'#a5cf7d',10);AudioManager.playSFX('error');}state.capture=null;}
function finishCapture(e,n){const d=SPECIES_2[e.type]||SPECIES_2.butterfly;if(!e.variant)e.variant=variantFor(e.type);const key=e.variant?`${e.type}:${e.variant}`:e.type;save.catches[key]=(save.catches[key]||0)+1;save.discovered[e.type]=true;if(e.variant)save.discovered[key]=true;const v=e.variant?VARIANTS[e.variant]:null;const value=Math.round(d.value*(v?.multiplier||1));save.coins+=Math.max(3,Math.round(value/4));if(!save.captureBook)save.captureBook={};save.captureBook[key]={type:e.type,variant:e.variant||null,firstCaught:Date.now(),map:state.map};e.alive=false;state.camera.shake=9;addParticles(e.x,e.y,e.rarity==='raro'?'#d8a5ff':'#ffe47a',22);const discovery=e.variant?` VARIANTE ${v?.name?.toUpperCase()||''}!`:'';notify(`CAPTURADO · ${d.name}${discovery}`);AudioManager.playSFX('capture');saveGame();}
export function captureHud(){const c=state.capture;if(!c)return null;return {label:c.result==='miss'?'ERRO':'CAPTURANDO',target:c.entity,net:c.net};}