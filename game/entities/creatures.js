/* =========================================================
   CRIATURAS 2.0 — identidade visual + IA viva por espécie
   ========================================================= */
import { rnd, clamp, pick, chance } from '../core/utils.js';
import { state } from '../core/state.js';
import { rarity, SPECIES } from '../data/game-data.js';
import { wx } from '../render/draw-helpers.js';
import { LAKE, FOREST_ROCKS, forestFlowerSpots } from '../world/spots.js';

export function spawn(type,x,y,options={}) {
  state.entities.push({type,x,y,homeX:x,homeY:y,vx:0,vy:0,phase:rnd(0,6),timer:rnd(.5,2),orbitAngle:rnd(0,Math.PI*2),aiState:'wander',alive:true,visible:true,rarity:rarity[type],look:Math.random(),...options});
}
export function spawnForest(){
  [['butterfly',490,365],['butterfly',1250,330],['butterfly',1760,390],['frog',690,512],['frog',835,500],['frog',1090,510],['frog',1160,520],['lizard',1160,430],['lizard',1510,455],['spider',1560,490],['firefly',930,355],['firefly',1010,370],['rare',1370,340]].forEach(c=>spawn(...c));
}
export function spawnCave(){[['bat',570,270],['bat',1050,310],['spider',690,510],['spider',1280,470],['mouse',900,515],['mouse',1450,540],['cavefly',1120,390],['rare',1380,350]].forEach(c=>spawn(...c));}

