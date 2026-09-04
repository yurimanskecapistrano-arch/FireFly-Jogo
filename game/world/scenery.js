/* =========================================================
   CENÁRIO 2.0 — mundo orgânico, zonas, atmosfera e van
   ========================================================= */
import { ctx } from '../core/dom.js';
import { state } from '../core/state.js';
import { W,H } from '../core/constants.js';
import { wx,poly,txt } from '../render/draw-helpers.js';
import { LAKE,FOREST_ROCKS,CAVE_ENTRANCE_X } from './spots.js';

const lerp=(a,b,t)=>a+(b-a)*t;
export function sky(){
  const d=1-Math.abs(state.clock-.5)*2;const top=state.map==='cave'?'#14212a':`rgb(${18+82*d},${34+175*d},${58+150*d})`;const bottom=state.map==='cave'?'#263b46':`rgb(${30+135*d},${57+145*d},${75+105*d})`;
  const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,top);g.addColorStop(1,bottom);ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  if(state.map==='cave')return;
  if(d<.35){ctx.fillStyle='#f4edcf';ctx.beginPath();ctx.arc(1030,105,27,0,6.28);ctx.fill();for(let i=0;i<65;i++){ctx.fillStyle=i%4?'#d9e6d5':'#fff5cb';ctx.fillRect((i*83)%W,(i*47)%330,1+(i%2),1+(i%2));}}
  else{ctx.fillStyle='#ffe6a1';ctx.beginPath();ctx.arc(1030,105,36,0,6.28);ctx.fill();}
  const layers=['#5a9d7c','#3b7e69','#285e59'];layers.forEach((color,l)=>{const off=(state.camera.x*(.13+l*.13))%150;ctx.fillStyle=color;for(let x=-170-off;x<W+160;x+=118){ctx.beginPath();ctx.moveTo(x,450);ctx.quadraticCurveTo(x+28,305-l*28,x+66,435);ctx.quadraticCurveTo(x+102,320-l*12,x+136,450);ctx.fill();}});
}
export function ground(){
  const cave=state.map==='cave';ctx.fillStyle=cave?'#243a44':'#315f48';ctx.fillRect(0,430,W,H-430);ctx.fillStyle=cave?'#415963':'#4e8e59';ctx.fillRect(0,462,W,H-462);
  if(!cave){ctx.fillStyle='#806c51aa';ctx.beginPath();ctx.moveTo(0,535);ctx.bezierCurveTo(320,505,650,580,950,535);ctx.bezierCurveTo(1130,510,1210,540,1280,525);ctx.lineTo(1280,565);ctx.bezierCurveTo(1000,580,720,610,420,555);ctx.bezierCurveTo(190,525,80,570,0,565);ctx.fill();}
  for(let x=-40;x<W+40;x+=25){ctx.strokeStyle=cave?'#607a80':'#78b66a';ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(x,463);ctx.lineTo(x+4,454+Math.sin(state.t+x)*2);ctx.lineTo(x+8,462);ctx.stroke();}
}
export function tree(x,y,scale,variant=0){
  x=wx(x);ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);ctx.rotate(Math.sin(state.t*1.2+x)*.012);poly([[-16,165],[-39,187],[-12,178],[0,198],[14,178],[40,188],[18,164],[16,62],[-12,51]],variant?'#704a3c':'#674536','#333b3f');ctx.fillStyle='#a86d4c';ctx.fillRect(-3,66,6,98);
  const crowns=variant?[['#4d965a',-29,28,44],['#367e50',22,22,49],['#67ad66',1,-10,54],['#448d55',-40,0,34],['#5ba961',38,-4,34]]:[['#4d9759',-25,32,46],['#3b8150',20,27,52],['#65ad65',0,-9,56],['#4b9557',-40,2,36],['#61aa62',40,-3,38]];
  crowns.forEach(([c,a,b,r])=>{ctx.fillStyle=c;ctx.beginPath();ctx.moveTo(a-r*.7,b+r*.25);ctx.quadraticCurveTo(a-r,b-r*.35,a,b-r);ctx.quadraticCurveTo(a+r,b-r*.2,a+r*.65,b+r*.4);ctx.quadraticCurveTo(a,b+r,a-r*.7,b+r*.25);ctx.fill();});
  ctx.fillStyle='#83c36f';for(let i=0;i<5;i++){ctx.beginPath();ctx.arc(-30+i*15,35+(i%2)*12,2,0,6.28);ctx.fill();}ctx.restore();
}
export function rocks(x,y,scale=1){x=wx(x);poly([[x-22*scale,y],[x-12*scale,y-20*scale],[x+10*scale,y-24*scale],[x+25*scale,y-6*scale],[x+17*scale,y+4*scale],[x-17*scale,y+4*scale]],'#728c80','#46675d');ctx.fillStyle='#a4ba9f';ctx.beginPath();ctx.moveTo(x-7*scale,y-15*scale);ctx.lineTo(x+7*scale,y-18*scale);ctx.lineTo(x+2*scale,y-12*scale);ctx.closePath();ctx.fill();}
export function drawForestRocks(){FOREST_ROCKS.forEach(r=>rocks(r.x,r.y,r.scale));}
export function flower(x,y,color){x=wx(x);ctx.strokeStyle='#326b44';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x,y);ctx.quadraticCurveTo(x+2,y-10,x+1,y-19+Math.sin(state.t+x)*2);ctx.stroke();for(let i=0;i<5;i++){ctx.fillStyle=color;ctx.beginPath();ctx.ellipse(x+1+Math.cos(i*1.256)*5,y-23+Math.sin(i*1.256)*5,4,3,i,0,6.28);ctx.fill();}ctx.fillStyle='#ffe276';ctx.beginPath();ctx.arc(x+1,y-23,3,0,6.28);ctx.fill();}
function mushroom(x,y,scale=1){x=wx(x);ctx.strokeStyle='#d4d1b5';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x,y-10*scale);ctx.stroke();ctx.fillStyle='#c56c68';ctx.beginPath();ctx.ellipse(x,y-13*scale,8*scale,5*scale,0,Math.PI,6.28);ctx.fill();ctx.fillStyle='#f3dcae';ctx.beginPath();ctx.arc(x-3*scale,y-14*scale,1.5*scale,0,6.28);ctx.arc(x+3*scale,y-13*scale,1.2*scale,0,6.28);ctx.fill();}
function reed(x,y){x=wx(x);ctx.strokeStyle='#5f8d54';ctx.lineWidth=2;for(let i=-1;i<2;i++){ctx.beginPath();ctx.moveTo(x+i*4,y);ctx.quadraticCurveTo(x+i*6,y-15,x+i*8,y-25);ctx.stroke();}}
function bench(x,y){x=wx(x);ctx.fillStyle='#694c3d';ctx.fillRect(x-26,y-12,52,5);ctx.fillRect(x-22,y-3,5,13);ctx.fillRect(x+17,y-3,5,13);}
export function forestDetails(){
  for(let x=120;x<2200;x+=137){mushroom(x,548+(x%3)*5,0.7+(x%2)*.25);if(x%4===0)reed(x+30,535);}
  [310,640,980,1320,1690,2010].forEach((x,i)=>{if(i%2===0)bench(x,535);});
  const areaX=[160,620,1060,1510,1900];const labels=['ENTRADA','CLAREIRA DAS FLORES','LAGOA CINTILANTE','TRILHA ANTIGA','BOSQUE ALTO'];areaX.forEach((x,i)=>{if(i>0){ctx.strokeStyle='#e4d1a355';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(wx(x-45),520);ctx.lineTo(wx(x+45),520);ctx.stroke();}txt(labels[i],wx(x),495,9,'#f7e5b8','center');});
}
export function lake(){
  const x=wx(LAKE.x),y=LAKE.y;poly([[x-230,y+32],[x-195,y-18],[x-145,y-40],[x-91,y-30],[x-45,y-61],[x+35,y-52],[x+76,y-23],[x+155,y-29],[x+212,y+8],[x+185,y+48],[x+92,y+64],[x+20,y+49],[x-68,y+68],[x-150,y+51]],'#79644c','#3d654c');
  const water=ctx.createLinearGradient(0,y-45,0,y+50);water.addColorStop(0,'#4aa6b2');water.addColorStop(1,'#277789');poly([[x-188,y+22],[x-153,y-6],[x-93,y-18],[x-42,y-41],[x+26,y-34],[x+76,y-10],[x+146,y-12],[x+177,y+11],[x+149,y+30],[x+90,y+42],[x+18,y+31],[x-53,y+49],[x-125,y+35]],water);
  for(let i=0;i<10;i++){ctx.strokeStyle=i%3?'#a7e7d9aa':'#d0f1d9aa';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(x-145+i*32+Math.sin(state.t*.8+i)*8,y+7+(i%3)*10,9+(i%2)*3,.2,2.7);ctx.stroke();}
  [[-170,17],[164,17],[-145,-10],[120,23]].forEach(([dx,dy])=>reed(x+dx-wx(0),y+dy));
  if(state.fishing){const bob=state.fishing.stage==='reel'?Math.sin(state.t*22)*5:state.fishing.ready?Math.sin(state.t*18)*9:Math.sin(state.t*4)*2;ctx.strokeStyle='#ead8b3';ctx.beginPath();ctx.moveTo(wx(state.player.x)+30,state.player.y-10);ctx.lineTo(x,y-10+bob);ctx.stroke();ctx.fillStyle='#f2c764';ctx.beginPath();ctx.arc(x,y-10+bob,5,0,6.28);ctx.fill();}
}
export function caveEntrance(){
  const x=wx(CAVE_ENTRANCE_X),y=465;poly([[x-145,112],[x-132,55],[x-101,18],[x-58,0],[x-18,-8],[x+20,14],[x+57,1],[x+99,27],[x+132,64],[x+145,112]],'#56625f','#30434a');poly([[x-82,112],[x-73,61],[x-43,28],[x-5,17],[x+37,40],[x+70,74],[x+77,112]],'#10232e');for(let i=0;i<5;i++){ctx.fillStyle=i%2?'#8ce0c0':'#a2d8b8';ctx.beginPath();ctx.moveTo(x-34+i*17,105);ctx.lineTo(x-28+i*17,71+(i%2)*8);ctx.lineTo(x-20+i*17,105);ctx.fill();}txt('CAVERNA ECOANTE',x,y+30,10,'#dcebd5','center');}
