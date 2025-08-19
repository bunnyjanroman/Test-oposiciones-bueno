let preguntas = [];
let seleccionadas = [];
let indice = 0;
let puntuacion = 0;
let config = { acierto: 1, error: -0.5 };
let historial = {};

async function cargarPreguntas() {
  let resp = await fetch("preguntas.json");
  preguntas = await resp.json();

  // Inicializar pesos
  preguntas.forEach(p => p.peso = 1);
}

function elegirPregunta() {
  let total = preguntas.reduce((a,p)=>a+p.peso,0);
  let r = Math.random() * total;
  let suma = 0;
  for (let p of preguntas) {
    suma += p.peso;
    if (r <= suma) return p;
  }
}

function iniciarTest() {
  config.acierto = parseFloat(document.getElementById("puntosAcierto").value);
  config.error = parseFloat(document.getElementById("puntosError").value);
  let n = parseInt(document.getElementById("numPreguntas").value);

  seleccionadas = [];
  for (let i=0; i<n; i++) {
    seleccionadas.push(elegirPregunta());
  }

  indice = 0;
  puntuacion = 0;
  document.getElementById("config").classList.add("hidden");
  document.getElementById("quiz").classList.remove("hidden");
  mostrarPregunta();
}

function mostrarPregunta() {
  let quiz = document.getElementById("quiz");
  if (indice >= seleccionadas.length) {
    quiz.classList.add("hidden");
    mostrarResultado();
    return;
  }
  let p = seleccionadas[indice];
  quiz.innerHTML = `
    <div class="pregunta">
      <b>${p.texto}</b>
      <div id="opciones"></div>
    </div>
  `;
  let opcionesDiv = document.getElementById("opciones");
  p.opciones.forEach(op => {
    let btn = document.createElement("button");
    btn.innerText = op;
    btn.onclick = ()=>respuesta(p, op);
    opcionesDiv.appendChild(btn);
  });
}

function respuesta(p, opcion) {
  if (opcion === p.correcta) {
    alert("✅ Correcto!");
    puntuacion += config.acierto;
    p.peso = Math.max(1, p.peso - 1);
  } else {
    alert("❌ Incorrecto...");
    puntuacion += config.error;
    p.peso += 2;
  }
  indice++;
  mostrarPregunta();
}

function mostrarResultado() {
  let res = document.getElementById("resultado");
  res.classList.remove("hidden");
  res.innerHTML = `<h2>Resultado final: ${puntuacion} puntos</h2>
                   <button onclick="location.reload()">Nuevo Test</button>`;
}

cargarPreguntas();
