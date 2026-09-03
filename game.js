/* =========================================================
   FIREFLY — GAMEPLAY 2.0
   Canvas world / persistent gameplay / exploration / capture
   ========================================================= */

'use strict';

/* =========================================================
   CANVAS / DOM
   ========================================================= */

const canvas = document.querySelector('#game');

if (!canvas) {
  throw new Error('FireFly: elemento #game não encontrado no index.html.');
}

const ctx = canvas.getContext('2d');

const W = 1280;
const H = 720;

const $ = (selector) => document.querySelector(selector);

const ui = {
  coins: $('#coins'),
  time: $('#time'),
  prompt: $('#prompt'),
  panel: $('#panel'),
  dialog: $('#dialog'),
  toast: $('#toast'),
  mute: $('#mute')
};

const keys = new Set();

/* =========================================================
   UTILITÁRIOS
   ========================================================= */

const clamp = (n, min, max) =>
  Math.max(min, Math.min(max, n));

const rnd = (min, max) =>
  min + Math.random() * (max - min);

const dist = (a, b) =>
  Math.hypot(a.x - b.x, a.y - b.y);

const lerp = (a, b, t) =>
  a + (b - a) * t;

/* =========================================================
   SAVE / DATA
   ========================================================= */

const DEFAULT_DATA = {
  version: 2,

  coins: 25,

  map: 'village',

  inventory: {
    bait: 0,
    reinforcedNet: 0,
    lantern: 0,
    explorationKit: 0
  },

  catches: {},

  discovered: {},

  quests: {
    tito_frogs: {
      status: 'available',
      progress: 0
    }
  },

  audioEnabled: true
};

function cloneDefaultData() {
  return JSON.parse(JSON.stringify(DEFAULT_DATA));
}

function loadGame() {
  try {
    const raw = localStorage.getItem('firefly-save');

    if (!raw) {
      return cloneDefaultData();
    }

    const parsed = JSON.parse(raw);

    return {
      ...cloneDefaultData(),
      ...parsed,

      inventory: {
        ...DEFAULT_DATA.inventory,
        ...(parsed.inventory || {})
      },

      catches: {
        ...DEFAULT_DATA.catches,
        ...(parsed.catches || {})
      },

      discovered: {
        ...DEFAULT_DATA.discovered,
        ...(parsed.discovered || {})
      },

      quests: {
        ...DEFAULT_DATA.quests,
        ...(parsed.quests || {})
      }
    };
  } catch (error) {
    console.warn('FireFly: save inválido, iniciando novo jogo.', error);
    return cloneDefaultData();
  }
}

const save = loadGame();

function saveGame() {
  try {
    localStorage.setItem(
      'firefly-save',
      JSON.stringify(save)
    );
  } catch (error) {
    console.warn('FireFly: não foi possível salvar.', error);
  }

  if (ui.coins) {
    ui.coins.textContent = save.coins;
  }
}

/* =========================================================
   AUDIO
   ========================================================= */

const AudioManager = {
  musicVolume: 0.35,
  sfxVolume: 0.2,
  ambientVolume: 0.25,

  ctx: null,
  unlocked: false,

  assets: {},

  unlock() {
    if (this.unlocked || !save.audioEnabled) {
      return;
    }

    try {
      const AudioContext =
        window.AudioContext ||
        window.webkitAudioContext;

      if (!AudioContext) {
        return;
      }

      this.ctx = new AudioContext();
      this.unlocked = true;

      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
    } catch (error) {
      console.warn('FireFly: áudio indisponível.', error);
    }
  },

  tone(
    frequency = 440,
    duration = 0.09,
    type = 'sine',
    volume = this.sfxVolume
  ) {
    if (
      !this.unlocked ||
      !this.ctx ||
      !save.audioEnabled
    ) {
      return;
    }

    try {
      const oscillator =
        this.ctx.createOscillator();

      const gain =
        this.ctx.createGain();

      oscillator.type = type;
      oscillator.frequency.value = frequency;

      const now = this.ctx.currentTime;

      gain.gain.setValueAtTime(
        0.0001,
        now
      );

      gain.gain.exponentialRampToValueAtTime(
        volume,
        now + 0.01
      );

      gain.gain.exponentialRampToValueAtTime(
        0.0001,
        now + duration
      );

      oscillator.connect(gain);
      gain.connect(this.ctx.destination);

      oscillator.start(now);

      oscillator.stop(
        now + duration + 0.02
      );
    } catch (error) {
      console.warn('FireFly: erro de áudio.', error);
    }
  },

  playSFX(id) {
    if (!save.audioEnabled) {
      return;
    }

    switch (id) {
      case 'capture':
        this.tone(660, 0.08);

        setTimeout(() => {
          this.tone(880, 0.12);
        }, 70);

        break;

      case 'coin':
        this.tone(980, 0.1);
        break;

      case 'purchase':
        this.tone(520, 0.08);

        setTimeout(() => {
          this.tone(780, 0.12);
        }, 90);

        break;

      case 'quest-complete':
        this.tone(523, 0.1);

        setTimeout(() => {
          this.tone(784, 0.1);
        }, 100);

        setTimeout(() => {
          this.tone(1046, 0.16);
        }, 200);

        break;

      case 'van-door':
        this.tone(180, 0.12, 'square');
        break;

      case 'van-engine':
        this.tone(90, 0.5, 'sawtooth', 0.08);
        break;

      case 'fish':
        this.tone(340, 0.12);
        break;

      case 'error':
        this.tone(150, 0.12, 'square');
        break;

      default:
        break;
    }
  },

  playMusic(map) {
    /*
      Sistema preparado para música real.

      Futuramente:
      assets/audio/music/village.mp3
      assets/audio/music/forest-day.mp3
      assets/audio/music/forest-night.mp3
      assets/audio/music/cave.mp3
    */

    this.currentMap = map;
  },

  playAmbient(map) {
    this.currentAmbient = map;
  },

  toggle() {
    save.audioEnabled = !save.audioEnabled;

    saveGame();

    notify(
      save.audioEnabled
        ? 'Som ativado'
        : 'Som desativado'
    );
  }
};

/* =========================================================
   QUESTS
   ========================================================= */

const QUESTS = {
  tito_frogs: {
    id: 'tito_frogs',

    giver: 'tito',

    title: 'Um coro para a lagoa',

    target: 'frog',

    required: 3,

    reward: {
      coins: 50,

      items: {
        bait: 1
      }
    }
  }
};

/* =========================================================
   SHOP
   ========================================================= */

const SHOP = [
  [
    'bait',
    'Isca simples',
    'Deixa os peixes menos desconfiados.',
    10
  ],

  [
    'reinforcedNet',
    'Rede reforçada',
    'Necessária para capturas raras.',
    75
  ],

  [
    'lantern',
    'Lanterna',
    'Amplia a luz nas cavernas.',
    100
  ],

  [
    'explorationKit',
    'Kit de exploração',
    'Equipamento para rotas futuras.',
    150
  ]
];

/* =========================================================
   NOMES / RARIDADES
   ========================================================= */

const names = {
  butterfly: 'Borboleta-aurora',
  frog: 'Sapo-musgo',
  lizard: 'Lagartixa-folha',
  spider: 'Aranha-das-rochas',

  firefly: 'Vagalume-dourado',
  rare: 'Vagalume-lilás',

  bat: 'Morcego-de-veludo',
  mouse: 'Rato-pedra',

  cavefly: 'Vagalume-de-cristal',

  moonfish: 'Peixe-lua',
  stripefish: 'Peixe-listrado'
};

const rarity = {
  butterfly: 'comum',
  frog: 'comum',

  lizard: 'incomum',
  spider: 'incomum',

  firefly: 'comum',

  rare: 'raro',

  bat: 'incomum',
  mouse: 'comum',

  cavefly: 'raro',

  moonfish: 'comum',
  stripefish: 'incomum'
};

const itemNames = {
  bait: 'Isca simples',
  reinforcedNet: 'Rede reforçada',
  lantern: 'Lanterna',
  explorationKit: 'Kit de exploração'
};