export function updateCreature(e,dt,world){
  if(!e.alive)return;
  const s=SPECIES[e.type]||SPECIES.butterfly;
  e.timer-=dt;
  if(s.nightOnly&&!world.isNight){e.aiState='hidden';e.visible=false;e.vx*=Math.max(0,1-dt*7);return;}
  e.visible=true;
  if(s.sleeper){updateBat(e,dt,world,s);return;}
  const d=Math.hypot(e.x-world.playerX,e.y-(world.playerY??e.y));
  if(!s.swarm&&d<s.fleeDistance){e.aiState='flee';const away=e.x>=world.playerX?1:-1;e.vx+=(away*s.fleeSpeed-e.vx)*dt*6;e.x=clamp(e.x+e.vx*dt,20,world.maxX-20);return;}
  switch(e.type){
    case'butterfly':updateButterfly(e,dt,world,s);break;case'frog':updateFrog(e,dt,world,s);break;
    case'lizard':updateLizard(e,dt,world,s);break;case'spider':updateSpider(e,dt,world,s);break;
    case'mouse':updateMouse(e,dt,world,s);break;default:updateSwarm(e,dt,world,s);
  }
}
function updateButterfly(e,dt,world,s){
  if(e.aiState==='landed'){e.vx*=Math.max(0,1-dt*12);if(e.timer<=0){e.aiState='seek';e.timer=rnd(1.5,3);e.targetX=pickNearbyFlower(e.x);}return;}
  if(e.aiState!=='seek'||e.targetX===undefined){e.aiState='seek';e.targetX=pickNearbyFlower(e.homeX);}
  const target=e.targetX-e.x;e.vx+=(Math.sign(target)*s.wanderSpeed*1.6-e.vx)*dt*2.5;e.x=clamp(e.x+e.vx*dt,20,world.maxX-20);
  e.y=e.homeY+Math.sin(state.t*2.5+e.phase)*18;
  if(Math.abs(target)<15){e.aiState='landed';e.timer=rnd(2.2,5);e.vx=0;e.y+=8;}
}
function pickNearbyFlower(x){const spots=forestFlowerSpots().filter(v=>Math.abs(v-x)<450);return spots.length?pick(spots):x+rnd(-140,140);}
function updateFrog(e,dt,world,s){
  const speed=s.nightBoost&&world.isNight?1.8:1;const minX=LAKE.x-LAKE.radius+22,maxX=LAKE.x+LAKE.radius-22;
  if(e.aiState==='hiding'){if(e.timer<=0)e.aiState='wander';return;}
  if(e.timer<=0&&chance(world.isNight?.045:.025)){e.aiState='jump';e.vy=-145;e.timer=.5;}
  if(e.aiState==='jump'){e.vy+=320*dt;e.y+=e.vy*dt;e.x+=e.vx*dt;if(e.timer<=0){e.aiState='wander';e.y=clamp(e.y,480,550);}return;}
  e.aiState='wander';e.vx+=(Math.sin(state.t*.8+e.phase)*s.wanderSpeed*speed-e.vx)*dt;e.x=clamp(e.x+e.vx*dt,minX,maxX);
}
function updateLizard(e,dt,world,s){
  if(e.aiState==='dart'){e.x=clamp(e.x+e.vx*dt,20,world.maxX-20);e.vx*=Math.max(0,1-dt*2);if(e.timer<=0){e.aiState='still';e.timer=rnd(2.5,5.5);e.vx=0;}return;}
  e.aiState='still';e.vx*=Math.max(0,1-dt*12);if(e.timer<=0){const rock=FOREST_ROCKS.reduce((a,r)=>Math.abs(r.x-e.homeX)<Math.abs(a.x-e.homeX)?r:a);e.targetX=clamp(rock.x+rnd(-45,45),20,world.maxX-20);e.vx=(e.targetX-e.x)*2;e.aiState='dart';e.timer=.55;}
}
function updateSpider(e,dt){e.vx*=Math.max(0,1-dt*8);if(e.timer<=0){e.aiState=e.aiState==='web-up'?'web-down':'web-up';e.timer=rnd(2,4);}}
function updateMouse(e,dt,world,s){if(e.aiState==='skitter'){e.x=clamp(e.x+e.vx*dt,20,world.maxX-20);if(e.timer<=0){e.aiState='pause';e.timer=rnd(1,2.5);e.vx=0;}return;}if(e.timer<=0){e.aiState='skitter';e.timer=rnd(.4,.9);e.vx=pick([-1,1])*s.wanderSpeed*1.5;}}
function updateSwarm(e,dt,world,s){e.aiState='swarm';e.orbitAngle+=dt*(s.wanderSpeed/55);const r=e.type==='rare'?75:36;e.x=clamp(e.homeX+Math.cos(e.orbitAngle)*r,20,world.maxX-20);e.y=e.homeY+Math.sin(e.orbitAngle*1.3)*r*.4;}
function updateBat(e,dt,world,s){
  const d=Math.abs(e.x-world.playerX);
  if(e.aiState==='sleeping'||!e.aiState){e.aiState='sleeping';e.vx=0;if(d<s.fleeDistance||(world.isNight&&chance(.002))){e.aiState='waking';e.timer=.5;}return;}
  if(e.aiState==='waking'){e.y=e.homeY+Math.sin(state.t*8)*4;if(e.timer<=0){e.aiState='flying';e.timer=rnd(2.5,4);e.orbitAngle=rnd(0,6.28);}return;}
  if(e.aiState==='flying'){e.orbitAngle+=dt*2.4;e.x=clamp(e.homeX+Math.cos(e.orbitAngle)*95,20,world.maxX-20);e.y=e.homeY+40+Math.sin(e.orbitAngle*2)*30;if(e.timer<=0){e.aiState='returning';e.timer=1.2;}return;}
  e.x+=(e.homeX-e.x)*Math.min(1,dt*2.5);e.y+=(e.homeY-e.y)*Math.min(1,dt*2.5);if(e.timer<=0||Math.abs(e.x-e.homeX)<4){e.aiState='sleeping';e.x=e.homeX;e.y=e.homeY;}
}

function eye(ctx,x,y,r=2){ctx.fillStyle='#182c32';ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();}
function body(ctx,color,x,y,rx,ry){ctx.fillStyle=color;ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fill();}
function limb(ctx,x1,y1,x2,y2,w=2){ctx.strokeStyle='#34454b';ctx.lineWidth=w;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();}

