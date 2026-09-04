/* FireFly 3.1 — dados do mundo vivo */
export const TIME = { DAY_LENGTH: 300, DAWN: .22, DUSK: .72 };
export const NPCS = {
 tito:{name:'Tito',role:'Pesquisador',schedule:[['06:00','home'],['08:00','square'],['12:00','lake'],['16:00','square'],['20:00','home']]},
 luna:{name:'Luna',role:'Botânica',schedule:[['06:00','home'],['08:00','flowers'],['13:00','shop'],['17:00','flowers'],['21:00','home']]},
 theo:{name:'Theo',role:'Ferreiro',schedule:[['06:00','home'],['07:00','workshop'],['12:00','square'],['14:00','workshop'],['20:00','home']]},
 maya:{name:'Maya',role:'Comerciante',schedule:[['07:00','shop'],['12:00','square'],['18:00','shop'],['22:00','home']]},
 nico:{name:'Nico',role:'Pescador',schedule:[['05:00','lake'],['11:00','square'],['15:00','lake'],['20:00','tavern'],['23:00','home']]}
};
export const EVENTS=[
 {id:'firefly_swarm',name:'Enxame Luminoso',hours:[20,24],maps:['forest'],chance:.28,duration:45},
 {id:'frog_rain',name:'Coro da Chuva',hours:[18,23],maps:['forest'],chance:.22,duration:55},
 {id:'crystal_resonance',name:'Ressonância Cristalina',hours:[0,6,22,24],maps:['cave'],chance:.2,duration:50},
 {id:'morning_migration',name:'Migração da Aurora',hours:[5,8],maps:['forest'],chance:.2,duration:40}
];
export const WORLD_LEVELS=[{level:1,required:0},{level:2,required:80},{level:3,required:220},{level:4,required:450},{level:5,required:800},{level:6,required:1300},{level:7,required:2000},{level:8,required:2900},{level:9,required:4100},{level:10,required:5600}];
