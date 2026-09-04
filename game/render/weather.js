/* Atmosfera FireFly 4.0 */
import {ctx} from '../core/dom.js';
import {state} from '../core/state.js';
import {W,H} from '../core/constants.js';
import {weatherType} from '../systems/weather.js';
export function drawWeather(){if(!['forest','cave'].includes(state.map))return;const w=weatherType();if(w==='rain'){ctx.save();ctx.globalAlpha=.28;ctx.strokeStyle='#b9d7e4';ctx.lineWidth=1;for(let i=0;i<85;i++){const x=(i*97+state.t*210)%W,y=(i*53+state.t*330)%(H+40)-20;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-5,y+14);ctx.stroke();}ctx.restore();}else if(w==='fog'){ctx.save();ctx.fillStyle='#dbe7df';ctx.globalAlpha=.10;ctx.fillRect(0,330,W,250);for(let i=0;i<8;i++){ctx.globalAlpha=.025;ctx.beginPath();ctx.ellipse((i*190+state.t*12)%W,470+(i%3)*38,180,38,0,0,Math.PI*2);ctx.fill();}ctx.restore();}else if(w==='cloudy'){ctx.save();ctx.fillStyle='#53686a';ctx.globalAlpha=.10;ctx.fillRect(0,0,W,425);ctx.restore();}}
