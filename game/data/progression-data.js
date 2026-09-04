export const RESOURCE_TYPES = {
  wood: { name:'Madeira Viva', icon:'🪵', value:2, respawn:42, zones:['entrance','oldTrail','highGrove'], color:'#9b684b' },
  fiber: { name:'Fibra Lunar', icon:'🌿', value:3, respawn:36, zones:['flower','lagoon','highGrove'], color:'#8ccf9b' },
  crystal: { name:'Cristal Ecoante', icon:'💎', value:8, respawn:65, zones:['quarry','crystal','deep'], color:'#8bd7e7' },
  mushroom: { name:'Cogumelo Luminoso', icon:'🍄', value:5, respawn:50, zones:['oldTrail','deep'], color:'#d99bd7' },
  ore: { name:'Minério Bruto', icon:'⛏', value:6, respawn:58, zones:['quarry','echo','deep'], color:'#8794a3' }
};

export const RECIPES = [
  {id:'better_net', name:'Rede Reforçada', cost:{wood:4,fiber:3}, unlockLevel:2, effect:'capture+12', description:'Aumenta bastante a chance de captura.'},
  {id:'lantern', name:'Lanterna de Cristal', cost:{wood:3,crystal:2}, unlockLevel:3, effect:'light+115', description:'Ilumina a caverna e revela caminhos distantes.'},
  {id:'exploration_kit', name:'Kit de Exploração', cost:{fiber:5,ore:2,crystal:1}, unlockLevel:4, effect:'stamina+35', description:'Permite correr por mais tempo.'},
  {id:'lucky_charm', name:'Amuleto do Vagalume', cost:{crystal:3,mushroom:2}, unlockLevel:5, effect:'rare+8', description:'Atrai encontros raros durante a noite.'},
  {id:'master_net', name:'Rede Prismática', cost:{fiber:8,crystal:5,ore:3}, unlockLevel:7, effect:'capture+28', description:'Equipamento de elite para criaturas difíceis.'}
];

export const LEVELS = [0,40,100,180,280,400,550,730,940,1200];

export const UPGRADES = [
  {id:'pocket', name:'Bolsa Expandida', cost:70, level:2, description:'+8 espaços úteis para recursos.'},
  {id:'boots', name:'Botas de Trilha', cost:110, level:3, description:'Movimento 12% mais responsivo.'},
  {id:'van_storage', name:'Bagageiro da Van', cost:160, level:4, description:'Recursos coletados não lotam a mochila tão cedo.'},
  {id:'field_notes', name:'Caderno de Campo', cost:220, level:5, description:'Descobertas rendem XP adicional.'},
  {id:'mastery', name:'Licença de Naturalista', cost:360, level:7, description:'Aumenta recompensas de missões e criaturas.'}
];

export function zoneAt(map, x){
  const zones = map === 'cave' ? [
    {id:'mouth',from:0,to:650},{id:'echo',from:650,to:1450},{id:'crystal',from:1450,to:2450},{id:'deep',from:2450,to:3600}
  ] : [
    {id:'entrance',from:0,to:620},{id:'flower',from:620,to:1450},{id:'lagoon',from:1450,to:2450},{id:'oldTrail',from:2450,to:3400},{id:'quarry',from:3400,to:4200},{id:'highGrove',from:4200,to:5200}
  ];
  return zones.find(z=>x>=z.from&&x<z.to)?.id || zones.at(-1).id;
}
