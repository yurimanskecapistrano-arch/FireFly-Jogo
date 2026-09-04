/* =========================================================
   CRIATURAS — spawn, IA por espécie e desenho
   ========================================================= */
import { rnd, clamp, pick, chance } from '../core/utils.js';
import { state } from '../core/state.js';
import { rarity, SPECIES } from '../data/game-data.js';
import { wx } from '../render/draw-helpers.js';
import { LAKE, FOREST_ROCKS, forestFlowerSpots, CAVE_WEB_SPOTS, CAVE_CEILING_SPOTS } from '../world/spots.js';

export function spawn(type, x, y, options = {}) {
  state.entities.push({ type, x, y, homeX:x, homeY:y, vx:0, phase:rnd(0,6), mode:'wander', aiState:'wander', timer:rnd(0.5,2), orbitAngle:rnd(0,Math.PI*2), alive:true, visible:true, rarity:rarity[type], ...options });
}
export function spawnForest(){[['butterfly',490,365],['butterfly',1250,330],['frog',690,512],['frog',835,500],['frog',1090,510],['lizard',1160,430],['spider',1560,490],['firefly',930,355],['rare',1370,340]].forEach(c=>spawn(...c));}
export function spawnCave(){[['bat',570,270],['bat',1050,310],['spider',690,510],['mouse',900,515],['cavefly',1120,390],['rare',1380,350]].forEach(c=>spawn(...c));}

export function updateCreature(entity, dt, world){
  if(!entity.alive)return;
  const species=SPECIES[entity.type]||SPECIES.butterfly;
  entity.timer-=dt;
  if(species.nightOnly&&!world.isNight){entity.aiState='hidden';entity.visible=false;entity.vx*=Math.max(0,1-dt*6);return;}
  entity.visible=true;
  if(species.sleeper){updateBat(entity,dt,world,species);return;}
  const distanceToPlayer=Math.abs(entity.x-world.playerX);
  if(!species.swarm&&distanceToPlayer<species.fleeDistance){entity.aiState='flee';const away=entity.x>=world.playerX?1:-1;entity.vx+=(away*species.fleeSpeed-entity.vx)*dt*5;entity.x=clamp(entity.x+entity.vx*dt,20,world.maxX-20);return;}
  switch(entity.type){case'butterfly':updateButterfly(entity,dt,world,species);break;case'frog':updateFrog(entity,dt,world,species);break;case'lizard':updateLizard(entity,dt,world,species);break;case'spider':updateSpider(entity,dt,world,species);break;case'mouse':updateMouse(entity,dt,world,species);break;case'firefly':case'rare':case'cavefly':updateSwarm(entity,dt,world,species);break;default:updateDefaultWander(entity,dt,world,species);}}
function updateButterfly(entity,dt,world,species){if(entity.aiState==='landed'){entity.vx*=Math.max(0,1-dt*10);if(entity.timer<=0){entity.aiState='seek';entity.timer=rnd(1.5,3);entity.targetX=pickNearbyFlower(entity.x);}return;}if(entity.aiState!=='seek'||entity.targetX===undefined){entity.aiState='seek';entity.targetX=pickNearbyFlower(entity.homeX);}const toTarget=entity.targetX-entity.x;entity.vx+=(Math.sign(toTarget)*species.wanderSpeed*1.6-entity.vx)*dt*2;entity.x=clamp(entity.x+entity.vx*dt,20,world.maxX-20);if(Math.abs(toTarget)<14){entity.aiState='landed';entity.timer=rnd(2.2,5);entity.vx=0;}}
function pickNearbyFlower(fromX){const spots=forestFlowerSpots().filter(x=>Math.abs(x-fromX)<420);return spots.length?pick(spots):fromX+rnd(-120,120);}
function updateFrog(entity,dt,world,species){const speedBoost=species.nightBoost&&world.isNight?1.8:1;entity.vx+=(Math.sin(state.t*0.7+entity.phase)*species.wanderSpeed*speedBoost-entity.vx)*dt;const minX=LAKE.x-LAKE.radius+20,maxX=LAKE.x+LAKE.radius-20;entity.x=clamp(entity.x+entity.vx*dt,minX,maxX);}
function updateLizard(entity,dt,world,species){if(entity.aiState==='dart'){const toTarget=(entity.targetX??entity.homeX)-entity.x;entity.vx+=(Math.sign(toTarget)*species.fleeSpeed*0.7-entity.vx)*dt*6;entity.x=clamp(entity.x+entity.vx*dt,20,world.maxX-20);if(Math.abs(toTarget)<8||entity.timer<=0){entity.aiState='still';entity.timer=rnd(2.5,5.5);entity.vx=0;}return;}entity.aiState='still';entity.vx*=Math.max(0,1-dt*12);if(entity.timer<=0){const nearestRock=FOREST_ROCKS.reduce((closest,rock)=>Math.abs(rock.x-entity.homeX)<Math.abs(closest.x-entity.homeX)?rock:closest);entity.aiState='dart';entity.timer=0.6;entity.targetX=clamp(nearestRock.x+rnd(-45,45),20,world.maxX-20);}}
function updateSpider(entity,dt,world,species){entity.vx*=Math.max(0,1-dt*8);if(entity.timer<=0){entity.aiState=entity.aiState==='web-up'?'web-down':'web-up';entity.timer=rnd(2,4);}const webOffset=entity.aiState==='web-up'?-10:10;entity.y=entity.homeY+webOffset*Math.min(1,(rnd(2,4)-entity.timer)/2||0);}
function updateMouse(entity,dt,world,species){if(entity.aiState==='skitter'){entity.x=clamp(entity.x+entity.vx*dt,20,world.maxX-20);if(entity.timer<=0){entity.aiState='pause';entity.timer=rnd(1,2.5);entity.vx=0;}return;}if(entity.timer<=0){entity.aiState='skitter';entity.timer=rnd(0.4,0.9);entity.vx=pick([-1,1])*species.wanderSpeed*1.5;}}
function updateSwarm(entity,dt,world,species){entity.aiState='swarm';entity.orbitAngle+=dt*(species.wanderSpeed/55);const orbitRadius=entity.type==='rare'?70:34;entity.x=clamp(entity.homeX+Math.cos(entity.orbitAngle)*orbitRadius,20,world.maxX-20);entity.y=entity.homeY+Math.sin(entity.orbitAngle*1.3)*(orbitRadius*0.4);}
function updateDefaultWander(entity,dt,world,species){entity.vx+=(Math.sin(state.t+entity.phase)*species.wanderSpeed-entity.vx)*dt;entity.x=clamp(entity.x+entity.vx*dt,20,world.maxX-20);}
function updateBat(entity,dt,world,species){const distanceToPlayer=Math.abs(entity.x-world.playerX);if(entity.aiState==='sleeping'||!entity.aiState){entity.aiState='sleeping';entity.vx=0;if(distanceToPlayer<species.fleeDistance||(world.isNight&&chance(0.002))){entity.aiState='waking';entity.timer=0.4;}return;}if(entity.aiState==='waking'){if(entity.timer<=0){entity.aiState='flying';entity.timer=rnd(2.5,4);entity.orbitAngle=rnd(0,Math.PI*2);}return;}if(entity.aiState==='flying'){entity.orbitAngle+=dt*2.4;entity.x=clamp(entity.homeX+Math.cos(entity.orbitAngle)*90,20,world.maxX-20);entity.y=entity.homeY+40+Math.sin(entity.orbitAngle*2)*25;if(entity.timer<=0){entity.aiState='returning';entity.timer=1.2;}return;}if(entity.aiState==='returning'){entity.x+=(entity.homeX-entity.x)*Math.min(1,dt*2.5);entity.y+=(entity.homeY-entity.y)*Math.min(1,dt*2.5);if(entity.timer<=0||Math.abs(entity.x-entity.homeX)<4){entity.aiState='sleeping';entity.x=entity.homeX;entity.y=entity.homeY;}}}

