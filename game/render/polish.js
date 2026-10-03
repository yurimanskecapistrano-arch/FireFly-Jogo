/* =========================================================
   POLISH OVERLAY — atmosfera e game feel
   ========================================================= */
import {ctx} from '../core/dom.js';
import {state,isNight} from '../core/state.js';
import {W,H} from '../core/constants.js';
import {weatherType} from '../systems/weather.js';

const TAU=Math.PI*2;

function seeded(i){return Math.sin(i*91.731+17.13)*.5+.5;}

export function renderPolishOverlay(){
  drawAmbientMotes();
  drawDepthVignette();
  drawCinematicCorners();
}

function drawAmbientMotes(){
  if(!['forest','cave','village'].includes(state.map))return;
  const night=isNight();
  const rain=weatherType()==='rain';
  if(!night&&!rain)return;
  ctx.save();
  const count=state.map==='cave'?18:30;
  for(let i=0;i<count;i++){
    const phase=state.t*(.35+seeded(i)*.65)+i*2.7;
    const x=(seeded(i*3+2)*W+Math.sin(phase)*35+i*11)%W;
    const y=350+seeded(i*5+1)*270+Math.cos(phase*.8)*18;
    const pulse=.35+.65*(.5+.5*Math.sin(phase*2.2));
    ctx.globalAlpha=(night?.32:.12)*pulse;
    ctx.fillStyle=state.map==='cave'?'#9ee5d4':'#f4df91';
    ctx.shadowBlur=night?9:4;
    ctx.shadowColor=ctx.fillStyle;
    ctx.beginPath();ctx.arc(x,y,night?1.6:1.1,0,TAU);ctx.fill();
  }
  ctx.restore();
}

function drawDepthVignette(){
  const g=ctx.createRadialGradient(W*.5,H*.53,180,W*.5,H*.52,760);
  g.addColorStop(0,'#0000');
  g.addColorStop(.72,'#071b2110');
  g.addColorStop(1,isNight()?'#050b14aa':'#0b202433');
  ctx.save();ctx.fillStyle=g;ctx.fillRect(0,0,W,H);ctx.restore();
}

function drawCinematicCorners(){
  if(state.fade.value>0)return;
  ctx.save();
  ctx.globalAlpha=.16;
  ctx.strokeStyle='#f1d9a1';
  ctx.lineWidth=1;
  ctx.beginPath();ctx.moveTo(18,56);ctx.lineTo(18,92);ctx.moveTo(18,56);ctx.lineTo(54,56);ctx.moveTo(W-18,56);ctx.lineTo(W-18,92);ctx.moveTo(W-18,56);ctx.lineTo(W-54,56);ctx.stroke();
  ctx.restore();
}
