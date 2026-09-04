/* FireFly 4.0 — mapa vivo, landmarks e segredos */
import {state,addParticles} from '../core/state.js';
import {save,saveGame} from './save.js';
import {REGION_DATA,LANDMARKS,SECRETS} from '../data/world-4-data.js';
import {weatherType} from './weather.js';
import {notify} from '../render/notify.js';
export function mapProgress(map=state.map){const max=map==='forest'?5200:map==='cave'?3600:map==='village'?1900:1280;return Math.min(100,Math.round((save.world.explored[map]||0)/max*100));}
export function currentRegion(){const list=REGION_DATA[state.map]||[];return list.find(r=>state.player.x>=r.from&&state.player.x<r.to)||list[list.length-1];}
export function discoverLandmark(id){if(save.world.landmarks[id])return false;const l=LANDMARKS.find(v=>v.id===id);if(!l)return false;save.world.landmarks[id]=true;save.world.discoveries++;save.coins+=(l.reward||0);save.progression.xp+=Math.max(10,l.reward||10);addParticles(l.x,470,'#ffe58a',18);saveGame();notify(`Descoberta: ${l.name} · +${l.reward||0}✦`);return true;}
export function discoverSecret(id){if(save.world.secrets[id])return false;const s=SECRETS.find(v=>v.id===id);if(!s)return false;save.world.secrets[id]=true;save.world.discoveries++;save.coins+=(s.reward||0);save.progression.xp+=s.reward||10;addParticles(s.x,475,'#d7a4ff',24);saveGame();notify(`Segredo encontrado: ${s.name} · +${s.reward||0}✦`);return true;}
function conditionOK(item){if(!item.condition)return true;if(item.condition==='night')return !state.clock||!(state.clock>.22&&state.clock<.78);if(item.condition==='rain')return weatherType()==='rain';if(item.condition==='lantern')return !!save.inventory.lantern;if(item.condition==='explore')return mapProgress(item.map)>=8;return true;}
export function updateExploration(){const map=state.map;if(!['forest','cave'].includes(map))return;const current=Math.max(save.world.explored[map]||0,state.player.x);save.world.explored[map]=Math.min(map==='forest'?5200:3600,current);for(const l of LANDMARKS){if(l.map===map&&Math.abs(l.x-state.player.x)<70&&conditionOK(l))discoverLandmark(l.id);}for(const s of SECRETS){if(s.map===map&&Math.abs(s.x-state.player.x)<55){const ok=!s.requires||(s.requires==='night'?! (state.clock>.22&&state.clock<.78):!!save.inventory[s.requires]);if(ok)discoverSecret(s.id);else if(!save.world.hints[s.id]){save.world.hints[s.id]=true;notify(s.hint);}}}}
export function landmarkStatus(map=state.map){return LANDMARKS.filter(l=>l.map===map).map(l=>({...l,discovered:!!save.world.landmarks[l.id]}));}
export function secretStatus(map=state.map){return SECRETS.filter(s=>s.map===map).map(s=>({...s,discovered:!!save.world.secrets[s.id]}));}