/* =========================================================
   GAME STATE
   ========================================================= */

const state = {
  map: save.map || 'village',

  clock: 0.54,

  t: 0,

  player: {
    x: save.map === 'village'
      ? 300
      : 260,

    y: 515,

    vx: 0,

    face: 1,

    mode: 'idle',

    action: 0
  },

  camera: {
    x: 0,

    target: 0,

    shake: 0
  },

  entities: [],

  particles: [],

  interactables: [],

  fade: {
    value: 0,
    job: null
  },

  travel: 0,

  fishing: null
};

/* =========================================================
   NOTIFICAÇÃO
   ========================================================= */

function notify(message) {
  if (!ui.toast) {
    return;
  }

  ui.toast.textContent = message;

  ui.toast.classList.add('show');

  clearTimeout(notify.timer);

  notify.timer = setTimeout(() => {
    ui.toast.classList.remove('show');
  }, 2300);
}

/* =========================================================
   PARTÍCULAS
   ========================================================= */

function addParticles(
  x,
  y,
  color,
  count = 12
) {
  for (let i = 0; i < count; i++) {
    state.particles.push({
      x,
      y,

      vx: rnd(-2.4, 2.4),

      vy: rnd(-3.4, -0.2),

      life: rnd(0.45, 1),

      maxLife: 1,

      color,

      size: rnd(2, 5)
    });
  }
}

/* =========================================================
   TRANSIÇÃO DE MAPA
   ========================================================= */

function transition(job) {
  if (state.fade.job) {
    return;
  }

  state.fade.job = job;
  state.fade.value = 0.01;
}

function beginMap(id, x = 250) {
  transition(() => {
    state.map = id;

    save.map = id;

    state.player.x = x;

    state.player.y = 515;

    state.player.vx = 0;

    state.camera.x = 0;

    state.entities = [];

    state.interactables = [];

    state.fishing = null;

    buildMap();

    saveGame();

    AudioManager.playMusic(id);
    AudioManager.playAmbient(id);
  });
}

/* =========================================================
   INTERAÇÕES
   ========================================================= */

function addInteractable(
  id,
  x,
  y,
  radius,
  type,
  onInteract,
  label
) {
  state.interactables.push({
    id,
    x,
    y,
    radius,
    type,
    onInteract,
    label
  });
}

function activeInteractable() {
  const p = state.player;

  return state.interactables
    .filter((object) => {
      return (
        Math.abs(object.x - p.x) <
          object.radius &&
        Math.abs(object.y - p.y) < 90
      );
    })
    .sort((a, b) => {
      return (
        Math.abs(a.x - p.x) -
        Math.abs(b.x - p.x)
      );
    })[0];
}

/* =========================================================
   MAPAS
   ========================================================= */

function buildMap() {
  state.interactables = [];

  if (state.map === 'village') {
    addInteractable(
      'tito',
      460,
      505,
      85,
      'npc',
      titoDialog,
      'Falar com Tito'
    );

    addInteractable(
      'shop',
      630,
      505,
      125,
      'shop',
      shopDialog,
      'Entrar na lojinha'
    );

    addInteractable(
      'van',
      980,
      510,
      145,
      'vehicle',
      startVan,
      'Subir na van'
    );
  }

  if (state.map === 'forest') {
    spawnForest();

    addInteractable(
      'fish',
      760,
      520,
      190,
      'fishing',
      startFishing,
      'Pescar no lago'
    );

    addInteractable(
      'cave',
      1590,
      510,
      135,
      'door',
      caveDialog,
      'Entrar na caverna'
    );

    addInteractable(
      'village',
      100,
      510,
      95,
      'door',
      () => beginMap('village', 1090),
      'Voltar para Vila Lumina'
    );
  }

  if (state.map === 'cave') {
    spawnCave();

    addInteractable(
      'exit',
      120,
      510,
      100,
      'door',
      () => beginMap('forest', 1500),
      'Sair da caverna'
    );
  }
}

/* =========================================================
   CRIATURAS
   ========================================================= */

function spawn(
  type,
  x,
  y,
  options = {}
) {
  state.entities.push({
    type,

    x,
    y,

    homeX: x,
    homeY: y,

    vx: 0,

    phase: rnd(0, 6),

    mode: 'wander',

    alive: true,

    rarity: rarity[type],

    ...options
  });
}

function spawnForest() {
  [
    ['butterfly', 490, 365],
    ['butterfly', 1250, 330],

    ['frog', 690, 512],
    ['frog', 835, 500],
    ['frog', 1090, 510],

    ['lizard', 1160, 430],

    ['spider', 1560, 490],

    ['firefly', 930, 355],

    ['rare', 1370, 340]
  ].forEach((creature) => {
    spawn(...creature);
  });
}

function spawnCave() {
  [
    ['bat', 570, 270],
    ['bat', 1050, 310],

    ['spider', 690, 510],

    ['mouse', 900, 515],

    ['cavefly', 1120, 390],

    ['rare', 1380, 350]
  ].forEach((creature) => {
    spawn(...creature);
  });
}

/* =========================================================
   QUEST SYSTEM
   ========================================================= */

function quest() {
  if (!save.quests.tito_frogs) {
    save.quests.tito_frogs = {
      status: 'available',
      progress: 0
    };
  }

  return save.quests.tito_frogs;
}

function acceptQuest() {
  const q = quest();

  q.status = 'active';
  q.progress = 0;

  saveGame();

  closeDialog();

  notify(
    'Missão aceita: capture 3 sapos.'
  );

  AudioManager.playSFX('coin');
}

function claimQuest() {
  const q = quest();

  const definition =
    QUESTS.tito_frogs;

  if (q.status !== 'complete') {
    return;
  }

  q.status = 'claimed';

  save.coins +=
    definition.reward.coins;

  for (
    const [item, amount]
    of Object.entries(
      definition.reward.items
    )
  ) {
    save.inventory[item] =
      (save.inventory[item] || 0) +
      amount;
  }

  saveGame();

  closeDialog();

  addParticles(
    state.player.x,
    state.player.y,
    '#ffd66e',
    28
  );

  notify(
    'MISSÃO CONCLUÍDA! +50 moedas, +1 Isca'
  );

  AudioManager.playSFX(
    'quest-complete'
  );
}

function titoDialog() {
  const q = quest();

  if (q.status === 'available') {
    dialog(
      'Tito, inventor de redes',

      'Ei! Você viu quantos sapos apareceram perto da floresta? Me traz 3 sapos e eu te dou umas moedas.',

      [
        ['ACEITAR', acceptQuest],

        ['AINDA NÃO', closeDialog]
      ]
    );

    return;
  }

  if (q.status === 'active') {
    dialog(
      'Tito',

      'Estou ouvindo a lagoa daqui. Sapos encontrados: ' +
        q.progress +
        ' / 3.',

      [
        ['VOLTAR', closeDialog]
      ]
    );

    return;
  }

  if (q.status === 'complete') {
    dialog(
      'Tito',

      'Você conseguiu! Caramba, esses sapos são rápidos. Vamos acertar sua recompensa.',

      [
        [
          'ENTREGAR SAPOS',
          claimQuest
        ]
      ]
    );

    return;
  }

  dialog(
    'Tito',

    'A rede parece feliz com você por perto. Obrigado pela ajuda com a lagoa!',

    [
      ['TCHAU', closeDialog]
    ]
  );
}

/* =========================================================
   LOJA
   ========================================================= */

function shopDialog() {
  const rows = SHOP
    .map(
      ([id, name, description, price]) => {
        const owned =
          save.inventory[id] || 0;

        const canBuy =
          save.coins >= price;

        return `
          <div class="card">
            <div>
              <b>${name}</b>
              <small>${description}</small>
              <small>
                ${price} moedas · possui ${owned}
              </small>
            </div>

            <button
              class="buy"
              data-buy="${id}"
              ${canBuy ? '' : 'disabled'}
            >
              COMPRAR
            </button>
          </div>
        `;
      }
    )
    .join('');

  ui.dialog.innerHTML = `
    <button class="close">×</button>

    <h2>Lojinha da Lumina</h2>

    <p>
      Ferramentas honestas.
      Preços mais ou menos.
    </p>

    <p>
      <b>✦ ${save.coins} moedas</b>
    </p>

    ${rows}
  `;

  ui.dialog.classList.remove('hidden');

  const closeButton =
    ui.dialog.querySelector('.close');

  if (closeButton) {
    closeButton.onclick =
      closeDialog;
  }

  ui.dialog
    .querySelectorAll('[data-buy]')
    .forEach((button) => {
      button.onclick = () => {
        buy(button.dataset.buy);
      };
    });
}

