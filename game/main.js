/* =========================================================
   FIREFLY — GAMEPLAY 3.1
   ========================================================= */
'use strict';
import {canvas,ui} from './core/dom.js';import {keys} from './core/input.js';import {state} from './core/state.js';import {saveGame} from './systems/save.js';import {AudioManager} from './systems/audio.js';import {notify} from './render/notify.js';import {closeDialog} from './render/dialog.js';import {panel} from './render/panel.js';import {update} from './core/update.js';import {render} from './render/world.js';import {buildMap,handleWorldInteraction} from './world/maps.js';import {handleSpaceKey} from './systems/fishing.js';import {ensureProgression} from './systems/progression.js';
let lastTime=0;
let reportedError=false;
function showRuntimeError(phase,error){
  if(reportedError)return;
  reportedError=true;
  console.error(`FireFly ${phase} error:`,error);
  const message=error instanceof Error?`${error.name}: ${error.message}`:String(error);
  const box=document.createElement('div');
  box.style.cssText='position:absolute;left:18px;right:18px;top:120px;z-index:20;padding:16px 18px;border:2px solid #ff9b7a;border-radius:12px;background:#241c22ee;color:#fff4da;font:700 13px/1.5 system-ui;pointer-events:none;white-space:pre-wrap;';
  box.textContent=`FIREFLY PAROU NA INICIALIZAÇÃO (${phase})\n${message}\n\nO erro foi capturado para não deixar a tela preta.`;
  document.getElementById('gameShell')?.appendChild(box);
}
function loop(now){const dt=Math.min(.033,(now-lastTime)/1000||0);lastTime=now;try{update(dt);}catch(error){showRuntimeError('UPDATE',error);return;}try{render();}catch(error){showRuntimeError('RENDER',error);return;}requestAnimationFrame(loop);}
addEventListener('error',event=>showRuntimeError('GLOBAL',event.error||event.message));
addEventListener('unhandledrejection',event=>showRuntimeError('PROMISE',event.reason));
addEventListener('keydown',event=>{AudioManager.unlock();keys.add(event.key);if([' ','ArrowLeft','ArrowRight'].includes(event.key))event.preventDefault();if(event.key===' ')handleSpaceKey();if(event.key==='e'||event.key==='E'){if(ui.dialog&&!ui.dialog.classList.contains('hidden'))return;handleWorldInteraction();}if(event.key==='i'||event.key==='I')panel('bag');if(event.key==='b'||event.key==='B')panel('book');if(event.key==='m'||event.key==='M')panel('quest');if(event.key==='p'||event.key==='P')panel('progress');if(event.key==='n'||event.key==='N'){state.clock=(state.clock+.125)%1;notify('O tempo avançou 3 horas.');saveGame();}});
addEventListener('keyup',event=>keys.delete(event.key));document.querySelectorAll('[data-panel]').forEach(button=>{button.onclick=()=>panel(button.dataset.panel);});if(ui.mute)ui.mute.onclick=()=>{AudioManager.unlock();AudioManager.toggle();};canvas.onclick=()=>{canvas.focus();AudioManager.unlock();};
try{ensureProgression();buildMap();saveGame();AudioManager.playMusic(state.map);AudioManager.playAmbient(state.map);}catch(error){showRuntimeError('BOOT',error);}
requestAnimationFrame(loop);
