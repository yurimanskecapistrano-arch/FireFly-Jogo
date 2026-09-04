/* =========================================================
   GAME STATE — FireFly 4.0
   ========================================================= */
import {rnd} from './utils.js';import {save} from '../systems/save.js';
export const state={map:save.map||'lobby',clock:save.progression?.clock??.54,t:0,player:{x:save.map==='village'?300:180,y:515,vx:0,face:1,mode:'idle',action:0},camera:{x:0,target:0,shake:0},entities:[],resources:[],particles:[],interactables:[],npcs:[],worldEvent:null,fade:{value:0,job:null},travel:0,fishing:null,weather:{type:save.world?.weather||'sunny',time:0}};
export function addParticles(x,y,color,count=12){for(let i=0;i<Math.min(count,80);i++)state.particles.push({x,y,vx:rnd(-2.4,2.4),vy:rnd(-3.4,-.2),life:rnd(.45,1),maxLife:1,color,size:rnd(2,5)});}
export function addRain(x,y){state.particles.push({x,y,vx:-.08,vy:rnd(4.8,6.4),life:rnd(.35,.7),maxLife:.7,color:'#a9c9d8',size:rnd(1,2),rain:true});}
export function tickParticles(dt){for(let i=state.particles.length-1;i>=0;i--){const p=state.particles[i];p.life-=dt;if(p.rain){p.x+=p.vx*60*dt;p.y+=p.vy*60*dt;}else{p.x+=p.vx*60*dt;p.y+=p.vy*60*dt;p.vy+=1.2*dt;}if(p.life<=0||p.y>760)state.particles.splice(i,1);}}
export function tickFade(dt){if(state.fade.job){state.fade.value+=dt*1.9;if(state.fade.value>=1){const job=state.fade.job;state.fade.job=null;job();}}else if(state.fade.value>0){state.fade.value-=dt*1.9;if(state.fade.value<0)state.fade.value=0;}}
export function isDay(){return state.clock>.22&&state.clock<.78;}export function isNight(){return !isDay();}