function buy(id) {
  const item =
    SHOP.find((entry) => entry[0] === id);

  if (!item) {
    return;
  }

  const [
    itemId,
    itemName,
    description,
    price
  ] = item;

  if (save.coins < price) {
    notify(
      'Você não tem moedas suficientes.'
    );

    AudioManager.playSFX('error');

    return;
  }

  save.coins -= price;

  save.inventory[itemId] =
    (save.inventory[itemId] || 0) +
    1;

  saveGame();

  addParticles(
    state.player.x,
    state.player.y,
    '#ffd66e',
    10
  );

  AudioManager.playSFX(
    'purchase'
  );

  notify(
    'COMPRADO! +1 ' + itemName
  );

  shopDialog();
}

/* =========================================================
   VAN
   ========================================================= */

function startVan() {
  if (state.travel) {
    return;
  }

  state.travel = 1.5;

  AudioManager.playSFX(
    'van-door'
  );

  notify(
    'A van sacode, a porta fecha...'
  );
}

/* =========================================================
   CAVERNA
   ========================================================= */

function caveDialog() {
  dialog(
    'Fenda Cintilante',

    'Uma corrente fria e um brilho azul escapam lá de dentro.',

    [
      [
        'ENTRAR NA CAVERNA',

        () => {
          closeDialog();

          beginMap(
            'cave',
            240
          );
        }
      ],

      [
        'AGORA NÃO',
        closeDialog
      ]
    ]
  );
}

/* =========================================================
   PESCA
   ========================================================= */

function startFishing() {
  if (state.fishing) {
    return;
  }

  state.fishing = {
    time: 1.2,

    ready: false
  };

  state.player.action = 1;

  notify(
    'Você lança a linha. Espere a boia mexer...'
  );

  AudioManager.playSFX('fish');
}

function finishFishing() {
  if (!state.fishing) {
    return;
  }

  const fish =
    Math.random() < 0.26
      ? 'stripefish'
      : 'moonfish';

  save.catches[fish] =
    (save.catches[fish] || 0) +
    1;

  save.discovered[fish] = true;

  save.coins +=
    rarity[fish] === 'incomum'
      ? 6
      : 3;

  state.fishing = null;

  state.player.action = 0.7;

  addParticles(
    760,
    500,
    '#9ce4e2',
    16
  );

  saveGame();

  notify(
    'Fisgou ' +
      names[fish] +
      '!'
  );

  AudioManager.playSFX(
    'capture'
  );
}

/* =========================================================
   CAPTURA
   ========================================================= */

function capture() {
  if (state.map === 'village') {
    return;
  }

  if (state.fishing?.ready) {
    finishFishing();

    return;
  }

  const p =
    state.player;

  const nearby =
    state.entities
      .filter(
        (entity) =>
          entity.alive
      )
      .sort(
        (a, b) =>
          Math.abs(a.x - p.x) -
          Math.abs(b.x - p.x)
      );

  const entity =
    nearby[0];

  p.action = 0.6;

  if (
    !entity ||
    Math.abs(entity.x - p.x) >
      105
  ) {
    notify(
      'Escapou! A rede só pegou folhas.'
    );

    addParticles(
      p.x + 35 * p.face,
      p.y,
      '#a5cf7d',
      5
    );

    AudioManager.playSFX(
      'error'
    );

    return;
  }

  if (
    entity.rarity === 'raro' &&
    !save.inventory.reinforcedNet
  ) {
    entity.mode = 'flee';

    entity.vx =
      entity.x >= p.x
        ? 260
        : -260;

    notify(
      'É raro demais para a sua rede atual!'
    );

    AudioManager.playSFX(
      'error'
    );

    return;
  }

  entity.alive = false;

  save.catches[entity.type] =
    (save.catches[entity.type] || 0) +
    1;

  const fresh =
    !save.discovered[entity.type];

  save.discovered[entity.type] =
    true;

  save.coins +=
    entity.rarity === 'raro'
      ? 12
      : entity.rarity === 'incomum'
        ? 5
        : 3;

  if (
    entity.type === 'frog' &&
    quest().status === 'active'
  ) {
    quest().progress++;

    if (
      quest().progress >=
      QUESTS.tito_frogs.required
    ) {
      quest().status = 'complete';

      addParticles(
        entity.x,
        entity.y,
        '#ffe875',
        30
      );

      notify(
        'MISSÃO COMPLETA! Volte para Tito.'
      );

      AudioManager.playSFX(
        'quest-complete'
      );
    } else {
      notify(
        'Sapo capturado! ' +
          quest().progress +
          '/3 para Tito.'
      );
    }
  } else {
    notify(
      (fresh
        ? 'NOVA DESCOBERTA! '
        : '') +
        names[entity.type] +
        ' capturado!'
    );
  }

  addParticles(
    entity.x,
    entity.y,
    entity.rarity === 'raro'
      ? '#d2a1ff'
      : '#ffe47a',
    16
  );

  state.camera.shake = 8;

  saveGame();

  AudioManager.playSFX(
    'capture'
  );
}

/* =========================================================
   DIÁLOGOS
   ========================================================= */

function dialog(
  title,
  body,
  actions
) {
  if (!ui.dialog) {
    return;
  }

  ui.dialog.innerHTML = `
    <button class="close">×</button>

    <h2>${title}</h2>

    <p>${body}</p>

    ${actions
      .map(
        (action, index) => `
          <button
            class="choice action-${index}"
          >
            ${action[0]}
          </button>
        `
      )
      .join('')}
  `;

  ui.dialog.classList.remove(
    'hidden'
  );

  const close =
    ui.dialog.querySelector('.close');

  if (close) {
    close.onclick =
      closeDialog;
  }

  actions.forEach(
    (action, index) => {
      const button =
        ui.dialog.querySelector(
          '.action-' + index
        );

      if (button) {
        button.onclick =
          action[1];
      }
    }
  );
}

function closeDialog() {
  if (ui.dialog) {
    ui.dialog.classList.add(
      'hidden'
    );
  }
}

/* =========================================================
   DRAW HELPERS
   ========================================================= */

function wx(x) {
  return x - state.camera.x;
}

function poly(
  points,
  fill,
  stroke
) {
  ctx.beginPath();

  points.forEach(
    ([x, y], index) => {
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
  );

  ctx.closePath();

  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }

  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 3;
    ctx.stroke();
  }
}

function txt(
  string,
  x,
  y,
  size = 15,
  color = '#fff',
  align = 'left'
) {
  ctx.fillStyle = color;

  ctx.font =
    `700 ${size}px system-ui`;

  ctx.textAlign = align;

  ctx.fillText(
    string,
    x,
    y
  );
}

/* =========================================================
   SKY
   ========================================================= */

