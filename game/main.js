/* =========================================================
   FIREFLY — GAMEPLAY 3.0
   ========================================================= */
'use strict';
import { canvas, ui } from './core/dom.js';
import { keys } from './core/input.js';
import { state } from './core/state.js';
import { saveGame } from './systems/save.js';
import { AudioManager } from './systems/audio.js';
import { notify } from './render/notify.js';
import { closeDialog } from './render/dialog.js';
import { panel } from './render/panel.js';
import { update } from './core/update.js';
import { render } from './render/world.js';
import { buildMap, handleWorldInteraction } from './world/maps.js';
import { handleSpaceKey } from './systems/fishing.js';
import { ensureProgression } from './systems/progression.js';

let lastTime=0;
function loop(now){const dt=Math.min(.033,(now-lastTime)/1000||0);lastTime=now;update(dt);render();requestAnimationFrame(loop);}
addEventListener('keydown',(event)=>{
  AudioManager.unlock();keys.add(event.key);
  if([' ','ArrowLeft','ArrowRight'].includes(event.key))event.preventDefault();
  if(event.key===' ')handleSpaceKey();
  if(event.key==='e'||event.key==='E'){
    if(ui.dialog&&!ui.dialog.classList.contains('hidden'))return;
    handleWorldInteraction();
  }
  if(event.key==='i'||event.key==='I')panel('bag');
  if(event.key==='b'||event.key==='B')panel('book');
  if(event.key==='m'||event.key==='M')panel('quest');
  if(event.key==='p'||event.key==='P')panel('progress');
  if(event.key==='n'||event.key==='N'){state.clock=(state.clock+.5)%1;notify('O tempo avançou.');}
  if(event.key==='Escape'){closeDialog();if(ui.panel)ui.panel.classList.add('hidden');}
});
addEventListener('keyup',(event)=>keys.delete(event.key));
document.querySelectorAll('[data-panel]').forEach(button=>{button.onclick=()=>panel(button.dataset.panel);});
if(ui.mute)ui.mute.onclick=()=>{AudioManager.unlock();AudioManager.toggle();};
canvas.onclick=()=>{canvas.focus();AudioManager.unlock();};
ensureProgression();buildMap();saveGame();AudioManager.playMusic(state.map);AudioManager.playAmbient(state.map);requestAnimationFrame(loop);
