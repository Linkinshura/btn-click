// ── CARGAR PROGRESO ──
let clicks        = Number(localStorage.getItem("clicks"))       || 0;
let multiplicador = Number(localStorage.getItem("multiplicador")) || 1;
let autoClicks    = Number(localStorage.getItem("autoClicks"))    || 0;
let costoMulti    = Number(localStorage.getItem("costoMulti"))   || 20;
let costoAuto     = Number(localStorage.getItem("costoAuto"))    || 50;
let ownedMulti    = Number(localStorage.getItem("ownedMulti"))   || 0;
let ownedAuto     = Number(localStorage.getItem("ownedAuto"))    || 0;

// ── ELEMENTOS ──
const clicksSpan    = document.getElementById("clicks");
const cpcSpan       = document.getElementById("cpc");
const autoDisplay   = document.getElementById("autoDisplay");
const costoMultiSpan= document.getElementById("costoMulti");
const costoAutoSpan = document.getElementById("costoAuto");
const ownedMultiSpan= document.getElementById("ownedMulti");
const ownedAutoSpan = document.getElementById("ownedAuto");
const clickBtn      = document.getElementById("clickBtn");
const fxLayer       = document.getElementById("fxLayer");
const guardarBtn    = document.getElementById("guardarBtn");
const mensaje       = document.getElementById("mensaje");

// ── CLICK MANUAL ──
clickBtn.addEventListener("click", (e) => {
    clicks += multiplicador;
    guardar();
    actualizar();
    spawnFX(e, multiplicador);
});

function spawnFX(e, amount) {
    const fx   = document.createElement("div");
    fx.className   = "fx";
    fx.textContent = "+" + amount;
    const rect = fxLayer.getBoundingClientRect();
    const x = (e.clientX - rect.left) + (Math.random() - 0.5) * 50;
    const y = (e.clientY - rect.top)  - 10;
    fx.style.left = x + "px";
    fx.style.top  = y + "px";
    fxLayer.appendChild(fx);
    setTimeout(() => fx.remove(), 720);
}

// ── COMPRAR MULTIPLICADOR ──
function comprarMultiplicador() {
    if (clicks < costoMulti) return;
    clicks -= costoMulti;
    multiplicador++;
    ownedMulti++;
    costoMulti += 20;
    guardar();
    actualizar();
}

// ── COMPRAR AUTOCLICK ──
function comprarAutoClick() {
    if (clicks < costoAuto) return;
    clicks -= costoAuto;
    autoClicks++;
    ownedAuto++;
    costoAuto += 50;
    guardar();
    actualizar();
}

// ── AUTO CLICK CADA SEGUNDO ──
setInterval(() => {
    if (autoClicks === 0) return;
    clicks += autoClicks;
    guardar();
    actualizar();
}, 1000);

// ── GUARDAR EN LOCALSTORAGE ──
function guardar() {
    localStorage.setItem("clicks",        clicks);
    localStorage.setItem("multiplicador", multiplicador);
    localStorage.setItem("autoClicks",    autoClicks);
    localStorage.setItem("costoMulti",    costoMulti);
    localStorage.setItem("costoAuto",     costoAuto);
    localStorage.setItem("ownedMulti",    ownedMulti);
    localStorage.setItem("ownedAuto",     ownedAuto);
}

// ── ACTUALIZAR PANTALLA ──
function actualizar() {
    clicksSpan.textContent     = clicks;
    cpcSpan.textContent        = multiplicador;
    autoDisplay.textContent    = autoClicks;
    costoMultiSpan.textContent = costoMulti;
    costoAutoSpan.textContent  = costoAuto;
    ownedMultiSpan.textContent = ownedMulti;
    ownedAutoSpan.textContent  = ownedAuto;

    // Bloquear botones de tienda si no hay fondos
    const [btnMulti, btnAuto] = document.querySelectorAll(".tienda button");
    btnMulti.classList.toggle("locked", clicks < costoMulti);
    btnAuto.classList.toggle("locked",  clicks < costoAuto);
}

// ── BOTÓN GUARDAR ──
let msgTimer;
guardarBtn.addEventListener("click", () => {
    guardar();
    mensaje.textContent = "Progreso guardado ✅";
    clearTimeout(msgTimer);
    msgTimer = setTimeout(() => { mensaje.textContent = ""; }, 2000);
});

// ── INICIO ──
actualizar();