function sky() {
  const daylight =
    1 -
    Math.abs(
      state.clock - 0.5
    ) * 2;

  const gradient =
    ctx.createLinearGradient(
      0,
      0,
      0,
      H
    );

  gradient.addColorStop(
    0,
    `rgb(
      ${18 + 80 * daylight},
      ${35 + 170 * daylight},
      ${60 + 155 * daylight}
    )`
  );

  gradient.addColorStop(
    1,
    `rgb(
      ${36 + 130 * daylight},
      ${63 + 150 * daylight},
      ${80 + 100 * daylight}
    )`
  );

  ctx.fillStyle = gradient;

  ctx.fillRect(
    0,
    0,
    W,
    H
  );

  /* Lua */

  if (daylight < 0.4) {
    ctx.fillStyle =
      '#f3edca';

    ctx.beginPath();

    ctx.arc(
      1030,
      105,
      28,
      0,
      Math.PI * 2
    );

    ctx.fill();

    /* estrelas */

    for (
      let i = 0;
      i < 40;
      i++
    ) {
      ctx.fillStyle =
        '#dbe9ce';

      ctx.fillRect(
        (i * 97) % W,
        (i * 59) % 300,
        2,
        2
      );
    }
  } else {
    ctx.fillStyle =
      '#ffe9a2';

    ctx.beginPath();

    ctx.arc(
      1030,
      105,
      35,
      0,
      Math.PI * 2
    );

    ctx.fill();
  }

  /* Parallax */

  const layers = [
    '#5aa27e',
    '#377b69',
    '#245c58'
  ];

  for (
    let layer = 0;
    layer < 3;
    layer++
  ) {
    const offset =
      (
        state.camera.x *
        (0.18 + layer * 0.16)
      ) % 150;

    ctx.fillStyle =
      layers[layer];

    for (
      let x = -160 - offset;
      x < W + 180;
      x += 118
    ) {
      ctx.beginPath();

      ctx.moveTo(
        x,
        450
      );

      ctx.quadraticCurveTo(
        x + 35,
        285 - layer * 25,
        x + 70,
        430
      );

      ctx.quadraticCurveTo(
        x + 99,
        315,
        x + 130,
        450
      );

      ctx.fill();
    }
  }
}

/* =========================================================
   GROUND
   ========================================================= */

function ground() {
  const cave =
    state.map === 'cave';

  ctx.fillStyle =
    cave
      ? '#263d48'
      : '#356b4d';

  ctx.fillRect(
    0,
    430,
    W,
    290
  );

  ctx.fillStyle =
    cave
      ? '#415865'
      : '#4d915b';

  ctx.fillRect(
    0,
    457,
    W,
    263
  );

  for (
    let x = -40;
    x < W + 40;
    x += 27
  ) {
    ctx.strokeStyle =
      cave
        ? '#5b7780'
        : '#79b76b';

    ctx.lineWidth = 2;

    ctx.beginPath();

    ctx.moveTo(
      x,
      460
    );

    ctx.lineTo(
      x + 5,
      452 +
        Math.sin(
          state.t + x
        ) *
          3
    );

    ctx.stroke();
  }
}

/* =========================================================
   ÁRVORES
   ========================================================= */

function tree(
  x,
  y,
  scale,
  variant = 0
) {
  x = wx(x);

  ctx.save();

  ctx.translate(
    x,
    y
  );

  ctx.scale(
    scale,
    scale
  );

  ctx.rotate(
    Math.sin(
      state.t * 1.2 + x
    ) * 0.012
  );

  /* raízes */

  poly(
    [
      [-15, 168],
      [-38, 188],
      [-12, 180],
      [0, 199],
      [14, 179],
      [39, 188],
      [20, 164],
      [17, 65],
      [-12, 53]
    ],
    '#654638',
    '#363e42'
  );

  ctx.fillStyle =
    '#a36c4d';

  ctx.fillRect(
    -2,
    70,
    5,
    78
  );

  const crowns = [
    [
      '#4f9c5b',
      -28,
      30,
      44
    ],
    [
      '#397f51',
      19,
      24,
      51
    ],
    [
      '#62ae66',
      0,
      -8,
      55
    ],
    [
      '#4b9858',
      -38,
      -1,
      37
    ],
    [
      '#5dad65',
      37,
      -2,
      36
    ]
  ];

  crowns.forEach(
    ([color, a, b, radius]) => {
      ctx.fillStyle =
        variant
          ? color
          : color;

      ctx.beginPath();

      ctx.moveTo(
        a - radius * 0.6,
        b + radius * 0.3
      );

      ctx.quadraticCurveTo(
        a - radius,
        b - radius * 0.3,
        a,
        b - radius
      );

      ctx.quadraticCurveTo(
        a + radius,
        b - radius * 0.25,
        a + radius * 0.6,
        b + radius * 0.4
      );

      ctx.quadraticCurveTo(
        a,
        b + radius,
        a - radius * 0.6,
        b + radius * 0.3
      );

      ctx.fill();
    }
  );

  ctx.restore();
}

/* =========================================================
   PEDRAS
   ========================================================= */

function rocks(
  x,
  y,
  scale = 1
) {
  x = wx(x);

  poly(
    [
      [
        x - 20 * scale,
        y
      ],

      [
        x - 11 * scale,
        y - 18 * scale
      ],

      [
        x + 10 * scale,
        y - 23 * scale
      ],

      [
        x + 24 * scale,
        y - 5 * scale
      ],

      [
        x + 17 * scale,
        y + 3 * scale
      ],

      [
        x - 16 * scale,
        y + 3 * scale
      ]
    ],
    '#779080',
    '#4c6b61'
  );

  ctx.fillStyle =
    '#9bb4a1';

  ctx.fillRect(
    x - 7 * scale,
    y - 15 * scale,
    9 * scale,
    3 * scale
  );
}

/* =========================================================
   FLORES
   ========================================================= */

function flower(
  x,
  y,
  color
) {
  x = wx(x);

  ctx.strokeStyle =
    '#326b44';

  ctx.beginPath();

  ctx.moveTo(
    x,
    y
  );

  ctx.lineTo(
    x + 2,
    y -
      19 +
      Math.sin(
        state.t + x
      ) *
        2
  );

  ctx.stroke();

  ctx.fillStyle =
    color;

  for (
    let i = 0;
    i < 5;
    i++
  ) {
    ctx.beginPath();

    ctx.ellipse(
      x +
        2 +
        Math.cos(
          i * 1.26
        ) *
          5,

      y -
        23 +
        Math.sin(
          i * 1.26
        ) *
          5,

      4,
      3,
      i,
      0,
      Math.PI * 2
    );

    ctx.fill();
  }

  ctx.fillStyle =
    '#ffe276';

  ctx.beginPath();

  ctx.arc(
    x + 2,
    y - 23,
    3,
    0,
    Math.PI * 2
  );

  ctx.fill();
}

/* =========================================================
   LAGO
   ========================================================= */

function lake() {
  const x = wx(760);
  const y = 510;

  /* margem */

  poly(
    [
      [x - 225, y + 30],
      [x - 192, y - 16],
      [x - 140, y - 36],
      [x - 89, y - 30],
      [x - 45, y - 59],
      [x + 35, y - 49],
      [x + 70, y - 22],
      [x + 155, y - 27],
      [x + 208, y + 8],
      [x + 182, y + 45],
      [x + 92, y + 61],
      [x + 19, y + 48],
      [x - 66, y + 66],
      [x - 147, y + 49]
    ],
    '#87684c',
    '#3f674d'
  );

  /* água */

  poly(
    [
      [x - 185, y + 22],
      [x - 151, y - 4],
      [x - 93, y - 15],
      [x - 40, y - 40],
      [x + 25, y - 32],
      [x + 73, y - 8],
      [x + 144, y - 10],
      [x + 173, y + 11],
      [x + 148, y + 29],
      [x + 89, y + 39],
      [x + 21, y + 29],
      [x - 53, y + 47],
      [x - 125, y + 34]
    ],
    '#3e98a9',
    '#286b79'
  );

  /* ondas */

  for (
    let i = 0;
    i < 8;
    i++
  ) {
    ctx.strokeStyle =
      '#a5e4d9';

    ctx.lineWidth = 2;

    ctx.beginPath();

    ctx.arc(
      x -
        135 +
        i * 40 +
        Math.sin(
          state.t + i
        ) *
          7,

      y +
        8 +
        (i % 3) * 9,

      10,

      0.1,
      2.7
    );

    ctx.stroke();
  }

  /* vegetação */

  [
    [-165, 15],
    [165, 15],
    [-145, -8]
  ].forEach(
    ([dx, dy]) => {
      ctx.strokeStyle =
        '#315f45';

      ctx.lineWidth = 3;

      ctx.beginPath();

      ctx.moveTo(
        x + dx,
        y + dy
      );

      ctx.lineTo(
        x + dx + 3,
        y + dy - 23
      );

      ctx.stroke();

      ctx.fillStyle =
        '#79994e';

      ctx.beginPath();

      ctx.ellipse(
        x + dx + 8,
        y + dy - 24,
        7,
        3,
        0.5,
        0,
        Math.PI * 2
      );

      ctx.fill();
    }
  );

  /* boia */

  if (state.fishing) {
    const bob =
      state.fishing.ready
        ? Math.sin(
            state.t * 18
          ) * 9
        : Math.sin(
            state.t * 4
          ) * 2;

    ctx.strokeStyle =
      '#e9d5ae';

    ctx.beginPath();

    ctx.moveTo(
      wx(state.player.x) +
        30,
      state.player.y - 10
    );

    ctx.lineTo(
      x,
      y - 10 + bob
    );

    ctx.stroke();

    ctx.fillStyle =
      '#f2c764';

    ctx.beginPath();

    ctx.arc(
      x,
      y - 10 + bob,
      5,
      0,
      Math.PI * 2
    );

    ctx.fill();
  }
}

