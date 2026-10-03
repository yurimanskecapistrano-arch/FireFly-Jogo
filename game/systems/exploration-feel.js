/* =========================================================
   EXPLORATION FEEL — pistas naturais para curiosidade
   ========================================================= */
import {state} from '../core/state.js';
import {save} from './save.js';

function discovered(id){
  if(id.startsWith('landmark-')) return !!save.world?.landmarks?.[id.slice(9)];
  if(id.startsWith('secret-')) return !!save.world?.secrets?.[id.slice(7)];
  return true;
}

export function nearestDiscovery(maxDistance=430){
  if(!['forest','cave'].includes(state.map)) return null;
  const p=state.player;
  let best=null,bestD=maxDistance;
  for(const item of state.interactables){
    if(item.map!==state.map||!item.id.startsWith('landmark-')&&!item.id.startsWith('secret-')||discovered(item.id)) continue;
    const d=Math.hypot(item.x-p.x,(item.y-p.y)*.7);
    if(d<bestD){best=item;bestD=d;}
  }
  return best?{...best,distance:bestD}:null;
}

export function drawDiscoverySignals(ctx,wx){
  const target=nearestDiscovery();
  if(!target)return;
  const dx=target.x-state.player.x;
  const X=wx(state.player.x+dx*.62);
  const y=target.y-18;
  const count=Math.max(3,Math.round(9-target.distance/70));
  ctx.save();
  for(let i=0;i<count;i++){
    const phase=state.t*1.4+i*.83;
    const spread=Math.sin(i*7.13)*18;
    const px=X+spread+Math.sin(phase+i)*13;
    const py=y+Math.cos(phase*.9+i)*16+(i%3)*7;
    const alpha=.18+.42*(.5+.5*Math.sin(phase*1.7));
    ctx.globalAlpha=alpha;
    ctx.fillStyle=i%3===0?'#fff0a5':'#a9e6c6';
    ctx.shadowBlur=10;
    ctx.shadowColor=ctx.fillStyle;
    ctx.beginPath();ctx.arc(px,py,1.4+(i%2)*.7,0,Math.PI*2);ctx.fill();
  }
  ctx.restore();
}
