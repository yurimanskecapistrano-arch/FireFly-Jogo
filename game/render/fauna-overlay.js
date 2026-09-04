/* FireFly 4.1 — fauna visual overlay */
import {ctx} from '../core/dom.js';
import {state} from '../core/state.js';
import {wx} from './draw-helpers.js';
import {drawRegionalWildlife} from '../systems/capture-2-world.js';

const TAU=Math.PI*2;
function caveGlow(x,y,r,color,alpha=.35){const g=ctx.createRadialGradient(x,y,4,x,y,r);g.addColorStop(0,color);g.addColorStop(1,'rgba(0,0,0,0)');ctx.globalAlpha=alpha;ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();ctx.globalAlpha=1;}
function drawCaveFaunaLight(){if(state.map!=='cave')return;const px=wx(state.player.x),py=state.player.y-20;caveGlow(px,py,190,'#8bd8c8',.18);for(let i=0;i<7;i++){const x=wx((i*487+260)%3500);if(x<-120||x>ctx.canvas.width+120)continue;caveGlow(x,500+(i%3)*28,55,i%2?'#62d9d0':'#b895ff',.16);}ctx.save();const vignette=ctx.createRadialGradient(px,py,90,px,py,520);vignette.addColorStop(0,'rgba(0,0,0,0)');vignette.addColorStop(1,'rgba(4,12,18,.48)');ctx.fillStyle=vignette;ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);ctx.restore();}
export function renderFaunaOverlay(){if(state.map==='cave')drawCaveFaunaLight();for(const e of state.entities){if(e.capture2&&e.alive&&e.visible)drawRegionalWildlife(e,ctx,state.t);}}