/* =========================================================
   ENTRADA DA CAVERNA
   ========================================================= */

function caveEntrance() {
  const x = wx(1590);
  const y = 460;

  poly(
    [
      [x - 130, 105],
      [x - 120, 54],
      [x - 92, 18],
      [x - 54, 4],
      [x - 20, -3],
      [x + 13, 17],
      [x + 47, 3],
      [x + 86, 24],
      [x + 115, 62],
      [x + 123, 105]
    ],
    '#5c625c',
    '#35464a'
  );

  poly(
    [
      [x - 78, 105],
      [x - 69, 58],
      [x - 42, 27],
      [x - 4, 19],
      [x + 37, 43],
      [x + 65, 72],
      [x + 72, 105]
    ],
    '#162b38'
  );

  for (
    let i = 0;
    i < 4;
    i++
  ) {
    poly(
      [
        [
          x - 30 + i * 16,
          94
        ],

        [
          x - 24 + i * 16,
          68
        ],

        [
          x - 17 + i * 16,
          94
        ]
      ],
      '#91ddb9'
    );
  }
}

/* =========================================================
   MUNDO DA CAVERNA
   ========================================================= */

function caveWorld() {
  for (
    let x = 0;
    x < W;
    x += 70
  ) {
    poly(
      [
        [x, 0],
        [
          x + 35,
          40 +
            (x % 4) * 14
        ],
        [x + 70, 0]
      ],
      '#2e4957'
    );

    poly(
      [
        [x, 720],
        [
          x + 32,
          650 -
            (x % 5) * 10
        ],
        [x + 70, 720]
      ],
      '#314d59'
    );
  }

  for (
    let i = 0;
    i < 12;
    i++
  ) {
    const x =
      (i * 139) % W;

    const y =
      330 +
      (i % 3) * 85;

    poly(
      [
        [x, y],
        [x + 8, y - 26],
        [x + 16, y]
      ],
      i % 2
        ? '#6ccfca'
        : '#a493e5'
    );
  }
}

/* =========================================================
   CASA / LOJINHA
   ========================================================= */

function house() {
  const x = wx(630);
  const y = 400;

  poly(
    [
      [x - 123, y + 100],
      [x - 113, y + 36],
      [x - 74, y - 2],
      [x - 8, y + 15],
      [x + 42, y - 6],
      [x + 109, y + 36],
      [x + 123, y + 100]
    ],
    '#d78e5a',
    '#623f3c'
  );

  poly(
    [
      [x - 133, y + 40],
      [x - 81, y - 31],
      [x - 3, y + 2],
      [x + 45, y - 31],
      [x + 129, y + 41],
      [x + 109, y + 48],
      [x + 39, y + 8],
      [x - 5, y + 28],
      [x - 84, y - 20],
      [x - 118, y + 49]
    ],
    '#9b5147',
    '#623f3c'
  );

  ctx.fillStyle =
    '#f1c378';

  ctx.fillRect(
    x - 50,
    y + 58,
    35,
    42
  );

  ctx.fillStyle =
    '#7bc0c4';

  ctx.fillRect(
    x + 29,
    y + 41,
    34,
    26
  );

  ctx.strokeStyle =
    '#653f3e';

  ctx.strokeRect(
    x + 29,
    y + 41,
    34,
    26
  );

  txt(
    'LOJINHA DA LUMINA',
    x,
    y + 20,
    11,
    '#fff5c9',
    'center'
  );
}

/* =========================================================
   VAN
   ========================================================= */

function van() {
  const x = wx(980);
  const y = 520;

  const shake =
    state.travel
      ? Math.sin(
          state.t * 38
        ) * 4
      : Math.sin(
          state.t * 8
        );

  ctx.save();

  ctx.translate(
    x,
    y + shake
  );

  /* sombra */

  ctx.fillStyle =
    '#203d4c88';

  ctx.beginPath();

  ctx.ellipse(
    -5,
    14,
    120,
    15,
    0,
    0,
    Math.PI * 2
  );

  ctx.fill();

  /* carroceria */

  ctx.fillStyle =
    '#28495a';

  ctx.beginPath();

  ctx.roundRect(
    -112,
    -59,
    215,
    65,
    18
  );

  ctx.fill();

  ctx.fillStyle =
    '#e37d4e';

  ctx.beginPath();

  ctx.roundRect(
    -106,
    -55,
    203,
    55,
    13
  );

  ctx.fill();

  poly(
    [
      [-83, -59],
      [-55, -94],
      [28, -94],
      [59, -58]
    ],
    '#e37d4e',
    '#28495a'
  );

  /* janelas */

  ctx.fillStyle =
    '#9bd5da';

  ctx.fillRect(
    -49,
    -86,
    35,
    23
  );

  ctx.fillRect(
    -8,
    -86,
    33,
    23
  );

  /* farol */

  ctx.fillStyle =
    state.travel
      ? '#fff4ac'
      : '#f9e4a6';

  ctx.fillRect(
    70,
    -31,
    17,
    12
  );

  ctx.strokeStyle =
    '#28495a';

  ctx.strokeRect(
    30,
    -50,
    30,
    50
  );

  txt(
    'FIREFLY',
    12,
    -17,
    15,
    '#fff8d4',
    'center'
  );

  /* rodas */

  [-70, -12, 43, 78].forEach(
    (offset) => {
      ctx.fillStyle =
        '#27343e';

      ctx.beginPath();

      ctx.arc(
        offset,
        3,
        15,
        0,
        Math.PI * 2
      );

      ctx.fill();

      ctx.fillStyle =
        '#d8d4bd';

      ctx.beginPath();

      ctx.arc(
        offset,
        3,
        6,
        0,
        Math.PI * 2
      );

      ctx.fill();
    }
  );

  ctx.restore();
}

/* =========================================================
   PLAYER
   ========================================================= */

function player() {
  const p =
    state.player;

  const x =
    wx(p.x);

  const walk =
    p.mode === 'walk'
      ? Math.sin(
          state.t * 15
        ) * 4
      : Math.sin(
          state.t * 2
        );

  const action =
    p.action;

  ctx.save();

  ctx.translate(
    x,
    p.y + walk
  );

  ctx.scale(
    p.face,
    1
  );

  if (action) {
    ctx.rotate(
      -0.45 *
        Math.sin(
          action * 7
        )
    );
  }

  /* botas */

  ctx.fillStyle =
    '#324a55';

  ctx.fillRect(
    -15,
    38 +
      Math.abs(walk),
    10,
    11
  );

  ctx.fillRect(
    6,
    38 -
      Math.abs(walk),
    10,
    11
  );

  /* corpo */

  poly(
    [
      [-17, 10],
      [-22, 34],
      [-13, 45],
      [18, 43],
      [25, 24],
      [15, 9]
    ],
    '#d36b55',
    '#293d49'
  );

  /* mochila */

  ctx.fillStyle =
    '#7a4f45';

  ctx.beginPath();

  ctx.arc(
    -20,
    26,
    11,
    0,
    Math.PI * 2
  );

  ctx.fill();

  /* rosto */

  ctx.fillStyle =
    '#ffd29d';

  ctx.beginPath();

  ctx.arc(
    2,
    1,
    18,
    0,
    Math.PI * 2
  );

  ctx.fill();

  /* cabelo */

  poly(
    [
      [-20, -1],
      [-11, -21],
      [12, -28],
      [25, -9],
      [15, -7],
      [-8, -8]
    ],
    '#593d57',
    '#293d49'
  );

  /* olho */

  ctx.fillStyle =
    '#263d48';

  ctx.fillRect(
    11,
    2,
    3,
    3
  );

  /* braço */

  ctx.strokeStyle =
    '#f3dec4';

  ctx.lineWidth = 3;

  ctx.beginPath();

  ctx.moveTo(
    18,
    20
  );

  ctx.lineTo(
    44,
    2
  );

  ctx.stroke();

  /* rede */

  ctx.beginPath();

  ctx.arc(
    49,
    -3,
    14,
    0.4,
    4.4
  );

  ctx.stroke();

  ctx.restore();
}

