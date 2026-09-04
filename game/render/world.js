/* =========================================================
   RENDER 2.0 — compõe mundo, zonas, atmosfera e feedback
   ========================================================= */
import { ctx,ui } from '../core/dom.js';
import { state } from '../core/state.js';
import { W,H } from '../core/constants.js';
import { save } from '../systems/save.js';
import { quest } from '../systems/quests.js';
import { wx,txt } from './draw-helpers.js';
import { sky,ground,tree,lake,caveEntrance,caveWorld,house,drawVan,drawTito,flower,drawForestRocks,forestDetails } from '../world/scenery.js';
import { drawPlayer } from '../entities/player.js';
import { drawCreature } from '../entities/creatures.js';
import { activeInteractable } from '../world/maps.js';

export function render(){
  ctx.save();
  if(state.camera.shake>0)ctx.translate((Math.random()-.5)*state.camera.shake,(Math.random()-.5)*state.camera.shake);
  sky();ground();
  if(state.map==='village'){
    [130,280,780,1120].forEach((x,i)=>tree(x,320,.8+(i%3)*.12,i%2));house();drawVan();drawTito();
    for(let x=80;x<1180;x+=73)flower(x,544,x%2?'#f59b86':'#f4d477');
    drawVillageAtmosphere();
  }else if(state.map==='forest'){
    [90,270,480,820,1120,1300,1500,1730,1920,2110].forEach((x,i)=>tree(x,315,.72+(i%4)*.13,i%2));
    lake();caveEntrance();drawForestRocks();forestDetails();
    for(let x=160;x<2200;x+=87)flower(x,550,x%2?'#f0928d':'#e6d46e');
    state.entities.filter(e=>e.alive).forEach(e=>drawCreature(e,ctx,state.t));
    drawNightMotes();
  }else if(state.map==='cave'){
    caveWorld();state.entities.filter(e=>e.alive).forEach(e=>drawCreature(e,ctx,state.t));drawCaveDust();
  }
  drawPlayer();
  for(const p of state.particles){ctx.globalAlpha=Math.max(0,p.life/p.maxLife);ctx.fillStyle=p.color;ctx.fillRect(wx(p.x),p.y,p.size,p.size);ctx.globalAlpha=1;}
  if(state.map==='cave'){
    const x=wx(state.player.x),radius=save.inventory.lantern?205:115;ctx.save();ctx.fillStyle='#06121add';ctx.fillRect(0,0,W,H);ctx.globalCompositeOperation='destination-out';const g=ctx.createRadialGradient(x,state.player.y,10,x,state.player.y,radius);g.addColorStop(0,'#000');g.addColorStop(.62,'#000b');g.addColorStop(1,'transparent');ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,state.player.y,radius,0,6.28);ctx.fill();ctx.restore();
  }
  ctx.restore();
  const inter=activeInteractable();if(ui.prompt)ui.prompt.textContent=inter?'[E] '+inter.label:state.map==='forest'?'[ESPAÇO] usar rede':'Explore com calma';
  if(inter){ctx.fillStyle='#173f43dd';ctx.beginPath();ctx.roundRect(wx(inter.x)-90,inter.y-75,180,28,8);ctx.fill();txt('[E] '+inter.label,wx(inter.x),inter.y-56,11,'#fff8d7','center');}
  renderQuestHud();renderFishingHud();
  if(state.fade.value>0){ctx.globalAlpha=Math.min(1,state.fade.value);ctx.fillStyle='#102630';ctx.fillRect(0,0,W,H);ctx.globalAlpha=1;}
}
function drawVillageAtmosphere(){for(let i=0;i<5;i++){const x=wx(180+i*210),y=470+Math.sin(state.t*.8+i)*4;ctx.fillStyle='#f7d98a66';ctx.beginPath();ctx.arc(x,y,3,0,6.28);ctx.fill();}}
function drawNightMotes(){if(state.clock>.22&&state.clock<.78)return;for(let i=0;i<28;i++){const x=wx((i*173+state.t*8*(i%3+1))%2150),y=300+(i*67)%210+Math.sin(state.t*1.5+i)*12;ctx.fillStyle=i%7===0?'#d7a4ff':'#f8df75';ctx.globalAlpha=.28+.28*Math.sin(state.t*3+i);ctx.shadowColor=ctx.fillStyle;ctx.shadowBlur=10;ctx.beginPath();ctx.arc(x,y,1.7+(i%2),0,6.28);ctx.fill();ctx.shadowBlur=0;ctx.globalAlpha=1;}}
function drawCaveDust(){for(let i=0;i<18;i++){const x=(i*107+state.t*3)%W,y=150+(i*53)%470;ctx.fillStyle='#b7d8d055';ctx.beginPath();ctx.arc(x,y,1+(i%2),0,6.28);ctx.fill();}}
function renderQuestHud(){const q=quest();if(q.status!=='active'&&q.status!=='complete')return;ctx.fillStyle='#173f43dd';ctx.beginPath();ctx.roundRect(20,100,210,58,10);ctx.fill();txt('MISSÃO · TITO',32,121,11,'#fbe7a7');txt(q.status==='complete'?'✓ Volte para Tito':`${q.title}`,32,142,12,'#fff');txt(q.status==='complete'?'Recompensa pronta':`${q.progress} / ${q.required}`,196,142,11,'#ffe86f','right');}
function renderFishingHud(){const f=state.fishing;if(!f||f.stage!=='reel')return;const x=W/2-100,y=H-78;ctx.fillStyle='#173f43ee';ctx.beginPath();ctx.roundRect(x,y,200,48,11);ctx.fill();txt('TENSÃO DA LINHA',x+100,y+15,10,'#fbe7a7','center');ctx.fillStyle='#0d2a2c';ctx.fillRect(x+14,y+22,172,10);ctx.fillStyle='#5aa8c9';ctx.fillRect(x+14+172*.4,y+22,172*.38,10);ctx.fillStyle=f.tension>.78||f.tension<.2?'#ff8a6b':'#ffe86f';ctx.fillRect(x+14+172*f.tension-2,y+20,4,14);ctx.fillStyle='#7bcf9b';ctx.fillRect(x+14,y+35,172*f.progress,4);txt('ESPAÇO · manter a tensão',x+100,y+46,8,'#cce8d8','center');}
