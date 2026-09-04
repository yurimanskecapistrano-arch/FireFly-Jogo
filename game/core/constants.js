/* =========================================================
   CONSTANTES — FireFly World 3.3
   ========================================================= */
export const W = 1280;
export const H = 720;
export const MAP_LIMITS = { lobby: 1280, village: 1900, forest: 5200, cave: 3600 };
export const WORLD = {
  forest:{width:5200,zones:[{id:'entrance',name:'Entrada da Floresta',from:0,to:620},{id:'flower',name:'Clareira das Flores',from:620,to:1450},{id:'lagoon',name:'Lagoa Cintilante',from:1450,to:2450},{id:'oldTrail',name:'Trilha Antiga',from:2450,to:3400},{id:'quarry',name:'Pedreira Abandonada',from:3400,to:4200},{id:'highGrove',name:'Bosque Alto',from:4200,to:5200}]},
  cave:{width:3600,zones:[{id:'mouth',name:'Boca da Caverna',from:0,to:650},{id:'echo',name:'Galeria dos Ecos',from:650,to:1450},{id:'crystal',name:'Salão de Cristal',from:1450,to:2450},{id:'deep',name:'Túneis Profundos',from:2450,to:3600}]}
};