/* =========================================================
   TITO
   ========================================================= */

function tito() {
  const x =
    wx(460);

  const y =
    505 +
    Math.sin(
      state.t * 2
    ) *
      2;

  ctx.save();

  ctx.translate(
    x,
    y
  );

  poly(
    [
      [-18, 40],
      [-21, 11],
      [-8, -1],
      [17, 3],
      [26, 39]
    ],
    '#7c6cad',
    '#343d55'
  );

  ctx.fillStyle =
    '#f2be91';

  ctx.beginPath();

  ctx.arc(
    1,
    -12,
    18,
    0,
    Math.PI * 2
  );

  ctx.fill();

  poly(
    [
      [-21, -10],
      [-7, -34],
      [18, -28],
      [26, -4],
      [10, -13]
    ],
    '#d86f55',
    '#343d55'
  );

  ctx.fillStyle =
    '#40585c';

  ctx.fillRect(
    -19,
    40,
    15,
    8
  );

  ctx.fillRect(
    10,
    40,
    15,
    8
  );

  ctx.restore();

  txt(
    'TITO',
    x,
    y + 65,
    11,
    '#fff8d9',
    'center'
  );
}

/* =========================================================
   CRIATURAS
   ========================================================= */

function creature(e) {
  const x =
    wx(e.x);

  const flying =
    e.type.includes('fly') ||
    e.type === 'bat';

  const y =
    e.y +
    Math.sin(
      state.t * 2 +
        e.phase
    ) *
      (flying ? 16 : 3);

  ctx.save();

  ctx.translate(
    x,
    y
  );

  if (e.vx < 0) {
    ctx.scale(
      -1,
      1
    );
  }

  /* borboleta */

  if (
    e.type ===
    'butterfly'
  ) {
    const wing =
      Math.sin(
        state.t * 13 +
          e.phase
      ) *
      0.45;

    ctx.fillStyle =
      '#f18b90';

    ctx.beginPath();

    ctx.ellipse(
      -9,
      0,
      11,
      6,
      wing,
      0,
      Math.PI * 2
    );

    ctx.fill();

    ctx.fillStyle =
      '#f6d078';

    ctx.beginPath();

    ctx.ellipse(
      9,
      0,
      11,
      6,
      -wing,
      0,
      Math.PI * 2
    );

    ctx.fill();

    ctx.fillStyle =
      '#374658';

    ctx.fillRect(
      -2,
      -6,
      4,
      13
    );
  }

  /* sapo */

  else if (
    e.type ===
    'frog'
  ) {
    const scale =
      1 +
      Math.sin(
        state.t * 5
      ) *
        0.08;

    ctx.scale(
      1,
      scale
    );

    ctx.fillStyle =
      '#70ad5f';

    ctx.beginPath();

    ctx.ellipse(
      0,
      0,
      18,
      12,
      0,
      0,
      Math.PI * 2
    );

    ctx.fill();

    ctx.beginPath();

    ctx.arc(
      -10,
      -8,
      6,
      0,
      Math.PI * 2
    );

    ctx.arc(
      9,
      -8,
      6,
      0,
      Math.PI * 2
    );

    ctx.fill();

    ctx.fillStyle =
      '#273c42';

    ctx.fillRect(
      -11,
      -10,
      3,
      3
    );

    ctx.fillRect(
      8,
      -10,
      3,
      3
    );
  }

  /* lagartixa / rato */

  else if (
    e.type ===
      'lizard' ||
    e.type ===
      'mouse'
  ) {
    ctx.fillStyle =
      e.type === 'mouse'
        ? '#9b8275'
        : '#6fae89';

    ctx.beginPath();

    ctx.ellipse(
      0,
      0,
      22,
      7,
      0,
      0,
      Math.PI * 2
    );

    ctx.fill();

    ctx.beginPath();

    ctx.moveTo(
      -15,
      1
    );

    ctx.lineTo(
      -39,
      10
    );

    ctx.lineTo(
      -23,
      4
    );

    ctx.fill();

    ctx.fillStyle =
      '#233f41';

    ctx.fillRect(
      14,
      -3,
      3,
      3
    );
  }

  /* aranha */

  else if (
    e.type ===
    'spider'
  ) {
    ctx.strokeStyle =
      '#273442';

    ctx.lineWidth = 3;

    for (
      let side = -1;
      side <= 1;
      side += 2
    ) {
      for (
        let leg = 0;
        leg < 3;
        leg++
      ) {
        ctx.beginPath();

        ctx.moveTo(
          0,
          0
        );

        ctx.lineTo(
          side *
            (11 + leg * 3),
          -5 +
            leg * 7
        );

        ctx.stroke();
      }
    }

    ctx.fillStyle =
      '#474356';

    ctx.beginPath();

    ctx.arc(
      0,
      0,
      9,
      0,
      Math.PI * 2
    );

    ctx.fill();
  }

  /* morcego */

  else if (
    e.type ===
    'bat'
  ) {
    ctx.fillStyle =
      '#4b4969';

    ctx.beginPath();

    ctx.moveTo(
      0,
      0
    );

    ctx.quadraticCurveTo(
      -17,
      -15,
      -28,
      5
    );

    ctx.quadraticCurveTo(
      -12,
      1,
      0,
      8
    );

    ctx.quadraticCurveTo(
      15,
      -14,
      28,
      5
    );

    ctx.quadraticCurveTo(
      11,
      1,
      0,
      0
    );

    ctx.fill();
  }

  /* vagalume */

  else {
    const rare =
      e.type === 'rare' ||
      e.type === 'cavefly';

    ctx.shadowColor =
      rare
        ? '#c88fff'
        : '#ffe86f';

    ctx.shadowBlur =
      rare
        ? 24
        : 15;

    ctx.fillStyle =
      rare
        ? '#d6a2ff'
        : '#f3dc68';

    ctx.beginPath();

    ctx.ellipse(
      0,
      0,
      7,
      5,
      0,
      0,
      Math.PI * 2
    );

    ctx.fill();

    ctx.fillStyle =
      '#eaf7d1';

    ctx.beginPath();

    ctx.ellipse(
      -6,
      -3,
      7,
      3,
      -0.5,
      0,
      Math.PI * 2
    );

    ctx.ellipse(
      6,
      -3,
      7,
      3,
      0.5,
      0,
      Math.PI * 2
    );

    ctx.fill();

    ctx.shadowBlur = 0;
  }

  ctx.restore();
}

/* =========================================================
   UPDATE
   ========================================================= */