export function caveWorld(){
  ctx.fillStyle='#172932';ctx.fillRect(0,0,W,H);for(let x=0;x<W;x+=70){poly([[x,0],[x+32,37+(x%4)*14],[x+70,0]],'#2a4552');poly([[x,H],[x+31,650-(x%5)*10],[x+70,H]],'#304b55');}
  for(let i=0;i<16;i++){const x=(i*139)%W,y=315+(i%4)*82;rocks(x,y,.6+(i%3)*.15);if(i%3===0){ctx.shadowColor='#76d9d0';ctx.shadowBlur=15;ctx.fillStyle='#76d9d0';ctx.beginPath();ctx.moveTo(x,y-5);ctx.lineTo(x+5,y-31);ctx.lineTo(x+11,y-5);ctx.closePath();ctx.fill();ctx.shadowBlur=0;}}
  for(let i=0;i<8;i++)mushroom((i*171)%W,590+(i%2)*12,.7);
}
export function house(){const x=wx(630),y=400;poly([[x-123,y+100],[x-113,y+36],[x-74,y-2],[x-8,y+15],[x+42,y-6],[x+109,y+36],[x+123,y+100]],'#d78e5a','#623f3c');poly([[x-133,y+40],[x-81,y-31],[x-3,y+2],[x+45,y-31],[x+129,y+41],[x+109,y+48],[x+39,y+8],[x-5,y+28],[x-84,y-20],[x-118,y+49]],'#9b5147','#623f3c');ctx.fillStyle='#f1c378';ctx.fillRect(x-50,y+58,35,42);ctx.fillStyle='#7bc0c4';ctx.fillRect(x+29,y+41,34,26);ctx.strokeStyle='#653f3e';ctx.strokeRect(x+29,y+41,34,26);txt('LOJINHA DA LUMINA',x,y+20,11,'#fff5c9','center');}
export function drawVan(){
  const x=wx(980),y=520;const moving=state.travel>0;ctx.save();ctx.translate(x,y+(moving?Math.sin(state.t*35)*3:0));
  ctx.fillStyle='#172b3388';ctx.beginPath();ctx.ellipse(0,18,123,16,0,0,6.28);ctx.fill();
  ctx.fillStyle='#284958';ctx.beginPath();ctx.roundRect(-118,-62,230,70,20);ctx.fill();ctx.fillStyle='#df8050';ctx.beginPath();ctx.roundRect(-111,-57,216,59,16);ctx.fill();
  poly([[-87,-60],[-58,-98],[25,-98],[67,-59]],'#df8050','#284958');ctx.fillStyle='#9ed9de';ctx.beginPath();ctx.roundRect(-49,-88,37,25,5);ctx.fill();ctx.roundRect(-7,-88,39,25,5);ctx.fill();
  ctx.fillStyle='#f7d982';ctx.beginPath();ctx.arc(88,-28,7,0,6.28);ctx.fill();ctx.fillStyle='#a9e8df';ctx.fillRect(71,-42,22,8);ctx.fillStyle='#26424e';ctx.fillRect(41,-49,30,49);ctx.fillStyle='#f8edc8';ctx.font='900 15px system-ui';ctx.textAlign='center';ctx.fillText('FIREFLY',8,-17);ctx.font='9px system-ui';ctx.fillText('EXPLORAÇÕES',8,-4);
  [-72,-10,49,83].forEach((o,i)=>{ctx.fillStyle='#222e35';ctx.beginPath();ctx.arc(o,4,16,0,6.28);ctx.fill();ctx.fillStyle='#c9d0c5';ctx.beginPath();ctx.arc(o,4,7,0,6.28);ctx.fill();if(i===1){ctx.strokeStyle='#f3d274';ctx.lineWidth=2;ctx.beginPath();ctx.arc(o,4,11,0,6.28);ctx.stroke();}});
  ctx.strokeStyle='#8e5544';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-110,-9);ctx.lineTo(-105,-35);ctx.stroke();ctx.restore();
}
export function drawTito(){const x=wx(460),y=505+Math.sin(state.t*2)*2;ctx.save();ctx.translate(x,y);poly([[-18,40],[-21,11],[-8,-1],[17,3],[26,39]],'#7568aa','#343d55');ctx.fillStyle='#f2be91';ctx.beginPath();ctx.arc(1,-12,18,0,6.28);ctx.fill();poly([[-21,-10],[-7,-34],[18,-28],[26,-4],[10,-13]],'#d86f55','#343d55');ctx.fillStyle='#40585c';ctx.fillRect(-19,40,15,8);ctx.fillRect(10,40,15,8);ctx.restore();txt('TITO',x,y+65,11,'#fff8d9','center');}
