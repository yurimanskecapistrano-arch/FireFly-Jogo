/* =========================================================
   PLAYER — movimento, presença e progressão física
   ========================================================= */
import {ctx} from '../core/dom.js';
import {state} from '../core/state.js';
import {save} from '../systems/save.js';
import {notify} from '../render/notify.js';
import {clamp} from '../core/utils.js';
import {moveVector,isRunning} from '../core/input.js';
import {MAP_LIMITS} from '../core/constants.js';
import {wx,poly} from '../render/draw-helpers.js';

export function mapMaxX(mapId=state.map){return MAP_LIMITS[mapId]??MAP_LIMITS.village;}

function progressionGate(){
  if(state.map==='forest'){
    if(state.player.x>3390&&!save.inventory.explorationKit)return {x:3390,message:'Uma encosta de pedra bloqueia a trilha. O Kit de Exploração pode ajudar a atravessar.'};
    if(state.player.x>4190&&!save.inventory.lantern)return {x:4190,message:'A vegetação fecha o caminho. Você percebe marcas que brilham ao anoitecer.'};
  }
  if(state.map==='cave'&&state.player.x>2440&&!save.inventory.lantern)return {x:2440,message:'A escuridão engole o túnel. Uma Lanterna de Cristal permitiria avançar.'};
  return null;
}

export function updatePlayer(dt){
  const p=state.player;
  const dir=moveVector();
  const running=isRunning();
  const mobility=save.progression?.upgrades?.boots?1.12:1;
  const speed=(running?255:175)*mobility;
  const targetVX=dir.x*speed;
  const targetVY=dir.y*speed;
  const response=Math.min(1,dt*10);
  p.vx+=(targetVX-p.vx)*response;
  p.vy+=(targetVY-p.vy)*response;
  if(!dir.x)p.vx*=Math.max(0,1-dt*10);
  if(!dir.y)p.vy*=Math.max(0,1-dt*10);

  const maxX=mapMaxX();
  const gate=progressionGate();
  const desiredX=clamp(p.x+p.vx*dt,50,maxX);
  const desiredY=clamp(p.y+p.vy*dt,455,615);
  if(gate&&desiredX>gate.x){
    p.x=gate.x;p.vx=0;
    if(!state.gateNotice||state.gateNotice!==gate.message){state.gateNotice=gate.message;notify(gate.message);}
  }else{
    p.x=desiredX;
    if(state.gateNotice)state.gateNotice=null;
  }
  p.y=desiredY;
  if(Math.abs(dir.x)>.1)p.face=dir.x>0?1:-1;
  const moving=Math.hypot(p.vx,p.vy)>25;
  p.mode=moving?'walk':'idle';
  p.action=Math.max(0,p.action-dt*2.5);
  p.bob=(p.bob||0)+(moving?dt*12:dt*2.2);
  return maxX;
}

export function drawPlayer(){
  const p=state.player;
  const x=wx(p.x);
  const depth=clamp((p.y-455)/160,0,1);
  const scale=.88+depth*.18;
  const bob=p.mode==='walk'?Math.sin(p.bob)*2.5:Math.sin(p.bob)*.6;
  const action=p.action;
  ctx.save();
  ctx.translate(x,p.y+bob);
  ctx.scale(p.face*scale,scale);
  ctx.globalAlpha=.24;
  ctx.fillStyle='#071a1b';
  ctx.beginPath();ctx.ellipse(0,50,23,7,0,0,Math.PI*2);ctx.fill();
  ctx.globalAlpha=1;
  if(action)ctx.rotate(-.45*Math.sin(action*7));
  ctx.fillStyle='#324a55';ctx.fillRect(-15,38+Math.abs(bob),10,11);ctx.fillRect(6,38-Math.abs(bob),10,11);
  poly([[-17,10],[-22,34],[-13,45],[18,43],[25,24],[15,9]],'#d36b55','#293d49');
  ctx.fillStyle='#7a4f45';ctx.beginPath();ctx.arc(-20,26,11,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#ffd29d';ctx.beginPath();ctx.arc(2,1,18,0,Math.PI*2);ctx.fill();
  poly([[-20,-1],[-11,-21],[12,-28],[25,-9],[15,-7],[-8,-8]],'#593d57','#293d49');
  ctx.fillStyle='#263d48';ctx.fillRect(11,2,3,3);
  ctx.strokeStyle='#f3dec4';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(18,20);ctx.lineTo(44,2);ctx.stroke();ctx.beginPath();ctx.arc(49,-3,14,.4,4.4);ctx.stroke();
  ctx.restore();
}
