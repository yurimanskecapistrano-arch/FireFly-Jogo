/* =========================================================
   FIREFLY 6 — EVENTOS
   Catálogo de acontecimentos que transformam temporariamente o mundo.
   ========================================================= */
export const EVENT_DEFINITIONS = {
  rain_front:{id:'rain_front',name:'Frente de Chuva',type:'weather',maps:['forest'],hours:[7,22],chance:.34,duration:38,weather:'rain',message:'A mata escurece. Uma frente de chuva está chegando.',effect:'A chuva aumenta a atividade dos peixes e muda o comportamento da fauna.'},
  thunderstorm:{id:'thunderstorm',name:'TEMPESTADE',type:'storm',maps:['forest'],hours:[16,24],chance:.13,duration:32,weather:'storm',message:'O vento virou. Raios cortam o céu sobre o Bosque.',effect:'Fauna fica mais assustada e criaturas elétricas podem aparecer.'},
  firefly_night:{id:'firefly_night',name:'NOITE DOS VAGA-LUMES',type:'specialNight',maps:['forest'],hours:[19,24],chance:.18,duration:65,weather:'clear',message:'A noite acendeu. Milhares de vaga-lumes surgiram entre as árvores.',effect:'Enxames luminosos aparecem e a fauna noturna fica mais ativa.'},
  migration:{id:'migration',name:'MIGRAÇÃO',type:'migration',maps:['forest'],hours:[5,9],chance:.20,duration:42,weather:'clear',message:'Um grupo de criaturas migratórias atravessa o Bosque.',effect:'Acompanhe o grupo antes que ele desapareça entre as árvores.'},
  butterfly_bloom:{id:'butterfly_bloom',name:'EXPLOSÃO DE CORES',type:'swarm',maps:['forest'],hours:[8,18],chance:.16,duration:36,weather:'clear',message:'A clareira está viva. Um enxame de borboletas tomou as flores.',effect:'A clareira recebe uma concentração temporária de fauna rara.'},
  crystal_resonance:{id:'crystal_resonance',name:'RESSONÂNCIA CRISTALINA',type:'rare',maps:['cave'],hours:[0,6,21,24],chance:.22,duration:50,weather:'cave',message:'A caverna vibrou. Os cristais estão emitindo uma luz impossível.',effect:'Criaturas cristalinas surgem nas regiões profundas.'},
  moonfall:{id:'moonfall',name:'QUEDA DA LUA',type:'unique',unique:true,maps:['forest'],hours:[22,24],chance:.035,duration:72,weather:'clear',message:'Algo caiu além da Lagoa Cintilante. O Bosque inteiro ficou em silêncio.',effect:'Um acontecimento único marcou o mapa. Procure o rastro luminoso.'}
};
export const EVENT_ORDER=Object.keys(EVENT_DEFINITIONS);