export function drawCreature(e,ctx,t){
  if(!e.visible)return;const x=wx(e.x),base=e.type==='spider'?e.y:e.y+Math.sin(t*2+e.phase)*(e.type==='bat'||e.type.includes('fly')?9:2);ctx.save();ctx.translate(x,base);if(e.vx<0)ctx.scale(-1,1);
  if(e.type==='butterfly'){
    const flap=e.aiState==='landed'?.05:Math.sin(t*14+e.phase)*.45;ctx.strokeStyle='#34434b';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,-7);ctx.lineTo(0,7);ctx.stroke();
    body(ctx,'#e8a2a6',-9,-1,10,7);body(ctx,'#f2c978',9,-1,10,7);body(ctx,'#8a5662',0,1,3,9);ctx.save();ctx.rotate(flap);ctx.fillStyle='#fff0bd';ctx.beginPath();ctx.ellipse(-8,-5,6,10,-.5,0,6.28);ctx.fill();ctx.restore();ctx.fillStyle='#fff0bd';ctx.beginPath();ctx.ellipse(8,-5,6,10,.5,0,6.28);ctx.fill();
  } else if(e.type==='frog'){
    const squish=e.aiState==='jump'?1.15:1+Math.sin(t*5)*.04;ctx.scale(1,squish);body(ctx,'#6fae63',0,1,19,12);body(ctx,'#87bd72',-9,-7,7,7);body(ctx,'#87bd72',9,-7,7,7);eye(ctx,-9,-9,2);eye(ctx,9,-9,2);ctx.strokeStyle='#355346';ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,2,8,.15,2.9);ctx.stroke();limb(ctx,-13,8,-20,15);limb(ctx,13,8,20,15);
  } else if(e.type==='lizard'){
    body(ctx,'#6f9e72',0,0,21,7);ctx.fillStyle='#4f795c';ctx.beginPath();ctx.moveTo(-15,1);ctx.quadraticCurveTo(-29,5,-40,12);ctx.quadraticCurveTo(-27,1,-17,-4);ctx.fill();body(ctx,'#86b07c',15,-3,8,6);eye(ctx,18,-5,1.8);for(let i=-1;i<=1;i+=2){limb(ctx,i*8,4,i*15,10,2);}
  } else if(e.type==='spider'){
    const drop=e.aiState==='web-up'?-20:5;ctx.strokeStyle='#d2d8c8aa';ctx.lineWidth=1.3;ctx.beginPath();ctx.moveTo(0,-55);ctx.lineTo(0,drop);ctx.stroke();for(let i=-1;i<=1;i+=2){for(let j=0;j<3;j++)limb(ctx,0,0,i*(12+j*5),-8+j*7,2);}body(ctx,'#4c4a5f',0,0,10,8);body(ctx,'#393848',0,7,7,6);eye(ctx,-3,-1,1.4);eye(ctx,3,-1,1.4);
  } else if(e.type==='mouse'){
    body(ctx,'#9a8077',0,1,15,9);ctx.fillStyle='#b9908c';ctx.beginPath();ctx.arc(-9,-8,6,0,6.28);ctx.arc(7,-8,6,0,6.28);ctx.fill();eye(ctx,10,-2,1.6);limb(ctx,-14,5,-24,7,1.5);
  } else if(e.type==='bat'){
    const flap=e.aiState==='flying'?Math.sin(t*18)*9:0;ctx.fillStyle='#4e4a69';ctx.beginPath();ctx.moveTo(0,3);ctx.quadraticCurveTo(-13,-16-flap,-31,1);ctx.quadraticCurveTo(-25,13,-11,8);ctx.quadraticCurveTo(0,13,11,8);ctx.quadraticCurveTo(25,13,31,1);ctx.quadraticCurveTo(13,-16-flap,0,3);ctx.fill();body(ctx,'#5c526f',0,2,7,10);eye(ctx,-2,-1,1.2);eye(ctx,2,-1,1.2);
  } else {
    const rare=e.type==='rare'||e.type==='cavefly';const glow=rare?30:18;ctx.shadowColor=rare?'#c99bff':'#ffe47a';ctx.shadowBlur=glow;body(ctx,rare?'#d9adff':'#f4dd70',0,0,6,4);ctx.shadowBlur=0;ctx.fillStyle='#eef7d8';ctx.globalAlpha=.7;ctx.beginPath();ctx.ellipse(-7,-3,8,3,-.5,0,6.28);ctx.ellipse(7,-3,8,3,.5,0,6.28);ctx.fill();ctx.globalAlpha=1;
  }
  ctx.restore();
}
