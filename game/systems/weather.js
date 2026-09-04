/* FireFly 4.0 — clima leve e conectado */
import {state,addParticles} from '../core/state.js';
import {save,saveGame} from './save.js';
import {AudioManager} from './audio.js';
import {rnd} from '../core/utils.js';
const TYPES=['sunny','cloudy','rain','fog'];
const LABELS={sunny:'ENSOLARADO',cloudy:'NUBLADO',rain:'CHUVA',fog:'NEBLINA'};
let timer=0,changeTimer=0;
export function weatherLabel(){return LABELS[state.weather?.type]||LABELS.sunny;}
export function weatherType(){return state.weather?.type||'sunny';}
export function weatherVisibility(){return weatherType()==='fog'?0.72:1;}
export function updateWeather(dt){
 if(state.map==='lobby'||state.map==='village'){if(state.weather?.type!=='sunny'){state.weather.type='sunny';}return;}
 timer+=dt;changeTimer+=dt;
 if(changeTimer>55){changeTimer=0;if(Math.random()<.55)rollWeather();}
 if(weatherType()==='rain'&&Math.random()<dt*.7)addParticles(state.player.x+rnd(-500,500),rnd(390,520),'#a9c9d8',1);
}
export function rollWeather(force=null){
 const next=force||TYPES[Math.floor(Math.random()*TYPES.length)];state.weather={type:next,time:0};save.world.weather=next;saveGame();AudioManager.playAmbient(state.map);return next;
}
export function weatherModifier(kind){const w=weatherType();if(kind==='fish')return w==='rain'?1.35:w==='cloudy'?1.12:.92;if(kind==='night')return w==='fog'?1.25:1;if(kind==='creature')return w==='rain'?.82:w==='fog'?.9:1;return 1;}
