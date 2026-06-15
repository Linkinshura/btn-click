/* ── ITEMS DE LA TIENDA ── */
const ITEMS = {
  finger: { clickPower: 2,  cps: 0,   baseCost: 10,   mult: 1.5 },
  cursor: { clickPower: 10, cps: 0,   baseCost: 80,   mult: 1.6 },
  robot:  { clickPower: 0,  cps: 3,   baseCost: 50,   mult: 1.5 },
  mine:   { clickPower: 0,  cps: 20,  baseCost: 400,  mult: 1.6 },
  rocket: { clickPower: 0,  cps: 100, baseCost: 2000, mult: 1.7 },
};

/* ── ESTADO EN MEMORIA (sin localStorage) ── */
const state = {
  coins:  0,
  total:  0,
  owned:  { finger: 0, cursor: 0, robot: 0, mine: 0, rocket: 0 },
};

/* ── HELPERS ── */
function cost(id) {
  return Math.floor(ITEMS[id].baseCost * Math.pow(ITEMS[id].mult, state.owned[id]));
}

function clickPower() {
  let p = 1;
  for (const id in ITEMS) p += ITEMS[id].clickPower * state.owned[id];
  return p;
}

function cps() {
  let c = 0;
  for (const id in ITEMS) c += ITEMS[id].cps * state.owned[id];
  return c;
}

function fmt(n) {
  n = Math.floor(n);
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000)     return (n / 1_000).toFixed(1) + 'K';
  return n.toString();
}

/* ── ACTUALIZAR UI ── */
function render() {
  document.getElementById('coin-count').textContent  = fmt(state.coins);
  document.getElementById('cpc-display').textContent = fmt(clickPower());
  document.getElementById('cps-display').textContent = fmt(cps());
  document.getElementById('total-display').textContent = fmt(state.total);

  for (const id in ITEMS) {
    const el = document.querySelector(`[data-id="${id}"]`);
    el.querySelector('.cost-val').textContent  = fmt(cost(id));
    el.querySelector('.owned-val').textContent = state.owned[id];
    el.classList.toggle('locked', state.coins < cost(id));
  }
}

/* ── BOTÓN PRINCIPAL ── */
document.getElementById('main-btn').addEventListener('click', function(e) {
  const earned = clickPower();
  state.coins += earned;
  state.total += earned;
  render();
  spawnFX(e, earned);
});

function spawnFX(e, amount) {
  const layer = document.getElementById('fx-layer');
  const rect  = layer.getBoundingClientRect();
  const fx    = document.createElement('div');
  fx.className   = 'fx';
  fx.textContent = '+' + fmt(amount);
  const x = (e.clientX - rect.left) + (Math.random() - 0.5) * 40;
  const y = (e.clientY - rect.top)  - 10;
  fx.style.left = x + 'px';
  fx.style.top  = y + 'px';
  layer.appendChild(fx);
  setTimeout(() => fx.remove(), 720);
}

/* ── TIENDA ── */
document.querySelector('.shop-list').addEventListener('click', function(e) {
  const item = e.target.closest('.shop-item');
  if (!item) return;

  const id = item.dataset.id;
  const c  = cost(id);
  if (state.coins < c) return;

  state.coins -= c;
  state.owned[id]++;
  render();

  item.classList.remove('bought');
  void item.offsetWidth;
  item.classList.add('bought');

  toast('¡' + item.querySelector('.s-name').textContent + ' comprado!');
});

/* ── AUTO CPS ── */
setInterval(function() {
  const gain = cps() * 0.1;
  if (gain === 0) return;
  state.coins += gain;
  state.total += gain;
  render();
}, 100);

/* ── TOAST ── */
let toastTimer;
function toast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 1800);
}

/* ── REINICIAR ── */
document.getElementById('btn-reset').addEventListener('click', function() {
  if (!confirm('¿Reiniciar todo el progreso?')) return;
  state.coins = 0;
  state.total = 0;
  for (const id in state.owned) state.owned[id] = 0;
  render();
  toast('Progreso reiniciado');
});

/* ── INICIO ── */
render();
