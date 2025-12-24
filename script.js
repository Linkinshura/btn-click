// Cargar progreso
let clicks = Number(localStorage.getItem("clicks")) || 0;
let multiplicador = Number(localStorage.getItem("multiplicador")) || 1;
let autoClicks = Number(localStorage.getItem("autoClicks")) || 0;

let costoMulti = Number(localStorage.getItem("costoMulti")) || 20;
let costoAuto = Number(localStorage.getItem("costoAuto")) || 50;

// Elementos
const clicksSpan = document.getElementById("clicks");
const cpcSpan = document.getElementById("cpc");
const costoMultiSpan = document.getElementById("costoMulti");
const costoAutoSpan = document.getElementById("costoAuto");
const clickBtn = document.getElementById("clickBtn");

// Click manual
clickBtn.addEventListener("click", () => {
    clicks += multiplicador;
    guardar();
    actualizar();
});

// Comprar multiplicador
function comprarMultiplicador() {
    if (clicks >= costoMulti) {
        clicks -= costoMulti;
        multiplicador++;
        costoMulti += 20;
        guardar();
        actualizar();
    }
}

// Comprar autoclick
function comprarAutoClick() {
    if (clicks >= costoAuto) {
        clicks -= costoAuto;
        autoClicks++;
        costoAuto += 50;
        guardar();
        actualizar();
    }
}

// Autoclick cada segundo
setInterval(() => {
    clicks += autoClicks;
    guardar();
    actualizar();
}, 1000);

// Guardar progreso
function guardar() {
    localStorage.setItem("clicks", clicks);
    localStorage.setItem("multiplicador", multiplicador);
    localStorage.setItem("autoClicks", autoClicks);
    localStorage.setItem("costoMulti", costoMulti);
    localStorage.setItem("costoAuto", costoAuto);
}

// Actualizar pantalla
function actualizar() {
    clicksSpan.textContent = clicks;
    cpcSpan.textContent = multiplicador;
    costoMultiSpan.textContent = costoMulti;
    costoAutoSpan.textContent = costoAuto;
}

const guardarBtn = document.getElementById("guardarBtn");
const mensaje = document.getElementById("mensaje");

guardarBtn.addEventListener("click", () => {
    guardar();
    mensaje.textContent = "Progreso guardado ✅";

    setTimeout(() => {
        mensaje.textContent = "";
    }, 2000);
});


actualizar();
