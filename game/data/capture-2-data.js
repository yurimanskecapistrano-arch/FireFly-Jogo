/* FireFly 4.1 — Captura 2.0 data */
export const NETS={
  basic:{name:'Rede de Fios',key:'basic',cost:0,range:105,power:1.0,window:1.0,description:'Leve e simples. Boa para criaturas calmas.'},
  reinforced:{name:'Rede Reforçada',key:'reinforcedNet',cost:75,range:118,power:1.28,window:1.25,description:'Malha mais firme para criaturas rápidas e incomuns.'},
  prism:{name:'Rede Prismática',key:'masterNet',cost:180,range:132,power:1.6,window:1.55,description:'Captura precisa. Ideal para raridades e variantes.'},
  lunar:{name:'Rede Lunar',key:'luckyCharm',cost:300,range:142,power:1.82,window:1.8,description:'Uma rede especial que reage a criaturas noturnas.'}
};
export const CAPTURE_EQUIPMENT={bait:{name:'Isca simples',effect:'fish'},lantern:{name:'Lanterna',effect:'cave'},explorationKit:{name:'Kit de exploração',effect:'terrain'},luckyCharm:{name:'Amuleto do Vagalume',effect:'rare'}};
export const SPECIES_2={
 butterfly:{name:'Borboleta-aurora',habitat:'Clareira das Flores',maps:['forest'],regions:['flower','entrance'],time:'day',weather:['sunny','cloudy'],behavior:'flores',rarity:'comum',baseDifficulty:1.0,value:14,variants:['rose','golden']},
 frog:{name:'Sapo-musgo',habitat:'Lagoa Cintilante',maps:['forest'],regions:['lagoon'],time:'both',weather:['sunny','rain'],behavior:'agua',rarity:'comum',baseDifficulty:1.05,value:12,variants:['moss','blue']},
 lizard:{name:'Lagartixa-folha',habitat:'Trilha Antiga',maps:['forest'],regions:['oldTrail'],time:'day',weather:['sunny','cloudy'],behavior:'pedra',rarity:'incomum',baseDifficulty:1.55,value:22,variants:['leaf','ember']},
 spider:{name:'Aranha-das-rochas',habitat:'Pedreira Abandonada',maps:['forest','cave'],regions:['quarry','echo'],time:'night',weather:['fog','rain','cloudy'],behavior:'teia',rarity:'incomum',baseDifficulty:1.4,value:28,variants:['stone','silver']},
 firefly:{name:'Vagalume-dourado',habitat:'Floresta noturna',maps:['forest'],regions:['flower','lagoon','oldTrail','highGrove'],time:'night',weather:['sunny','rain','fog'],behavior:'enxame',rarity:'comum',baseDifficulty:1.1,value:20,variants:['gold','green']},
 rare:{name:'Vagalume-lilás',habitat:'Bosque Alto',maps:['forest'],regions:['highGrove'],time:'night',weather:['rain','fog'],behavior:'raro',rarity:'raro',baseDifficulty:2.2,value:90,variants:['lilac','aurora']},
 bat:{name:'Morcego-de-veludo',habitat:'Caverna Ecoante',maps:['cave'],regions:['mouth','echo','deep'],time:'night',weather:['fog'],behavior:'teto',rarity:'incomum',baseDifficulty:1.45,value:36,variants:['velvet','pale']},
 mouse:{name:'Rato-pedra',habitat:'Túneis Profundos',maps:['cave'],regions:['echo','deep'],time:'both',weather:['fog','rain'],behavior:'toca',rarity:'comum',baseDifficulty:1.25,value:18,variants:['stone','white']},
 cavefly:{name:'Vagalume-de-cristal',habitat:'Salão de Cristal',maps:['cave'],regions:['crystal','deep'],time:'both',weather:['fog'],behavior:'cristal',rarity:'raro',baseDifficulty:1.65,value:75,variants:['crystal','violet']},
 otter:{name:'Lontra-cintilante',habitat:'Lagoa Cintilante',maps:['forest'],regions:['lagoon'],time:'both',weather:['rain','sunny'],behavior:'mergulho',rarity:'incomum',baseDifficulty:1.7,value:42,variants:['river','moon']},
 deer:{name:'Cervo-musgo',habitat:'Bosque Alto',maps:['forest'],regions:['highGrove','oldTrail'],time:'day',weather:['sunny','fog'],behavior:'bando',rarity:'incomum',baseDifficulty:1.85,value:48,variants:['moss','white']},
 owl:{name:'Coruja-azul',habitat:'Bosque Alto',maps:['forest'],regions:['highGrove','quarry'],time:'night',weather:['fog','rain'],behavior:'predador',rarity:'incomum',baseDifficulty:1.9,value:55,variants:['blue','moon']},
 crystalbug:{name:'Besouro-cristal',habitat:'Salão de Cristal',maps:['cave'],regions:['crystal'],time:'both',weather:['fog'],behavior:'cristal',rarity:'incomum',baseDifficulty:1.5,value:34,variants:['cyan','amber']},
 glowmoth:{name:'Mariposa-luz',habitat:'Galeria dos Ecos',maps:['cave'],regions:['echo','crystal'],time:'night',weather:['fog'],behavior:'enxame',rarity:'raro',baseDifficulty:2.0,value:70,variants:['violet','pearl']}
};
export const VARIANTS={
 rose:{name:'Rosada',multiplier:1.15},golden:{name:'Dourada',multiplier:1.45},moss:{name:'Musgo',multiplier:1.1},blue:{name:'Azul-lagoa',multiplier:1.35},leaf:{name:'Folha',multiplier:1.15},ember:{name:'Brasa',multiplier:1.5},stone:{name:'Pedra',multiplier:1.1},silver:{name:'Prateada',multiplier:1.4},gold:{name:'Dourado',multiplier:1.2},green:{name:'Verde',multiplier:1.25},lilac:{name:'Lilás',multiplier:1.5},aurora:{name:'Aurora',multiplier:1.8},velvet:{name:'Veludo',multiplier:1.2},pale:{name:'Pálido',multiplier:1.4},white:{name:'Branco',multiplier:1.5},crystal:{name:'Cristal',multiplier:1.45},violet:{name:'Violeta',multiplier:1.65},river:{name:'Rio',multiplier:1.25},moon:{name:'Lua',multiplier:1.75},cyan:{name:'Ciano',multiplier:1.25},amber:{name:'Âmbar',multiplier:1.5},pearl:{name:'Pérola',multiplier:1.7}
};
export const REGION_SPAWNS={
 entrance:['butterfly','firefly'],flower:['butterfly','firefly'],lagoon:['frog','otter','firefly'],oldTrail:['lizard','deer','spider'],quarry:['lizard','spider','owl'],highGrove:['deer','owl','firefly','rare'],mouth:['bat','spider'],echo:['bat','mouse','spider','glowmoth'],crystal:['cavefly','crystalbug','glowmoth'],deep:['mouse','bat','cavefly','crystalbug','glowmoth']
};