/* =========================================================
   RENDER — compõe o frame inteiro
   ========================================================= */
import { ctx } from '../core/dom.js';
import { state } from '../core/state.js';
import { W, H } from '../core/constants.js';
import { save } from '../systems/save.js';
import { quest } from '../systems/quests.js';
import { wx, txt } from './draw-helpers.js';
import { sky, ground, tree, lake, caveEntrance, caveWorld, house, drawVan, drawTito, flower, drawForestRocks } from '../world/scenery.js';
import { drawPlayer } from '../entities/player.js';
import { drawCreature } from '../entities/creatures.js';
import { activeInteractable } from '../world/maps.js';
import { ui } from '../core/dom.js';
export function render() {
  ctx.save();
  if (state.camera.shake > 0) ctx.translate((Math.random()-0.5)*state.camera.shake,(Math.random()-0.5)*state.camera.shake);
  sky(); ground();
  if (state.map === 'village') {
    [130,280,780,1120].forEach((x,index)=>tree(x,320,index%2?0.85:1,index%2)); house(); drawVan(); drawTito();
    for(let x=80;x<1180;x+=73) flower(x,544,x%2?'#f59b86':'#f4d477');
  } else if (state.map === 'forest') {
    [90,270,480,1120,1300,1500,1730,1920,2110].forEach((x,index)=>tree(x,315,0.75+(index%3)*0.17,index%2)); lake(); caveEntrance(); drawForestRocks();
    for(let x=160;x<2200;x+=87) flower(x,550,x%2?'#f0928d':'#e6d46e');
    state.entities.filter(e=>e.alive).forEach(e=>drawCreature(e,ctx,state.t));
  } else if (state.map === 'cave') {
    caveWorld(); state.entities.filter(e=>e.alive).forEach(e=>drawCreature(e,ctx,state.t));
  }
  drawPlayer();
  for(const particle of state.particles){ctx.globalAlpha=Math.max(0,particle.life/particle.maxLife);ctx.fillStyle=particle.color;ctx.fillRect(wx(particle.x),particle.y,particle.size,particle.size);ctx.globalAlpha=1;}
  if(state.map==='cave'){
    const x=wx(state.player.x); const radius=save.inventory.lantern?190:110; ctx.save(); ctx.fillStyle='#071221dd'; ctx.fillRect(0,0,W,H); ctx.globalCompositeOperation='destination-out'; const gradient=ctx.createRadialGradient(x,state.player.y,15,x,state.player.y,radius); gradient.addColorStop(0,'#000'); gradient.addColorStop(1,'transparent'); ctx.fillStyle=gradient; ctx.beginPath(); ctx.arc(x,state.player.y,radius,0,Math.PI*2); ctx.fill(); ctx.restore();
  }
  ctx.restore();
  const interactable=activeInteractable();
  if(ui.prompt) ui.prompt.textContent=interactable?'[E] '+interactable.label:state.map==='forest'?'[ESPAÇO] usar rede':'Explore com calma';
  if(interactable){ctx.fillStyle='#173f43dd';ctx.beginPath();ctx.roundRect(wx(interactable.x)-90,interactable.y-75,180,28,8);ctx.fill();txt('[E] '+interactable.label,wx(interactable.x),interactable.y-56,11,'#fff8d7','center');}
  renderQuestHud(); renderFishingHud();
  if(state.fade.value>0){ctx.globalAlpha=Math.min(1,state.fade.value);ctx.fillStyle='#102630';ctx.fillRect(0,0,W,H);ctx.globalAlpha=1;}
}
function renderQuestHud(){const currentQuest=quest();if(currentQuest.status!=='active'&&currentQuest.status!=='complete')return;ctx.fillStyle='#173f43dd';ctx.beginPath();ctx.roundRect(20,100,190,58,10);ctx.fill();txt('MISSÃO · TITO',32,121,11,'#fbe7a7');txt(currentQuest.status==='complete'?'✓ Volte para Tito':'Sapos: '+currentQuest.progress+' / 3',32,143,13,'#fff');}
function renderFishingHud(){const f=state.fishing;if(!f||f.stage!=='reel')return;const x=W/2-90,y=H-70;ctx.fillStyle='#173f43dd';ctx.beginPath();ctx.roundRect(x,y,180,40,10);ctx.fill();txt('TENSÃO DA LINHA',x+90,y+14,10,'#fbe7a7','center');ctx.fillStyle='#0d2a2c';ctx.fillRect(x+12,y+20,156,10);ctx.fillStyle='#5aa8c9';ctx.fillRect(x+12+156*0.4,y+20,156*(0.78-0.4),10);ctx.fillStyle=f.tension>0.78||f.tension<0.2?'#ff8a6b':'#ffe86f';ctx.fillRect(x+12+156*f.tension-2,y+18,4,14);ctx.fillStyle='#4a9773';ctx.fillRect(x+12,y+32,156*f.progress,4);}
