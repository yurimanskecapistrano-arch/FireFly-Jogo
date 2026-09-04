/* =========================================================
   NOMES / RARIDADES / ITENS
   ========================================================= */

export const names = {
  butterfly: 'Borboleta-aurora', frog: 'Sapo-musgo', lizard: 'Lagartixa-folha', spider: 'Aranha-das-rochas',
  firefly: 'Vagalume-dourado', rare: 'Vagalume-lilás', bat: 'Morcego-de-veludo', mouse: 'Rato-pedra',
  cavefly: 'Vagalume-de-cristal', moonfish: 'Peixe-lua', stripefish: 'Peixe-listrado'
};

export const rarity = {
  butterfly: 'comum', frog: 'comum', lizard: 'incomum', spider: 'incomum', firefly: 'comum', rare: 'raro',
  bat: 'incomum', mouse: 'comum', cavefly: 'raro', moonfish: 'comum', stripefish: 'incomum'
};

export const itemNames = { bait: 'Isca simples', reinforcedNet: 'Rede reforçada', lantern: 'Lanterna', explorationKit: 'Kit de exploração' };

export const QUESTS = {
  tito_frogs: { id: 'tito_frogs', giver: 'tito', title: 'Um coro para a lagoa', target: 'frog', required: 3, reward: { coins: 50, items: { bait: 1 } } }
};

export const SHOP = [
  ['bait', 'Isca simples', 'Deixa os peixes menos desconfiados.', 10],
  ['reinforcedNet', 'Rede reforçada', 'Necessária para capturas raras.', 75],
  ['lantern', 'Lanterna', 'Amplia a luz nas cavernas.', 100],
  ['explorationKit', 'Kit de exploração', 'Equipamento para rotas futuras.', 150]
];

export const SPECIES = {
  butterfly: { habitat: 'flower', fleeDistance: 95, fleeSpeed: 190, wanderSpeed: 40, catchDifficulty: 1, landsOnFlowers: true },
  frog: { habitat: 'water', fleeDistance: 120, fleeSpeed: 140, wanderSpeed: 22, catchDifficulty: 1, nightBoost: true },
  lizard: { habitat: 'rock', fleeDistance: 150, fleeSpeed: 240, wanderSpeed: 14, catchDifficulty: 1.6, camouflage: true },
  spider: { habitat: 'web', fleeDistance: 110, fleeSpeed: 95, wanderSpeed: 10, catchDifficulty: 1.3, mostlyStill: true },
  firefly: { habitat: 'air', nightOnly: true, fleeDistance: 70, fleeSpeed: 60, wanderSpeed: 26, catchDifficulty: 1, swarm: true },
  rare: { habitat: 'air', nightOnly: true, fleeDistance: 220, fleeSpeed: 170, wanderSpeed: 30, catchDifficulty: 2.2, swarm: true },
  bat: { habitat: 'ceiling', caveOnly: true, fleeDistance: 140, fleeSpeed: 210, wanderSpeed: 0, catchDifficulty: 1.4, sleeper: true },
  mouse: { habitat: 'ground', caveOnly: true, fleeDistance: 100, fleeSpeed: 200, wanderSpeed: 30, catchDifficulty: 1.2 },
  cavefly: { habitat: 'air', caveOnly: true, fleeDistance: 90, fleeSpeed: 70, wanderSpeed: 24, catchDifficulty: 1.5, swarm: true }
};
