/* FireFly 7 — save, defaults e migrações */
import {ui} from '../core/dom.js';

export const CURRENT_SAVE_VERSION=8;
export const DEFAULT_DATA={version:CURRENT_SAVE_VERSION,coins:25,map:'lobby',inventory:{bait:0,reinforcedNet:0,lantern:0,explorationKit:0,luckyCharm:0,masterNet:0},catches:{},discovered:{},captureBook:{},quests:{tito_frogs:{status:'available',progress:0}},progression:{xp:0,level:1,resources:{},crafted:{},upgrades:{},stats:{gathered:0,crafted:0,steps:0,events:0,captures:0,variants:0}},economy:{reputation:0,totalSold:0,totalEarned:0,shopTier:1,orders:{},salesLog:[]},world:{weather:'sunny',explored:{forest:0,cave:0},landmarks:{},secrets:{},hints:{},discoveries:0,eventFlags:{}},audioEnabled:true};

export function cloneDefaultData(){return JSON.parse(JSON.stringify(DEFAULT_DATA));}
function mergeObject(base,value){return {...base,...(value&&typeof value==='object'&&!Array.isArray(value)?value:{})};}

function migrateV1ToV2(data){
  if(data.map==='village')data.map='lobby';
  data.inventory=mergeObject(DEFAULT_DATA.inventory,data.inventory);
  return data;
}
function migrateV2ToV3(data){
  data.progression=mergeObject(DEFAULT_DATA.progression,data.progression);
  data.progression.resources=mergeObject(DEFAULT_DATA.progression.resources,data.progression.resources);
  data.progression.crafted=mergeObject(DEFAULT_DATA.progression.crafted,data.progression.crafted);
  data.progression.upgrades=mergeObject(DEFAULT_DATA.progression.upgrades,data.progression.upgrades);
  return data;
}
function migrateV3ToV4(data){
  data.captureBook=mergeObject({},data.captureBook);
  data.world=mergeObject(DEFAULT_DATA.world,data.world);
  data.world.explored=mergeObject(DEFAULT_DATA.world.explored,data.world.explored);
  return data;
}
function migrateV4ToV5(data){
  data.economy=mergeObject(DEFAULT_DATA.economy,data.economy);
  data.economy.orders=mergeObject({},data.economy.orders);
  data.economy.salesLog=Array.isArray(data.economy.salesLog)?data.economy.salesLog:[];
  return data;
}
function migrateV5ToV6(data){
  data.progression.stats=mergeObject(DEFAULT_DATA.progression.stats,data.progression?.stats);
  data.quests=mergeObject(DEFAULT_DATA.quests,data.quests);
  return data;
}
function migrateV6ToV7(data){
  data.world=mergeObject(DEFAULT_DATA.world,data.world);
  data.world.landmarks=mergeObject({},data.world.landmarks);
  data.world.secrets=mergeObject({},data.world.secrets);
  data.world.hints=mergeObject({},data.world.hints);
  return data;
}
function migrateV7ToV8(data){
  data.world=mergeObject(DEFAULT_DATA.world,data.world);
  data.world.eventFlags=mergeObject({},data.world.eventFlags);
  return data;
}

export function migrateSave(raw){
  let data=raw&&typeof raw==='object'&&!Array.isArray(raw)?JSON.parse(JSON.stringify(raw)):cloneDefaultData();
  let version=Number.isFinite(data.version)?data.version:1;
  if(version<1)version=1;
  const migrations={1:migrateV1ToV2,2:migrateV2ToV3,3:migrateV3ToV4,4:migrateV4ToV5,5:migrateV5ToV6,6:migrateV6ToV7,7:migrateV7ToV8};
  while(version<CURRENT_SAVE_VERSION){
    const migrate=migrations[version];
    if(migrate)data=migrate(data);
    version++;
    data.version=version;
  }
  const base=cloneDefaultData();
  const normalized={...base,...data,version:CURRENT_SAVE_VERSION,map:data.map==='village'?'lobby':(data.map||base.map),inventory:mergeObject(base.inventory,data.inventory),catches:mergeObject(base.catches,data.catches),discovered:mergeObject(base.discovered,data.discovered),captureBook:mergeObject(base.captureBook,data.captureBook),quests:mergeObject(base.quests,data.quests),progression:mergeObject(base.progression,data.progression),economy:mergeObject(base.economy,data.economy),world:mergeObject(base.world,data.world)};
  normalized.progression.resources=mergeObject(base.progression.resources,data.progression?.resources);
  normalized.progression.crafted=mergeObject(base.progression.crafted,data.progression?.crafted);
  normalized.progression.upgrades=mergeObject(base.progression.upgrades,data.progression?.upgrades);
  normalized.progression.stats=mergeObject(base.progression.stats,data.progression?.stats);
  normalized.economy.orders=mergeObject(base.economy.orders,data.economy?.orders);
  normalized.economy.salesLog=Array.isArray(data.economy?.salesLog)?[...data.economy.salesLog]:[];
  normalized.world.explored=mergeObject(base.world.explored,data.world?.explored);
  normalized.world.landmarks=mergeObject({},data.world?.landmarks);
  normalized.world.secrets=mergeObject({},data.world?.secrets);
  normalized.world.hints=mergeObject({},data.world?.hints);
  normalized.world.eventFlags=mergeObject({},data.world?.eventFlags);
  normalized.progression.xp=Math.max(0,Number(normalized.progression.xp)||0);
  normalized.progression.level=Math.max(1,Number(normalized.progression.level)||1);
  return normalized;
}

export function loadGame(){
  try{
    const raw=localStorage.getItem('firefly-save');
    if(!raw)return cloneDefaultData();
    return migrateSave(JSON.parse(raw));
  }catch(error){
    console.warn('FireFly: save inválido; iniciando um save limpo.',error);
    return cloneDefaultData();
  }
}

export const save=loadGame();
export function saveGame(){
  try{localStorage.setItem('firefly-save',JSON.stringify(save));}
  catch(error){console.warn('FireFly: não foi possível salvar.',error);}
  if(ui.coins)ui.coins.textContent=save.coins;
}
