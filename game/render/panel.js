/* =========================================================
   PAINÉIS 2.0 — mochila, bestiário e diário de missões
   ========================================================= */
import { ui } from '../core/dom.js';
import { save } from '../systems/save.js';
import { names, rarity, itemNames, QUESTS, speciesInfo } from '../data/game-data.js';
import { quest } from '../systems/quests.js';

export function panel(kind){
  if(!ui.panel)return;let body='';
  if(kind==='bag'){
    const entries=[...Object.entries(save.inventory),...Object.entries(save.catches)].filter(([,a])=>a>0);
    body=entries.length?entries.map(([id,amount])=>{const n=names[id]||itemNames[id]||id;return `<div class="card"><div><b>${n}</b><small>Quantidade: ${amount}</small></div></div>`;}).join(''):'<p>A mochila está vazia. Vá explorar.</p>';
    ui.panel.innerHTML=`<button class="close">×</button><h2 class="panel-title">Mochila</h2><p class="panel-sub">Equipamentos, iscas e criaturas guardadas.</p>${body}`;
  }
  if(kind==='book'){
    body=Object.keys(names).map(id=>{const d=!!save.discovered[id],info=speciesInfo[id]||{};return `<div class="card"><div><b>${d?names[id]:'???'}</b><small>${d?`${rarity[id]} · ${info.habitat||'desconhecido'}`:'continue explorando'}</small>${d?`<small>${info.time||''} · ${info.description||''}</small><small>Valor estimado: ${info.value||0} ✦</small>`:''}</div></div>`;}).join('');
    const total=Object.keys(names).length,discovered=Object.keys(names).filter(id=>save.discovered[id]).length;
    ui.panel.innerHTML=`<button class="close">×</button><h2 class="panel-title">Bestiário</h2><p class="panel-sub">Descobertas: ${discovered}/${total} · cada encontro ensina algo.</p>${body}`;
  }
  if(kind==='quest'){
    const current=quest();const quests=Object.values(QUESTS);body=quests.map(q=>{const saved=save.quests[q.id]||{status:'available',progress:0};const p=Math.min(q.required,saved.progress||0);const status=saved.status==='claimed'?'Concluída':saved.status==='complete'?'Volte para '+q.giver:saved.status==='active'?`${p}/${q.required}`:'Disponível';return `<div class="card"><div><b>${q.title}</b><small>${status}</small><div class="bar"><i style="width:${Math.round(p/q.required*100)}%"></i></div><small>Recompensa: ${q.reward.coins} moedas</small></div></div>`;}).join('');
    ui.panel.innerHTML=`<button class="close">×</button><h2 class="panel-title">Diário de missões</h2><p class="panel-sub">${current.title||'Explore o mundo e converse com os moradores.'}</p>${body}`;
  }
  ui.panel.classList.remove('hidden');const close=ui.panel.querySelector('.close');if(close)close.onclick=()=>ui.panel.classList.add('hidden');
}
