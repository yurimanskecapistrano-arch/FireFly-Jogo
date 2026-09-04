/* =========================================================
   RENDER 2.1 — composição do mundo grande e regiões
   ========================================================= */
import {ctx,ui} from '../core/dom.js';
import {state} from '../core/state.js';
import {W,H,MAP_LIMITS} from '../core/constants.js';
import {save} from '../systems/save.js';
import {quest} from '../systems/quests.js';
import {wx,txt} from './draw-helpers.js';
import {sky,ground,tree,lake,caveEntrance,caveWorld,house,drawVan,drawTito,flower,drawForestRocks,forestDetails} from '../world/scenery.js';
import {drawPlayer} from '../entities/player.js';
import {drawCreature} from '../entities/creatures.js';
import {activeInteractable} from '../world/maps.js';

export function render(){
 ctx.save();
 if(state.camera.shake>0)ctx.translate((Math.random()-.5)*state.camera.shake,(Math.random()-.5)*state.camera.shake);
 sky();ground();
 if(state.map==='village'){
   [130,280,780,1120].forEach((x,i)=>tree(x,320,.8+(i%3)*.12,i%2));house();drawVan();drawTito();
   for(let x=80;x<1180;x+=73)flower(x,544,x%2?'#f59b86':'#f4d477');drawVillageAtmosphere();
 }else if(state.map==='forest'){
   /* A câmera percorre um mundo de 5200px: a floresta é povoada por centenas
      de elementos estáticos leves em vez de repetir a mesma tela. */
   const trees=[80,230,410,590,760,940,1110,1300,1490,1660,1840,2020,2200,2390,2580,2760,2940,3120,3310,3490,3670,3860,4040,4230,4420,4610,4800,4990];
   trees.forEach((x,i)=>tree(x,315+(i%3)*12,.68+(i%4)*.13,i%3===0));
   lake();caveEntrance();drawForestRocks();forestDetails();
   state.entities.filter(e=>e.alive).forEach(e=>drawCreature(e,ctx,state.t));drawNightMotes();drawRegionMarkers();
 }else if(state.map==='cave'){
   caveWorld();state.entities.filter(e=>e.alive).forEach(e=>drawCreature(e,ctx,state.t));drawCaveDust();drawCaveRegion();
 }
 drawPlayer();
 for(const p of state.particles){ctx.globalAlpha=Math.max(0,p.life/p.maxLife);ctx.fillStyle=p.color;ctx.fillRect(wx(p.x),p.y,p.size,p.size);ctx.globalAlpha=1;}
 if(state.map==='cave'){
   const x=wx(state.player.x),radius=save.inventory.lantern?225:110;ctx.save();ctx.fillStyle='#06121add';ctx.fillRect(0,0,W,H);ctx.globalCompositeOperation='destination-out';const g=ctx.createRadialGradient(x,state.player.y,8,x,state.player.y,radius);g.addColorStop(0,'#000');g.addColorStop(.58,'#000b');g.addColorStop(1,'transparent');ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,state.player.y,radius,0,6.28);ctx.fill();ctx.restore();
 }
 ctx.restore();
 const inter=activeInteractable();if(ui.prompt)ui.prompt.textContent=inter?'[E] '+inter.label:state.map==='forest'?'[ESPAÇO] usar rede':'Explore com calma';
 if(inter){ctx.fillStyle='#173f43dd';ctx.beginPath();ctx.roundRect(wx(inter.x)-90,inter.y-75,180,28,8);ctx.fill();txt('[E] '+inter.label,wx(inter.x),inter.y-56,11,'#fff8d7','center');}
 renderQuestHud();renderFishingHud();
 if(state.fade.value>0){ctx.globalAlpha=Math.min(1,state.fade.value);ctx.fillStyle='#102630';ctx.fillRect(0,0,W,H);ctx.globalAlpha=1;}
}
function drawVillageAtmosphere(){for(let i=0;i<7;i++){const x=wx(140+i*180),y=470+Math.sin(state.t*.8+i)*4;ctx.fillStyle='#f7d98a66';ctx.beginPath();ctx.arc(x,y,3,0,6.28);ctx.fill();}}
function drawNightMotes(){if(state.clock>.22&&state.clock<.78)return;for(let i=0;i<42;i++){const x=wx((i*173+state.t*8*(i%3+1))%Math.max(1,MAP_LIMITS.forest-100)),y=300+(i*67)%210+Math.sin(state.t*1.5+i)*12;ctx.fillStyle=i%7===0?'#d7a4ff':'#f8df75';ctx.globalAlpha=.25+.3*Math.sin(state.t*3+i);ctx.shadowColor=ctx.fillStyle;ctx.shadowBlur=10;ctx.beginPath();ctx.arc(x,y,1.7+(i%2),0,6.28);ctx.fill();ctx.shadowBlur=0;ctx.globalAlpha=1;}}
function drawRegionMarkers(){const regions=[['ENTRADA',300],['FLORES',1035],['LAGOA',1840],['TRILHA',2920],['PEDREIRA',3740],['BOSQUE ALTO',4620]];const p=state.player.x;for(const [label,xp] of regions){if(Math.abs(xp-p)<420){ctx.fillStyle='#102f35aa';ctx.beginPath();ctx.roundRect(W/2-95,78,190,28,9);ctx.fill();txt(label,W/2,97,10,'#ffe7a5','center');break;}}}
function drawCaveRegion(){const p=state.player.x;const labels=[['BOCA DA CAVERNA',300],['GALERIA DOS ECOS',1050],['SALÃO DE CRISTAL',1900],['TÚNEIS PROFUNDOS',3000]];for(const [label,xp] of labels){if(Math.abs(xp-p)<450){txt(label,W/2,92,10,'#bde9d9','center');break;}}}
function drawCaveDust(){for(let i=0;i<28;i++){const x=(i*107+state.t*3)%W,y=150+(i*53)%470;ctx.fillStyle='#b7d8d055';ctx.beginPath();ctx.arc(x,y,1+(i%2),0,6.28);ctx.fill();}}
function renderQuestHud(){const q=quest();if(q.status!=='active'&&q.status!=='complete')return;ctx.fillStyle='#173f43dd';ctx.beginPath();ctx.roundRect(20,100,210,58,10);ctx.fill();txt('MISSÃO · TITO',32,121,11,'#fbe7a7');txt(q.status==='complete'?'✓ Volte para Tito':`${q.title}`,32,142,12,'#fff');txt(q.status==='complete'?'Recompensa pronta':`${q.progress} / ${q.required}`,196,142,11,'#ffe86f','right');}
function renderFishingHud(){const f=state.fishing;if(!f||f.stage!=='reel')return;const x=W/2-100,y=H-78;ctx.fillStyle='#173f43ee';ctx.beginPath();ctx.roundRect(x,y,200,48,11);ctx.fill();txt('TENSÃO DA LINHA',x+100,y+15,10,'#fbe7a7','center');ctx.fillStyle='#0d2a2c';ctx.fillRect(x+14,y+22,172,10);ctx.fillStyle='#5aa8c9';ctx.fillRect(x+14+172*.4,y+22,172*.38,10);ctx.fillStyle=f.tension>.78||f.tension<.2?'#ff8a6b':'#ffe86f';ctx.fillRect(x+14+172*f.tension-2,y+20,4,14);ctx.fillStyle='#7bcf9b';ctx.fillRect(x+14,y+35,172*f.progress,4);txt('ESPAÇO · manter a tensão',x+100,y+46,8,'#cce8d8','center');}
