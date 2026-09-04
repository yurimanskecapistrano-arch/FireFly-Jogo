/* =========================================================
   UPDATE 3.2 — simulação contínua do mundo
   ========================================================= */
import {state,addParticles,tickParticles,tickFade,isNight} from './state.js';
import {clamp} from './utils.js';import {isDown} from './input.js';import {ui} from './dom.js';import {W} from './constants.js';import {updatePlayer} from '../entities/player.js';import {updateCreature} from '../entities/creatures.js';import {tickFishing} from '../systems/fishing.js';import {AudioManager} from '../systems/audio.js';import {beginMap} from '../world/maps.js';import {updateResources,ensureProgression,progressSummary} from '../systems/progression.js';import {save,saveGame} from '../systems/save.js';import {updateLivingWorld,tickWorldEvent,clockLabel} from '../systems/living-world.js';
let lastNight=null,lastMap=null,autosave=0,stepTimer=0;
export function update(dt){
 state.t+=dt;state.clock=(state.clock+dt/300)%1;ensureProgression();save.progression.clock=state.clock;
 const night=isNight();if(ui.time)ui.time.textContent=`${night?'☾':'☀'} ${clockLabel()} · ${night?'NOITE':'DIA'}`;
 if(night!==lastNight){lastNight=night;AudioManager.setTime(night);}if(state.map!==lastMap){lastMap=state.map;AudioManager.playMusic(state.map);}
 updateLivingWorld(dt);tickWorldEvent(dt);
 const maxX=updatePlayer(dt),p=state.player;state.camera.target=clamp(p.x-W*.46,0,Math.max(0,maxX-W+100));state.camera.x+=(state.camera.target-state.camera.x)*Math.min(1,dt*4.5);state.camera.shake*=Math.pow(.08,dt);
 const world={playerX:p.x,playerY:p.y,isNight:night,maxX,worldHour:clockLabel(),event:state.worldEvent,entities:state.entities};for(const entity of state.entities)updateCreature(entity,dt,world);
 tickFishing(dt,isDown(' '));updateResources(dt);stepTimer+=dt;if(stepTimer>.55&&Math.abs(p.vx)>80){stepTimer=0;save.progression.stats.steps++;}
 autosave+=dt;if(autosave>20){autosave=0;saveGame();}if(state.travel){state.travel-=dt;if(state.travel<.65)addParticles(890,state.player.y,'#d9ded0',2);if(state.travel<=0){state.travel=0;AudioManager.playSFX('van-engine');beginMap('forest',170);}}
 tickParticles(dt);tickFade(dt);const ps=progressSummary();if(ui.level)ui.level.textContent=`LV ${ps.level}`;
}
