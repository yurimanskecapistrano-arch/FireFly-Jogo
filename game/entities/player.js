/* =========================================================
   PLAYER — presença, movimento e personagem
   ========================================================= */
import {ctx} from '../core/dom.js';import {state} from '../core/state.js';import {save} from '../systems/save.js';import {notify} from '../render/notify.js';import {clamp} from '../core/utils.js';import {moveVector,isRunning} from '../core/input.js';import {MAP_LIMITS} from '../core/constants.js';import {wx,poly} from '../render/draw-helpers.js';
export function mapMaxX(mapId=state.map){return MAP_LIMITS[mapId]??MAP_LIMITS.village;}
function progressionGate(){if(state.map==='forest'){if(state.player.x>3390&&!save.inventory.explorationKit)return{x:3390,message:'Uma encosta de pedra bloqueia a trilha. O Kit de Exploração pode ajudar a atravessar.'};if(state.player.x>4190&&!save.inventory.lantern)return{x:4190,message:'A vegetação fecha o caminho. Você percebe marcas que brilham ao anoitecer.'};}if(state.map==='cave'&&state.player.x>2440&&!save.inventory.lantern)return{x:2440,message:'A escuridão engole o túnel. Uma Lanterna de Cristal permitiria avançar.'};return null;}
export function updatePlayer(dt){const p=state.player,dir=moveVector(),running=isRunning(),mobility=save.progression?.upgrades?.boots?1.12:1,speed=(running?255:175)*mobility,response=Math.min(1,dt*10);const targetVX=dir.x*speed,targetVY=dir.y*speed;p.vx+=(targetVX-p.vx)*response;p.vy+=(targetVY-p.vy)*response;if(!dir.x)p.vx*=Math.max(0,1-dt*10);if(!dir.y)p.vy*=Math.max(0,1-dt*10);const maxX=mapMaxX(),gate=progressionGate(),desiredX=clamp(p.x+p.vx*dt,50,maxX),desiredY=clamp(p.y+p.vy*dt,430,635);if(gate&&desiredX>gate.x){p.x=gate.x;p.vx=0;if(!state.gateNotice||state.gateNotice!==gate.message){state.gateNotice=gate.message;notify(gate.message);}}else{p.x=desiredX;if(state.gateNotice)state.gateNotice=null;}p.y=desiredY;if(Math.abs(dir.x)>.1)p.face=dir.x>0?1:-1;const moving=Math.hypot(p.vx,p.vy)>25;p.mode=moving?'walk':'idle';p.action=Math.max(0,p.action-dt*2.5);p.bob=(p.bob||0)+(moving?dt*(running?16:12):dt*2.2);p.runBlend+=(running?1:-1)*dt*7||0;p.runBlend=clamp(p.runBlend||0,0,1);return maxX;}
function limb(x1,y1,x2,y2,width,color){ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();}
export function drawPlayer(){const p=state.player,x=wx(p.x),depth=clamp((p.y-430)/205,0,1),scale=.84+depth*.22,moving=p.mode==='walk',stride=moving?Math.sin(p.bob)*4:0,bob=moving?Math.sin(p.bob)*1.8:Math.sin(p.bob)*.45,run=p.runBlend||0,action=p.action;ctx.save();ctx.translate(x,p.y+bob);ctx.scale(p.face*scale,scale);
ctx.globalAlpha=.28;ctx.fillStyle='#071419';ctx.beginPath();ctx.ellipse(0,49,24,7,0,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
if(action)ctx.rotate(-.12*Math.sin(action*7));
/* pernas / botas */
limb(-7,31,-8+stride,48,7,'#28343a');limb(8,31,8-stride,48,7,'#28343a');ctx.fillStyle='#111d24';ctx.fillRect(-13+stride,44,10,6);ctx.fillRect(5-stride,44,10,6);
/* mochila */
ctx.fillStyle='#263f48';ctx.beginPath();ctx.roundRect(-25,8,11,28,4);ctx.fill();ctx.fillStyle='#d4a55e';ctx.fillRect(-24,19,9,3);
/* jaqueta */
poly([[-17,5],[-23,31],[-14,41],[15,41],[23,29],[17,5]],'#385763','#1d3139');ctx.fillStyle='#6c8d91';ctx.fillRect(-2,8,4,29);ctx.fillStyle='#d6bd78';ctx.fillRect(-1,20,2,2);ctx.fillRect(-1,27,2,2);
/* braço + rede */
limb(16,13,27,25+stride*.5,5,'#304b55');limb(-16,13,-23,25-stride*.4,5,'#304b55');limb(26,24,43,7,3,'#d9c9a8');ctx.strokeStyle='#e7d8b8';ctx.lineWidth=2;ctx.beginPath();ctx.arc(48,2,14,.35,4.9);ctx.stroke();ctx.beginPath();ctx.moveTo(37,8);ctx.lineTo(48,16);ctx.stroke();
/* pescoço + rosto */
ctx.fillStyle='#c98768';ctx.fillRect(-6,-1,12,10);ctx.fillStyle='#f0b98e';ctx.beginPath();ctx.arc(1,-12,17,0,Math.PI*2);ctx.fill();
/* cabelo em mechas, sem sprite genérico */
ctx.fillStyle='#292b35';ctx.beginPath();ctx.moveTo(-19,-10);ctx.quadraticCurveTo(-17,-31,3,-34);ctx.quadraticCurveTo(22,-31,24,-10);ctx.lineTo(13,-15);ctx.lineTo(8,-26);ctx.lineTo(2,-16);ctx.lineTo(-5,-27);ctx.lineTo(-10,-14);ctx.closePath();ctx.fill();ctx.fillStyle='#494251';ctx.beginPath();ctx.moveTo(-17,-18);ctx.quadraticCurveTo(-9,-30,4,-30);ctx.strokeStyle='#6c6370';ctx.lineWidth=2;ctx.stroke();ctx.fillStyle='#27323b';ctx.fillRect(8,-13,3,3);
/* detalhes do rosto / gola */
ctx.strokeStyle='#7d4e48';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(7,-5);ctx.lineTo(12,-4);ctx.stroke();ctx.fillStyle='#d7b77e';ctx.fillRect(-14,7,8,3);ctx.restore();}
