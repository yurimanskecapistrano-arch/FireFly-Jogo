/* FireFly 4.0 — world discovery data */
export const REGION_DATA={
 forest:[
  {id:'entrance',name:'Entrada da Floresta',from:0,to:620,hint:'O começo da trilha. Pequenas marcas indicam que há mais caminhos adiante.'},
  {id:'flower',name:'Clareira das Flores',from:620,to:1450,hint:'Um campo de flores onde borboletas e criaturas pequenas se concentram.'},
  {id:'lagoon',name:'Lagoa Cintilante',from:1450,to:2450,hint:'Água calma durante o dia; à noite, algo parece se mover sob a superfície.'},
  {id:'oldTrail',name:'Trilha Antiga',from:2450,to:3400,hint:'Restos de uma estrada desaparecem entre árvores antigas.'},
  {id:'quarry',name:'Pedreira Abandonada',from:3400,to:4200,hint:'Pedras cortadas e veios minerais revelam uma atividade esquecida.'},
  {id:'highGrove',name:'Bosque Alto',from:4200,to:5200,hint:'A floresta fica mais silenciosa. O caminho termina em um mirante natural.'}
 ],
 cave:[
  {id:'mouth',name:'Boca da Caverna',from:0,to:650,hint:'A luz do exterior ainda alcança as primeiras pedras.'},
  {id:'echo',name:'Galeria dos Ecos',from:650,to:1450,hint:'Cada passo retorna diferente. Há passagens entre as paredes.'},
  {id:'crystal',name:'Salão de Cristal',from:1450,to:2450,hint:'Cristais antigos parecem responder à presença de quem passa.'},
  {id:'deep',name:'Túneis Profundos',from:2450,to:3600,hint:'O ar muda. Alguns túneis parecem ter sido fechados de propósito.'}
 ]
};
export const LANDMARKS=[
 {id:'giant-tree',map:'forest',x:520,name:'Árvore dos Vagalumes',icon:'✦',lore:'Uma árvore colossal coberta de pequenas marcas luminosas. À noite, o tronco parece respirar.',reward:25,condition:'night'},
 {id:'old-tower',map:'forest',x:1120,name:'Torre de Observação',icon:'⌂',lore:'Uma torre abandonada com vista para a clareira. O antigo mapa no chão ainda é legível.',reward:20,condition:'explore'},
 {id:'broken-bridge',map:'forest',x:2720,name:'Ponte Quebrada',icon:'≈',lore:'A ponte atravessava um riacho antigo. Sob as tábuas há sinais de uma passagem.',reward:18,condition:'explore'},
 {id:'research-camp',map:'forest',x:3880,name:'Estação de Pesquisa',icon:'⌂',lore:'Cadernos esquecidos falam de criaturas que só surgem sob chuva.',reward:35,condition:'rain'},
 {id:'high-cliff',map:'forest',x:4720,name:'Mirante do Bosque Alto',icon:'▲',lore:'Do alto é possível enxergar a silhueta da Vila Lumina entre as árvores.',reward:30,condition:'explore'},
 {id:'crystal-heart',map:'cave',x:1900,name:'Coração de Cristal',icon:'◆',lore:'Um cristal enorme pulsa lentamente. Algo responde do outro lado da pedra.',reward:40,condition:'explore'},
 {id:'echo-shrine',map:'cave',x:3050,name:'Santuário do Eco',icon:'◇',lore:'Símbolos antigos cercam uma parede sem saída. A parede não parece tão sólida quanto deveria.',reward:50,condition:'lantern'}
];
export const SECRETS=[
 {id:'waterfall-passage',map:'forest',x:2050,name:'Passagem Atrás da Queda',hint:'A água não cobre toda a parede...',requires:null,reward:30},
 {id:'moon-burrow',map:'forest',x:4400,name:'Toca da Lua',hint:'Pegadas pequenas aparecem somente quando a lua está alta.',requires:'night',reward:45},
 {id:'hidden-chamber',map:'cave',x:3200,name:'Câmara Oculta',hint:'O eco parece continuar depois da parede.',requires:'lantern',reward:60}
];
export const FUTURE_DESTINATIONS=[
 {id:'tundra',name:'Tundra Branca',status:'EM BREVE',description:'Um território congelado além das montanhas.'},
 {id:'swamp',name:'Pântano Nebuloso',status:'EM BREVE',description:'Águas escuras e criaturas desconhecidas.'},
 {id:'desert',name:'Deserto de Vidro',status:'EM BREVE',description:'Um horizonte quente onde a areia parece cristal.'}
];
