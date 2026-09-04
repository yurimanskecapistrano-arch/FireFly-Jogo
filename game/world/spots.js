/* =========================================================
   PONTOS DE INTERESSE — FireFly World 2.1
   ========================================================= */
export const LAKE = { x: 1840, y: 515, radius: 430 };
export const CAVE_ENTRANCE_X = 3880;

export const FOREST_ROCKS = [
  {x:290,y:548,scale:1.0},{x:510,y:530,scale:.65},{x:870,y:548,scale:.8},
  {x:1190,y:535,scale:1.1},{x:1510,y:552,scale:.65},{x:2200,y:545,scale:1.1},
  {x:2570,y:538,scale:.9},{x:2860,y:555,scale:.7},{x:3180,y:535,scale:1.15},
  {x:3500,y:550,scale:1.0},{x:3740,y:535,scale:.8},{x:4110,y:548,scale:1.2},
  {x:4440,y:540,scale:.75},{x:4770,y:550,scale:1.05},{x:5030,y:535,scale:.7}
];

export const FOREST_POIS = [
  {id:'oldCabin',x:900,y:485,type:'cabin',label:'Cabana Abandonada'},
  {id:'flowerArch',x:1220,y:500,type:'arch',label:'Arco das Flores'},
  {id:'fishingDock',x:1810,y:535,type:'dock',label:'Píer da Lagoa'},
  {id:'fallenTree',x:2640,y:510,type:'log',label:'Árvore Caída'},
  {id:'watchRock',x:3180,y:470,type:'lookout',label:'Mirante da Trilha'},
  {id:'quarry',x:3550,y:505,type:'quarry',label:'Pedreira Abandonada'},
  {id:'burrow',x:4390,y:535,type:'burrow',label:'Toca Escondida'},
  {id:'ancientTree',x:4820,y:440,type:'ancient',label:'Árvore Anciã'}
];

export function forestFlowerSpots(){
  const spots=[];
  for(let x=120;x<5150;x+=67) spots.push(x);
  return spots;
}
export function forestGrassSpots(){
  const spots=[];
  for(let x=80;x<5150;x+=53) spots.push(x);
  return spots;
}
export const CAVE_WEB_SPOTS=[500,1120,1730,2550,3260];
export const CAVE_CEILING_SPOTS=[460,930,1510,2140,2810,3370];
export const CAVE_ROCKS=[
  {x:250,y:555,s:.8},{x:620,y:520,s:1.1},{x:870,y:570,s:.7},{x:1190,y:535,s:.9},
  {x:1500,y:565,s:1.2},{x:1810,y:525,s:.8},{x:2150,y:570,s:1.0},{x:2460,y:535,s:.7},
  {x:2740,y:570,s:1.15},{x:3060,y:525,s:.9},{x:3370,y:560,s:.8}
];
