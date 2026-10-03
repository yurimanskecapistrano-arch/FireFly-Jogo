/* FireFly 7 — dados principais
   A fauna compartilhada agora tem uma única fonte canônica:
   capture-2-data.js / SPECIES_2. Os exports abaixo preservam a API
   dos sistemas antigos sem manter uma segunda definição de espécie.
*/
import {SPECIES_2} from './capture-2-data.js';

const legacyBehavior={
  butterfly:{habitat:'flower',fleeDistance:105,fleeSpeed:185,wanderSpeed:42,landsOnFlowers:true},
  frog:{habitat:'water',fleeDistance:125,fleeSpeed:150,wanderSpeed:25,nightBoost:true,jumps:true},
  lizard:{habitat:'rock',fleeDistance:155,fleeSpeed:250,wanderSpeed:15,camouflage:true},
  spider:{habitat:'web',fleeDistance:105,fleeSpeed:90,wanderSpeed:10,mostlyStill:true},
  firefly:{habitat:'air',nightOnly:true,fleeDistance:70,fleeSpeed:55,wanderSpeed:25,swarm:true},
  rare:{habitat:'air',nightOnly:true,fleeDistance:220,fleeSpeed:175,wanderSpeed:31,swarm:true,rare:true},
  bat:{habitat:'ceiling',caveOnly:true,fleeDistance:145,fleeSpeed:210,wanderSpeed:0,sleeper:true},
  mouse:{habitat:'ground',caveOnly:true,fleeDistance:100,fleeSpeed:205,wanderSpeed:32},
  cavefly:{habitat:'air',caveOnly:true,fleeDistance:90,fleeSpeed:72,wanderSpeed:24,swarm:true,rare:true},
  otter:{habitat:'water',fleeDistance:135,fleeSpeed:150,wanderSpeed:28},
  deer:{habitat:'ground',fleeDistance:170,fleeSpeed:190,wanderSpeed:30},
  owl:{habitat:'air',fleeDistance:150,fleeSpeed:180,wanderSpeed:22},
  crystalbug:{habitat:'ground',fleeDistance:105,fleeSpeed:100,wanderSpeed:18},
  glowmoth:{habitat:'air',fleeDistance:90,fleeSpeed:75,wanderSpeed:25,swarm:true,rare:true}
};

export const names=Object.fromEntries(Object.entries(SPECIES_2).map(([id,d])=>[id,d.name]));
Object.assign(names,{moonfish:'Peixe-lua',stripefish:'Peixe-listrado'});
export const rarity=Object.fromEntries(Object.entries(SPECIES_2).map(([id,d])=>[id,d.rarity]));
Object.assign(rarity,{moonfish:'comum',stripefish:'incomum'});
export const speciesInfo=Object.fromEntries(Object.entries(SPECIES_2).map(([id,d])=>[id,{habitat:d.habitat,time:d.time,description:d.behavior,value:d.value}]));
Object.assign(speciesInfo,{moonfish:{habitat:'Lagoa Cintilante',time:'Noite',description:'Peixe raro de águas calmas.',value:34},stripefish:{habitat:'Lagoa Cintilante',time:'Dia',description:'Peixe veloz de águas rasas.',value:26}});
export const itemNames={bait:'Isca simples',reinforcedNet:'Rede reforçada',lantern:'Lanterna',explorationKit:'Kit de exploração',luckyCharm:'Amuleto do Vagalume',masterNet:'Rede Prismática'};
export const SHOP=[['bait','Isca simples','Atrai peixes por mais tempo.',10],['reinforcedNet','Rede reforçada','Mais janela de captura.',75],['lantern','Lanterna','Ilumina a caverna.',100],['explorationKit','Kit de exploração','Melhora a exploração.',150]];
export const QUESTS={tito_frogs:{id:'tito_frogs',giver:'tito',title:'Um coro para a lagoa',target:'frog',kind:'catch',required:3,reward:{coins:50,items:{bait:1}}},tito_night:{id:'tito_night',giver:'tito',title:'Luzes na mata',target:'firefly',kind:'catch',required:5,reward:{coins:90,items:{lantern:1}}},tito_cave:{id:'tito_cave',giver:'tito',title:'Ecos de cristal',target:'cavefly',kind:'catch',required:2,reward:{coins:140,items:{explorationKit:1}}},luna_flowers:{id:'luna_flowers',giver:'luna',title:'Jardim vivo',target:'fiber',kind:'resource',required:7,reward:{coins:70,items:{bait:2}}},luna_moths:{id:'luna_moths',giver:'luna',title:'Asas de luz',target:'glowmoth',kind:'catch',required:2,reward:{coins:130,items:{luckyCharm:1}}},theo_ore:{id:'theo_ore',giver:'theo',title:'Forja em alta',target:'ore',kind:'resource',required:8,reward:{coins:90,items:{reinforcedNet:1}}},maya_sales:{id:'maya_sales',giver:'maya',title:'Mercado aquecido',target:'sell',required:5,reward:{coins:110,items:{bait:3}}},nico_fishing:{id:'nico_fishing',giver:'nico',title:'Segredos da lagoa',target:'frog',kind:'catch',required:4,reward:{coins:95,items:{bait:2}}}};

export const SPECIES=Object.fromEntries(Object.entries(SPECIES_2).map(([id,d])=>[id,{habitat:legacyBehavior[id]?.habitat||d.behavior,fleeDistance:legacyBehavior[id]?.fleeDistance??120,fleeSpeed:legacyBehavior[id]?.fleeSpeed??120,wanderSpeed:legacyBehavior[id]?.wanderSpeed??25,catchDifficulty:d.baseDifficulty,nightOnly:d.time==='night',caveOnly:d.maps.includes('cave')&&!d.maps.includes('forest'),rare:d.rarity==='raro',...legacyBehavior[id]}]));