export function drawCreature(e,ctx,t){if(e.visible===false)return;const x=wx(e.x);const flying=e.type.includes('fly')||e.type==='bat';const restY=e.type==='spider'?e.y:e.y+Math.sin(t*2+e.phase)*(flying?16:3);ctx.save();ctx.translate(x,restY);if(e.vx<0)ctx.scale(-1,1);
  if(e.type==='butterfly'){const wing=Math.sin(t*13+e.phase)*(e.aiState==='landed'?0.15:0.45);ctx.fillStyle='#f18b90';ctx.beginPath();ctx.ellipse(-9,0,11,6,wing,0,Math.PI*2);ctx.fill();ctx.fillStyle='#f6d078';ctx.beginPath();ctx.ellipse(9,0,11,6,-wing,0,Math.PI*2);ctx.fill();ctx.fillStyle='#374658';ctx.fillRect(-2,-6,4,13);
  }else if(e.type==='frog'){const scale=1+Math.sin(t*5)*0.08;ctx.scale(1,scale);ctx.fillStyle='#70ad5f';ctx.beginPath();ctx.ellipse(0,0,18,12,0,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(-10,-8,6,0,Math.PI*2);ctx.arc(9,-8,6,0,Math.PI*2);ctx.fill();ctx.fillStyle='#273c42';ctx.fillRect(-11,-10,3,3);ctx.fillRect(8,-10,3,3);
  }else if(e.type==='lizard'||e.type==='mouse'){const alertness=e.aiState==='dart'||e.aiState==='skitter'?1:0.75;ctx.globalAlpha=e.type==='lizard'?alertness:1;ctx.fillStyle=e.type==='mouse'?'#9b8275':'#6fae89';ctx.beginPath();ctx.ellipse(0,0,22,7,0,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.moveTo(-15,1);ctx.lineTo(-39,10);ctx.lineTo(-23,4);ctx.fill();ctx.fillStyle='#233f41';ctx.fillRect(14,-3,3,3);ctx.globalAlpha=1;
  }else if(e.type==='spider'){ctx.strokeStyle='#4a5568aa';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(0,-40);ctx.lineTo(0,0);ctx.stroke();ctx.strokeStyle='#273442';ctx.lineWidth=3;for(let side=-1;side<=1;side+=2){for(let leg=0;leg<3;leg++){ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(side*(11+leg*3),-5+leg*7);ctx.stroke();}}ctx.fillStyle='#474356';ctx.beginPath();ctx.arc(0,0,9,0,Math.PI*2);ctx.fill();
  }else if(e.type==='bat'){const flap=e.aiState==='flying'?Math.sin(t*16)*6:0;ctx.fillStyle='#4b4969';ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(-17,-15-flap,-28,5);ctx.quadraticCurveTo(-12,1,0,8);ctx.quadraticCurveTo(15,-14-flap,28,5);ctx.quadraticCurveTo(11,1,0,0);ctx.fill();
  }else{const rareGlow=e.type==='rare'||e.type==='cavefly';ctx.shadowColor=rareGlow?'#c88fff':'#ffe86f';ctx.shadowBlur=rareGlow?24:15;ctx.fillStyle=rareGlow?'#d6a2ff':'#f3dc68';ctx.beginPath();ctx.ellipse(0,0,7,5,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#eaf7d1';ctx.beginPath();ctx.ellipse(-6,-3,7,3,-0.5,0,Math.PI*2);ctx.ellipse(6,-3,7,3,0.5,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;}
  ctx.restore();
}
