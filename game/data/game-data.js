/* =========================================================
   FIRE FLY DATA 2.0 — espécies, itens, progressão e economia
   ========================================================= */

export const names = {
  butterfly: 'Borboleta-aurora', frog: 'Sapo-musgo', lizard: 'Lagartixa-folha',
  spider: 'Aranha-das-rochas', firefly: 'Vagalume-dourado', rare: 'Vagalume-lilás',
  bat: 'Morcego-de-veludo', mouse: 'Rato-pedra', cavefly: 'Vagalume-de-cristal',
  moonfish: 'Peixe-lua', stripefish: 'Peixe-listrado'
};

export const rarity = {
  butterfly: 'comum', frog: 'comum', lizard: 'incomum', spider: 'incomum', firefly: 'comum',
  rare: 'raro', bat: 'incomum', mouse: 'comum', cavefly: 'raro', moonfish: 'comum', stripefish: 'incomum'
};

export const speciesInfo = {
  butterfly: { habitat:'Clareira das Flores', time:'Dia', description:'Pequena viajante das flores. Pousa quando se sente segura.', value:14 },
  frog: { habitat:'Lagoa Cintilante', time:'Dia e noite', description:'Vive entre a água e a vegetação úmida. Fica mais ativa à noite.', value:12 },
  lizard: { habitat:'Trilha Antiga', time:'Dia', description:'Toma sol sobre pedras e dispara para a sombra quando percebe perigo.', value:22 },
  spider: { habitat:'Pedreira', time:'Noite', description:'Constrói pequenas teias e prefere cantos quietos e escuros.', value:28 },
  firefly: { habitat:'Toda a floresta', time:'Noite', description:'Só aparece quando a floresta escurece. Costuma viajar em pequenos grupos.', value:20 },
  rare: { habitat:'Bosque Alto', time:'Noite', description:'Um vagalume extremamente raro, atraído por lugares silenciosos.', value:90 },
  bat: { habitat:'Caverna Ecoante', time:'Noite', description:'Dormem pendurados no teto e acordam quando o ambiente muda.', value:36 },
  mouse: { habitat:'Caverna Ecoante', time:'Qualquer', description:'Pequenos roedores que atravessam túneis em rápidos disparos.', value:18 },
  cavefly: { habitat:'Caverna Ecoante', time:'Qualquer', description:'Vagalume subterrâneo que ilumina cristais e paredes úmidas.', value:75 }
};

export const itemNames = {
  bait:'Isca simples', reinforcedNet:'Rede reforçada', lantern:'Lanterna', explorationKit:'Kit de exploração'
};

export const SHOP = [
  ['bait','Isca simples','Atrai peixes por mais tempo durante a pesca.',10],
  ['reinforcedNet','Rede reforçada','Aumenta a janela de captura de criaturas difíceis.',75],
  ['lantern','Lanterna','Amplia muito sua visão nas cavernas.',100],
  ['explorationKit','Kit de exploração','Melhora a exploração e abre espaço para sistemas futuros.',150]
];

export const QUESTS = {
  tito_frogs:{id:'tito_frogs',giver:'tito',title:'Um coro para a lagoa',target:'frog',required:3,reward:{coins:50,items:{bait:1}}},
  tito_night:{id:'tito_night',giver:'tito',title:'Luzes na mata',target:'firefly',required:5,reward:{coins:90,items:{lantern:1}}},
  tito_cave:{id:'tito_cave',giver:'tito',title:'Ecos de cristal',target:'cavefly',required:2,reward:{coins:140,items:{explorationKit:1}}}
};

export const SPECIES = {
  butterfly:{habitat:'flower',fleeDistance:105,fleeSpeed:185,wanderSpeed:42,catchDifficulty:1,landsOnFlowers:true},
  frog:{habitat:'water',fleeDistance:125,fleeSpeed:150,wanderSpeed:25,catchDifficulty:1,nightBoost:true,jumps:true},
  lizard:{habitat:'rock',fleeDistance:155,fleeSpeed:250,wanderSpeed:15,catchDifficulty:1.65,camouflage:true},
  spider:{habitat:'web',fleeDistance:105,fleeSpeed:90,wanderSpeed:10,catchDifficulty:1.3,mostlyStill:true},
  firefly:{habitat:'air',nightOnly:true,fleeDistance:70,fleeSpeed:55,wanderSpeed:25,catchDifficulty:1,swarm:true},
  rare:{habitat:'air',nightOnly:true,fleeDistance:220,fleeSpeed:175,wanderSpeed:31,catchDifficulty:2.2,swarm:true,rare:true},
  bat:{habitat:'ceiling',caveOnly:true,fleeDistance:145,fleeSpeed:210,wanderSpeed:0,catchDifficulty:1.4,sleeper:true},
  mouse:{habitat:'ground',caveOnly:true,fleeDistance:100,fleeSpeed:205,wanderSpeed:32,catchDifficulty:1.2},
  cavefly:{habitat:'air',caveOnly:true,fleeDistance:90,fleeSpeed:72,wanderSpeed:24,catchDifficulty:1.5,swarm:true,rare:true}
};
