/* FireFly 5 — economia, pedidos e loja evolutiva */
export const ECONOMY_ITEMS={
 wood:{name:'Madeira Viva',icon:'🪵',sell:3},fiber:{name:'Fibra Lunar',icon:'🌿',sell:4},crystal:{name:'Cristal Ecoante',icon:'💎',sell:11},mushroom:{name:'Cogumelo Luminoso',icon:'🍄',sell:7},ore:{name:'Minério Bruto',icon:'⛏',sell:8},
 frog:{name:'Sapo-musgo',icon:'🐸',sell:10},butterfly:{name:'Borboleta-aurora',icon:'🦋',sell:12},lizard:{name:'Lagartixa-folha',icon:'🦎',sell:18},spider:{name:'Aranha-das-rochas',icon:'🕷',sell:22},firefly:{name:'Vagalume-dourado',icon:'✦',sell:16},rare:{name:'Vagalume-lilás',icon:'✧',sell:65},bat:{name:'Morcego-de-veludo',icon:'🦇',sell:29},mouse:{name:'Rato-pedra',icon:'🐭',sell:14},cavefly:{name:'Vagalume-de-cristal',icon:'◆',sell:52},otter:{name:'Lontra-cintilante',icon:'🦦',sell:34},deer:{name:'Cervo-musgo',icon:'🦌',sell:39},owl:{name:'Coruja-azul',icon:'🦉',sell:45},crystalbug:{name:'Besouro-cristal',icon:'🪲',sell:28},glowmoth:{name:'Mariposa-luz',icon:'✧',sell:48}
};
export const SHOP_TIERS=[
 {level:1,name:'Banca de Madeira',unlock:'Inicial',discount:0,items:[['bait','Isca simples',10],['reinforcedNet','Rede reforçada',75],['lantern','Lanterna',100]]},
 {level:2,name:'Loja da Praça',unlock:'Reputação 25',discount:.05,items:[['explorationKit','Kit de exploração',150],['luckyCharm','Amuleto do Vagalume',300]]},
 {level:3,name:'Mercado Lumina',unlock:'Reputação 80',discount:.08,items:[['masterNet','Rede Prismática',420],['bait','Isca premium',18],['reinforcedNet','Rede reforçada',68]]},
 {level:4,name:'Casa dos Naturalistas',unlock:'Reputação 180',discount:.12,items:[['luckyCharm','Amuleto do Vagalume',270],['lantern','Lanterna reserva',85],['explorationKit','Kit de exploração',135]]}
];
export const ORDERS=[
 {id:'maya_fiber',giver:'maya',title:'Cesta de fibras',text:'A loja está sem material para reposição. Preciso de fibras frescas.',kind:'resource',target:'fiber',required:8,reward:65,xp:30,rep:12},
 {id:'luna_moths',giver:'luna',title:'Luzes para a estufa',text:'Traga mariposas-luz. Quero estudar como elas polinizam sem sol.',kind:'catch',target:'glowmoth',required:2,reward:110,xp:55,rep:20},
 {id:'theo_ore',giver:'theo',title:'Metal para a forja',text:'Minério bom. Sem isso minhas ferramentas não saem daqui.',kind:'resource',target:'ore',required:7,reward:78,xp:38,rep:14},
 {id:'nico_frogs',giver:'nico',title:'Iscas da lagoa',text:'Preciso de sapos-musgo para mapear os pontos mais úmidos.',kind:'catch',target:'frog',required:3,reward:58,xp:28,rep:10},
 {id:'tito_crystal',giver:'tito',title:'Amostras cristalinas',text:'Dois vagalumes de cristal e a pesquisa avança uma semana.',kind:'catch',target:'cavefly',required:2,reward:145,xp:70,rep:25}
];
export function shopTierFor(rep=0){return rep>=180?4:rep>=80?3:rep>=25?2:1;}