function update(dt) {
  state.t += dt;

  /* ciclo completo */

  state.clock =
    (state.clock +
      dt / 180) %
    1;

  const isDay =
    state.clock > 0.22 &&
    state.clock < 0.78;

  if (ui.time) {
    ui.time.textContent =
      isDay
        ? '☀ DIA'
        : '☾ NOITE';
  }

  const p =
    state.player;

  const direction =
    (
      keys.has('ArrowRight') ||
      keys.has('d') ||
      keys.has('D')
    ? 1
    : 0
    ) -
    (
      keys.has('ArrowLeft') ||
      keys.has('a') ||
      keys.has('A')
    ? 1
    : 0
    );

  const running =
    keys.has('Shift');

  const acceleration =
    running
      ? 900
      : 580;

  p.vx +=
    (
      direction *
        acceleration -
      p.vx
    ) *
      Math.min(
        1,
        dt * 7
      );

  if (!direction) {
    p.vx *=
      Math.max(
        0,
        1 - dt * 9
      );
  }

  let maxX;

  if (
    state.map ===
    'village'
  ) {
    maxX = 1160;
  } else if (
    state.map ===
    'forest'
  ) {
    maxX = 2200;
  } else {
    maxX = 1600;
  }

  p.x =
    clamp(
      p.x +
        p.vx * dt,
      50,
      maxX
    );

  if (direction) {
    p.face =
      direction;
  }

  p.mode =
    Math.abs(p.vx) > 20
      ? 'walk'
      : 'idle';

  p.action =
    Math.max(
      0,
      p.action -
        dt * 2.5
    );

  /* câmera */

  state.camera.target =
    clamp(
      p.x -
        W * 0.46,
      0,
      Math.max(
        0,
        maxX -
          W +
          100
      )
    );

  state.camera.x +=
    (
      state.camera.target -
      state.camera.x
    ) *
      Math.min(
        1,
        dt * 4
      );

  state.camera.shake *=
    0.82;

  /* criaturas */

  for (
    const entity
    of state.entities
  ) {
    if (!entity.alive) {
      continue;
    }

    const distance =
      Math.abs(
        entity.x -
          p.x
      );

    const night =
      state.clock < 0.22 ||
      state.clock > 0.78;

    /* vagalumes aparecem à noite */

    if (
      (
        entity.type ===
          'firefly' ||
        entity.type ===
          'rare' ||
        entity.type ===
          'cavefly'
      ) &&
      !night &&
      state.map ===
        'forest'
    ) {
      entity.mode =
        'idle';

      continue;
    }

    /* criatura foge */

    if (
      distance < 150 &&
      entity.type !==
        'firefly' &&
      entity.type !==
        'rare' &&
      entity.type !==
        'cavefly'
    ) {
      entity.mode =
        'flee';

      const away =
        entity.x >= p.x
          ? 1
          : -1;

      const fleeSpeed =
        entity.type ===
          'lizard'
          ? 200
          : 110;

      entity.vx +=
        (
          away *
            fleeSpeed -
          entity.vx
        ) *
          dt *
          5;
    } else {
      entity.mode =
        'wander';

      entity.vx +=
        (
          Math.sin(
            state.t +
              entity.phase
          ) *
            35 -
          entity.vx
        ) *
          dt;
    }

    entity.x +=
      entity.vx *
      dt;

    entity.x =
      clamp(
        entity.x,
        20,
        maxX - 20
      );
  }

  /* pesca */

  if (state.fishing) {
    state.fishing.time -=
      dt;

    if (
      state.fishing.time <= 0 &&
      !state.fishing.ready
    ) {
      state.fishing.ready =
        true;

      notify(
        'A boia afundou! Aperte ESPAÇO!'
      );

      AudioManager.playSFX(
        'fish'
      );
    }

    if (
      state.fishing.ready &&
      state.fishing.time <
        -1.8
    ) {
      state.fishing = null;

      state.player.action =
        0;

      notify(
        'O peixe escapou. Tente de novo.'
      );
    }
  }

  /* viagem */

  if (state.travel) {
    state.travel -=
      dt;

    if (
      state.travel <
      0.65
    ) {
      addParticles(
        890,
        state.player.y,
        '#d9ded0',
        2
      );
    }

    if (
      state.travel <= 0
    ) {
      state.travel = 0;

      AudioManager.playSFX(
        'van-engine'
      );

      beginMap(
        'forest',
        170
      );
    }
  }

  /* partículas */

  for (
    let i =
      state.particles.length -
      1;

    i >= 0;

    i--
  ) {
    const particle =
      state.particles[i];

    particle.life -=
      dt;

    particle.x +=
      particle.vx *
      60 *
      dt;

    particle.y +=
      particle.vy *
      60 *
      dt;

    particle.vy +=
      1.2 * dt;

    if (
      particle.life <= 0
    ) {
      state.particles.splice(
        i,
        1
      );
    }
  }

  /* fade */

  if (state.fade.job) {
    state.fade.value +=
      dt * 1.9;

    if (
      state.fade.value >=
      1
    ) {
      const job =
        state.fade.job;

      state.fade.job =
        null;

      job();
    }
  } else if (
    state.fade.value > 0
  ) {
    state.fade.value -=
      dt * 1.9;

    if (
      state.fade.value < 0
    ) {
      state.fade.value = 0;
    }
  }
}

/* =========================================================
   RENDER
   ========================================================= */

function render() {
  ctx.save();

  /* camera shake */

  if (
    state.camera.shake > 0
  ) {
    ctx.translate(
      (Math.random() - 0.5) *
        state.camera.shake,

      (Math.random() - 0.5) *
        state.camera.shake
    );
  }

  sky();

  ground();

  /* VILA */

  if (
    state.map ===
    'village'
  ) {
    [
      130,
      280,
      780,
      1120
    ].forEach(
      (x, index) => {
        tree(
          x,
          320,
          index % 2
            ? 0.85
            : 1,
          index % 2
        );
      }
    );

    house();

    van();

    tito();

    for (
      let x = 80;
      x < 1180;
      x += 73
    ) {
      flower(
        x,
        544,
        x % 2
          ? '#f59b86'
          : '#f4d477'
      );
    }
  }

  /* FLORESTA */

  else if (
    state.map ===
    'forest'
  ) {
    [
      90,
      270,
      480,
      1120,
      1300,
      1500,
      1730,
      1920,
      2110
    ].forEach(
      (x, index) => {
        tree(
          x,
          315,
          0.75 +
            (index % 3) *
              0.17,
          index % 2
        );
      }
    );

    lake();

    caveEntrance();

    rocks(
      380,
      540,
      1
    );

    rocks(
      1180,
      550,
      0.8
    );

    rocks(
      1840,
      545,
      1.1
    );

    for (
      let x = 160;
      x < 2200;
      x += 87
    ) {
      flower(
        x,
        550,
        x % 2
          ? '#f0928d'
          : '#e6d46e'
      );
    }

    state.entities
      .filter(
        (entity) =>
          entity.alive
      )
      .forEach(
        creature
      );
  }

  /* CAVERNA */

  else if (
    state.map ===
    'cave'
  ) {
    caveWorld();

    state.entities
      .filter(
        (entity) =>
          entity.alive
      )
      .forEach(
        creature
      );
  }

  /* PLAYER */

  player();

  /* PARTICLES */

  for (
    const particle
    of state.particles
  ) {
    ctx.globalAlpha =
      Math.max(
        0,
        particle.life /
          particle.maxLife
      );

    ctx.fillStyle =
      particle.color;

    ctx.fillRect(
      wx(particle.x),
      particle.y,
      particle.size,
      particle.size
    );

    ctx.globalAlpha = 1;
  }

  /* iluminação da caverna */

  if (
    state.map ===
    'cave'
  ) {
    const x =
      wx(
        state.player.x
      );

    const radius =
      save.inventory.lantern
        ? 190
        : 110;

    ctx.save();

    ctx.fillStyle =
      '#071221dd';

    ctx.fillRect(
      0,
      0,
      W,
      H
    );

    ctx.globalCompositeOperation =
      'destination-out';

    const gradient =
      ctx.createRadialGradient(
        x,
        state.player.y,
        15,
        x,
        state.player.y,
        radius
      );

    gradient.addColorStop(
      0,
      '#000'
    );

    gradient.addColorStop(
      1,
      'transparent'
    );

    ctx.fillStyle =
      gradient;

    ctx.beginPath();

    ctx.arc(
      x,
      state.player.y,
      radius,
      0,
      Math.PI * 2
    );

    ctx.fill();

    ctx.restore();
  }

  ctx.restore();

  /* interação */

  const interactable =
    activeInteractable();

  if (ui.prompt) {
    ui.prompt.textContent =
      interactable
        ? '[E] ' +
          interactable.label
        : state.map ===
            'forest'
          ? '[ESPAÇO] usar rede'
          : 'Explore com calma';
  }

  if (interactable) {
    ctx.fillStyle =
      '#173f43dd';

    ctx.beginPath();

    ctx.roundRect(
      wx(interactable.x) -
        90,
      interactable.y -
        75,
      180,
      28,
      8
    );

    ctx.fill();

    txt(
      '[E] ' +
        interactable.label,
      wx(interactable.x),
      interactable.y - 56,
      11,
      '#fff8d7',
      'center'
    );
  }

  /* QUEST HUD */

  const currentQuest =
    quest();

  if (
    currentQuest.status ===
      'active' ||
    currentQuest.status ===
      'complete'
  ) {
    ctx.fillStyle =
      '#173f43dd';

    ctx.beginPath();

    ctx.roundRect(
      20,
      100,
      190,
      58,
      10
    );

    ctx.fill();

    txt(
      'MISSÃO · TITO',
      32,
      121,
      11,
      '#fbe7a7'
    );

    txt(
      currentQuest.status ===
        'complete'
        ? '✓ Volte para Tito'
        : 'Sapos: ' +
            currentQuest.progress +
            ' / 3',
      32,
      143,
      13,
      '#fff'
    );
  }

  /* fade */

  if (
    state.fade.value > 0
  ) {
    ctx.globalAlpha =
      Math.min(
        1,
        state.fade.value
      );

    ctx.fillStyle =
      '#102630';

    ctx.fillRect(
      0,
      0,
      W,
      H
    );

    ctx.globalAlpha = 1;
  }
}

