/* ── DEFINICIÓN DE ITEMS DE LA TIENDA ── */
const SHOP_ITEMS = {
  // Mejoras de clic (clickPower)
  finger:  { baseCost: 10,    costMult: 1.5,  clickPower: 1,   cps: 0   },
  glove:   { baseCost: 75,    costMult: 1.6,  clickPower: 5,   cps: 0   },
  cursor:  { baseCost: 400,   costMult: 1.7,  clickPower: 25,  cps: 0   },
  // Generadores (cps = coins per second)
  robot:   { baseCost: 50,    costMult: 1.5,  clickPower: 0,   cps: 1   },
  factory: { baseCost: 300,   costMult: 1.55, clickPower: 0,   cps: 8   },
  mine:    { baseCost: 1200,  costMult: 1.6,  clickPower: 0,   cps: 30  },
  rocket:  { baseCost: 6000,  costMult: 1.65, clickPower: 0,   cps: 150 },
  portal:  { baseCost: 30000, costMult: 1.7,  clickPower: 0,   cps: 800 },
};

/* ── ESTADO ── */
let state = loadState();

/* ── DOM ── */
const coinCountEl  = document.getElementById('coin-count');
const cpsDisplay   = document.getElementById('cps-display');
const cpcDisplay   = document.getElementById('cpc-display');
const totalDisplay = document.getElementById('total-display');
const mainBtn      = document.getElementById('main-btn');
const fxContainer  = document.getElementById('click-fx-container');
const toastEl      = document.getElementById('toast');
let toastTimer     = null;


function defaultState() {
  return {
    coins: 0,
    totalEarned: 0,
    owned: { finger:0, glove:0, cursor:0, robot:0, factory:0, mine:0, rocket:0, portal:0 },
  };
}

function loadState() {
  try {
    const saved = localStorage.getItem('clicker-save');
    if (saved) return JSON.parse(saved);
  } catch(e) {}
  return defaultState();
}

function saveState() {
  try { localStorage.setItem('clicker-save', JSON.stringify(state)); } catch(e) {}
}


function currentCost(id) {
  const item = SHOP_ITEMS[id];
  return Math.floor(item.baseCost * Math.pow(item.costMult, state.owned[id]));
}

function totalClickPower() {
  let power = 1;
  for (const id of Object.keys(SHOP_ITEMS)) {
    power += SHOP_ITEMS[id].clickPower * state.owned[id];
  }
  return power;
}

function totalCPS() {
  let cps = 0;
  for (const id of Object.keys(SHOP_ITEMS)) {
    cps += SHOP_ITEMS[id].cps * state.owned[id];
  }
  return cps;
}


function formatNum(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000)     return (n / 1_000).toFixed(1) + 'K';
  return Math.floor(n).toString();
}

function updateHUD() {
  coinCountEl.textContent  = formatNum(state.coins);
  cpsDisplay.textContent   = formatNum(totalCPS());
  cpcDisplay.textContent   = formatNum(totalClickPower());
  totalDisplay.textContent = formatNum(state.totalEarned);
}

function updateShop() {
  for (const id of Object.keys(SHOP_ITEMS)) {
    const el       = document.getElementById(`item-${id}`);
    const cost     = currentCost(id);
    const costEl   = el.querySelector('.cost-val');
    const ownedEl  = el.querySelector('.owned-val');

    costEl.textContent  = formatNum(cost);
    ownedEl.textContent = state.owned[id];

    if (state.coins < cost) {
      el.classList.add('disabled');
    } else {
      el.classList.remove('disabled');
    }
  }
}

function updateAll() {
  updateHUD();
  updateShop();
}


mainBtn.addEventListener('click', (e) => {
  const earned = totalClickPower();
  state.coins       += earned;
  state.totalEarned += earned;
  saveState();
  updateAll();
  spawnClickFX(e, earned);
});

function spawnClickFX(e, amount) {
  const fx = document.createElement('div');
  fx.className = 'click-fx';
  fx.textContent = `+${formatNum(amount)}`;

  // Posición aleatoria alrededor del centro
  const offsetX = (Math.random() - 0.5) * 80;
  const offsetY = (Math.random() - 0.5) * 40 - 20;
  fx.style.left = `calc(50% + ${offsetX}px)`;
  fx.style.top  = `calc(50% + ${offsetY}px)`;

  fxContainer.appendChild(fx);
  setTimeout(() => fx.remove(), 800);
}


document.getElementById('shop-list').addEventListener('click', (e) => {
  const itemEl = e.target.closest('.shop-item');
  if (!itemEl) return;

  const id   = itemEl.dataset.id;
  const cost = currentCost(id);

  if (state.coins < cost) return;

  state.coins -= cost;
  state.owned[id]++;
  saveState();
  updateAll();

  // Animación de compra
  itemEl.classList.remove('pulse');
  void itemEl.offsetWidth; // reflow para reiniciar animación
  itemEl.classList.add('pulse');

  showToast(`¡${itemEl.querySelector('.item-name').textContent} comprado!`);
});


const CPS_TICK = 100; // ms entre ticks

setInterval(() => {
  const cps = totalCPS();
  if (cps === 0) return;

  const earned = cps * (CPS_TICK / 1000);
  state.coins       += earned;
  state.totalEarned += earned;
  saveState();
  updateAll();
}, CPS_TICK);


function showToast(msg) {
  toastEl.classList.remove('hidden');
  toastEl.textContent = msg;
  void toastEl.offsetWidth;
  toastEl.classList.add('show');

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastEl.classList.remove('show');
    setTimeout(() => toastEl.classList.add('hidden'), 250);
  }, 1800);
}


document.getElementById('btn-reset').addEventListener('click', () => {
  if (!confirm('¿Seguro que quieres reiniciar todo el progreso?')) return;
  state = defaultState();
  saveState();
  updateAll();
  showToast('Progreso reiniciado');
});
 */

updateAll();
