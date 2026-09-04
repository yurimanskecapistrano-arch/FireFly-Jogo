import assert from 'node:assert/strict';

const context = { console, setTimeout, clearTimeout, Math, JSON, localStorage: { data: {}, getItem(key){return this.data[key] ?? null;}, setItem(key,value){this.data[key]=String(value);}, removeItem(key){delete this.data[key];} }, requestAnimationFrame(){}, addEventListener(){}, document: null };

class FakeGradient { addColorStop() {} }
class FakeContext { save(){} restore(){} translate(){} scale(){} rotate(){} beginPath(){} closePath(){} moveTo(){} lineTo(){} quadraticCurveTo(){} arc(){} ellipse(){} fill(){} stroke(){} fillRect(){} strokeRect(){} clearRect(){} roundRect(){} createLinearGradient(){return new FakeGradient();} createRadialGradient(){return new FakeGradient();} fillText(){} set globalAlpha(v){} }

function makeElement(){ return { classList:{ add(){}, remove(){}, contains(){return false;} }, textContent:'', innerHTML:'', dataset:{}, querySelector(){return makeElement();}, querySelectorAll(){return [];}, onclick:null, focus(){}, }; }
const canvas=makeElement(); canvas.getContext=()=>new FakeContext();
context.document={ querySelector(selector){ if(selector==='#game') return canvas; return makeElement(); }, querySelectorAll(){return []; } };

const previous={...globalThis};
Object.assign(globalThis,context);

const moduleUrl = new URL('../game/main.js', import.meta.url);
await import(moduleUrl.href + '?smoke=' + Date.now());

const { state } = await import('../game/core/state.js');
const { save, saveGame } = await import('../game/systems/save.js');
const { buildMap } = await import('../game/world/maps.js');
const { update } = await import('../game/core/update.js');
const { startFishing, handleSpaceKey } = await import('../game/systems/fishing.js');
const { capture } = await import('../game/systems/capture.js');

for(let i=0;i<120;i++) update(1/60);
assert.equal(state.map,'village');
console.log('✔ 120 frames em VILA sem erros. map=',state.map);
state.map='forest'; buildMap();
for(let i=0;i<180;i++) update(1/60);
assert.equal(state.map,'forest'); console.log('✔ 180 frames em FLORESTA sem erros. entidades=',state.entities.length);
state.clock=0.5; for(const e of state.entities) if(e.type==='firefly') update(0,e); const firefly=state.entities.find(e=>e.type==='firefly'); console.log('firefly de dia -> visible =',firefly?.visible,'(esperado false)');
state.clock=0.9; for(let i=0;i<2;i++) update(1/60); console.log('firefly de noite -> visible =',firefly?.visible,'(esperado true)');
startFishing(); for(let i=0;i<100;i++) update(1/60); assert.equal(state.fishing?.stage,'bite'); console.log('✔ pesca chegou ao estágio: bite'); handleSpaceKey(); assert.equal(state.fishing?.stage,'reel'); console.log('✔ após fisgar, estágio = reel'); for(let i=0;i<180;i++) update(1/60); console.log('✔ pesca resolvida após 35 ticks. fishing=',state.fishing); state.map='cave'; buildMap(); for(let i=0;i<180;i++) update(1/60); assert.equal(state.map,'cave'); console.log('✔ 180 frames em CAVERNA sem erros. entidades=',state.entities.length); capture(); console.log('✔ capture() executado sem erro. vivos antes=6 depois=',state.entities.filter(e=>e.alive).length); save.map='cave'; saveGame(); assert.doesNotThrow(()=>JSON.parse(localStorage.getItem('firefly-save'))); console.log('✔ save gravado e é JSON válido. coins=',save.coins,'map=',save.map); console.log('\n✅ SMOKE TEST PASSOU — nenhuma exceção lançada em nenhum fluxo testado.');