/* =========================================================
   PAINÉIS
   ========================================================= */

function panel(kind) {
  if (!ui.panel) {
    return;
  }

  let body = '';

  if (
    kind ===
    'bag'
  ) {
    const entries = [
      ...Object.entries(
        save.inventory
      ),

      ...Object.entries(
        save.catches
      )
    ].filter(
      ([, amount]) =>
        amount > 0
    );

    body =
      entries.length
        ? entries
            .map(
              ([id, amount]) => {
                const displayName =
                  names[id] ||
                  itemNames[id] ||
                  id;

                return `
                  <div class="card">
                    <div>
                      <b>${displayName}</b>
                      <small>
                        Quantidade: ${amount}
                      </small>
                    </div>
                  </div>
                `;
              }
            )
            .join('')
        : `
          <p>
            A mochila está vazia.
          </p>
        `;

    ui.panel.innerHTML = `
      <button class="close">×</button>

      <h2 class="panel-title">
        Mochila
      </h2>

      <p class="panel-sub">
        Seus equipamentos e criaturas.
      </p>

      ${body}
    `;
  }

  if (
    kind ===
    'book'
  ) {
    body =
      Object.keys(names)
        .map(
          (id) => {
            const discovered =
              !!save.discovered[id];

            return `
              <div class="card">
                <div>
                  <b>
                    ${
                      discovered
                        ? names[id]
                        : '???'
                    }
                  </b>

                  <small>
                    ${
                      discovered
                        ? rarity[id]
                        : 'continue explorando'
                    }
                  </small>
                </div>
              </div>
            `;
          }
        )
        .join('');

    const discoveredCount =
      Object.keys(names)
        .filter(
          (id) =>
            save.discovered[id]
        ).length;

    ui.panel.innerHTML = `
      <button class="close">×</button>

      <h2 class="panel-title">
        Bestiário
      </h2>

      <p class="panel-sub">
        Descobertas:
        ${discoveredCount}/${Object.keys(names).length}
      </p>

      ${body}
    `;
  }

  if (
    kind ===
    'quest'
  ) {
    const q =
      quest();

    const progress =
      q.status === 'claimed'
        ? 3
        : q.progress;

    const percentage =
      Math.min(
        100,
        (progress / 3) *
          100
      );

    let statusText;

    if (
      q.status ===
      'available'
    ) {
      statusText =
        'Fale com Tito';
    } else if (
      q.status ===
      'claimed'
    ) {
      statusText =
        'Concluída';
    } else if (
      q.status ===
      'complete'
    ) {
      statusText =
        'Volte para Tito';
    } else {
      statusText =
        q.progress +
        ' / 3 sapos';
    }

    ui.panel.innerHTML = `
      <button class="close">×</button>

      <h2 class="panel-title">
        Missões
      </h2>

      <div class="card">
        <div>
          <b>
            ${QUESTS.tito_frogs.title}
          </b>

          <small>
            ${statusText}
          </small>

          <div class="bar">
            <i
              style="width:${percentage}%"
            ></i>
          </div>

          <small>
            Recompensa:
            50 moedas + 1 isca
          </small>
        </div>
      </div>
    `;
  }

  ui.panel.classList.remove(
    'hidden'
  );

  const close =
    ui.panel.querySelector(
      '.close'
    );

  if (close) {
    close.onclick = () => {
      ui.panel.classList.add(
        'hidden'
      );
    };
  }
}

/* =========================================================
   GAME LOOP
   ========================================================= */

let lastTime = 0;

function loop(now) {
  const dt =
    Math.min(
      0.033,
      (now - lastTime) /
        1000 ||
        0
    );

  lastTime = now;

  update(dt);

  render();

  requestAnimationFrame(
    loop
  );
}

/* =========================================================
   INPUT
   ========================================================= */

addEventListener(
  'keydown',
  (event) => {
    AudioManager.unlock();

    keys.add(
      event.key
    );

    if (
      [
        ' ',
        'ArrowLeft',
        'ArrowRight'
      ].includes(
        event.key
      )
    ) {
      event.preventDefault();
    }

    /* captura / pesca */

    if (
      event.key ===
      ' '
    ) {
      if (
        state.fishing?.ready
      ) {
        finishFishing();
      } else {
        capture();
      }
    }

    /* interação */

    if (
      event.key ===
        'e' ||
      event.key ===
        'E'
    ) {
      if (
        ui.dialog &&
        !ui.dialog.classList.contains(
          'hidden'
        )
      ) {
        return;
      }

      const interactable =
        activeInteractable();

      if (interactable) {
        interactable.onInteract();
      }
    }

    /* mochila */

    if (
      event.key ===
        'i' ||
      event.key ===
        'I'
    ) {
      panel('bag');
    }

    /* bestiário */

    if (
      event.key ===
        'b' ||
      event.key ===
        'B'
    ) {
      panel('book');
    }

    /* missões */

    if (
      event.key ===
        'm' ||
      event.key ===
        'M'
    ) {
      panel('quest');
    }

    /* avançar tempo */

    if (
      event.key ===
        'n' ||
      event.key ===
        'N'
    ) {
      state.clock =
        (state.clock +
          0.5) %
        1;

      notify(
        'O tempo avançou.'
      );
    }

    /* escape fecha interfaces */

    if (
      event.key ===
      'Escape'
    ) {
      closeDialog();

      if (ui.panel) {
        ui.panel.classList.add(
          'hidden'
        );
      }
    }
  }
);

addEventListener(
  'keyup',
  (event) => {
    keys.delete(
      event.key
    );
  }
);

/* =========================================================
   BOTÕES DA HUD
   ========================================================= */

document
  .querySelectorAll(
    '[data-panel]'
  )
  .forEach(
    (button) => {
      button.onclick =
        () => {
          panel(
            button.dataset.panel
          );
        };
    }
  );

/* botão de áudio */

if (ui.mute) {
  ui.mute.onclick =
    () => {
      AudioManager.unlock();
      AudioManager.toggle();
    };
}

/* canvas recebe foco */

canvas.onclick =
  () => {
    canvas.focus();
    AudioManager.unlock();
  };

/* =========================================================
   INICIALIZAÇÃO
   ========================================================= */

buildMap();

saveGame();

AudioManager.playMusic(
  state.map
);

AudioManager.playAmbient(
  state.map
);

requestAnimationFrame(
  loop
);
