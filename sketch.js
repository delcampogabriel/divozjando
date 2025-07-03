//FONDO + IMPLEMENTACION DE LINEAS + ROMBO
let fondoImg;

let mic, audioContext, pitch;
let fft;
let gestorI, gestorPitch;

let minimoI = 0.009;
let maximoI = 0.5;
let minNota = 40;
let maxNota = 74;

let umbral = 0.009;  
let model_url = 'https://cdn.jsdelivr.net/gh/ml5js/ml5-data-and-models/models/pitch-detection/crepe/';

let pasosActuales = 0;
let pasosMaximos  = 300;
let tiempoHablando = 0;
let tiempoParaVerde = 50; 
let transicion = 0; 
let transicionArriba = 0; 
let intensidad;

let yLinea;
let dibujo;

let pinceladas = [];
let cantidad = 3;
let margen   = 130;

let elefante;
let Z;
let paleta;

let modoArriba   = false; 
let cambioHecho  = false; 
let IMPRIMIR = true;

function preload() {
  fondoImg = loadImage('img/background.png');  
  paleta = new Paleta("img/pruebacolor.png");

  Z = random([1, 2, 3, 4]);

  let nombrepincelada = "img/elefante" + Z + ".png";
  elefante = loadImage( nombrepincelada );

  for( let i=0 ; i<cantidad ; i++ ){
    let nombre = "img/manchaaa"+nf( i , 2 )+".png";
    pinceladas[i] = loadImage( nombre );
  }
}

function setup() {
  createCanvas(439, 444);
  colorMode(HSB, 360, 100, 100, 255);
  noStroke();
  imageMode(CENTER);
  elefante.resize(width, height);

  yLinea = height / 2 + height * 0.06;
  dibujo = new Dibujo(yLinea);

  gestorI      = new GestorSenial(minimoI, maximoI);
  gestorPitch  = new GestorSenial(minNota, maxNota);

  userStartAudio();
  audioContext = getAudioContext();
  mic = new p5.AudioIn();
  mic.start(() => {
    startPitch();
    fft = new p5.FFT();
    fft.setInput(mic);
  });
}

function draw() {
  //1)fondo y línea central
  imageMode(CENTER);
  image(fondoImg, width/2, height/2, width, height);
  drawLinea();

  //2)detecto audio y filtro
  intensidad = mic.getLevel();
  gestorI.actualizar(intensidad);
  let haySonido = gestorI.filtrada > umbral;

  //3)lógica de cambio de modo y conteo de pasos
  if (haySonido) {
    if (!cambioHecho) {
      toggleModo();
      cambioHecho = true;
    }
    tiempoHablando++;
    if (pasosActuales < pasosMaximos) {
      pasosActuales += 20;
    }
  } else {
    tiempoHablando = 0;
    cambioHecho   = false;
  }

  //4)actualizo transiciones de color
  if (!modoArriba) {
    transicion = lerp(transicion,
                      tiempoHablando > tiempoParaVerde ? 1 : 0,
                      0.03);
    transicionArriba = 0;
  } else {
    transicionArriba = lerp(transicionArriba, 1, 0.05);
    transicion = 0;
  }

  //5)dibujA manchas + líneas dinámicas  
  dibujo.mostrarParcial(
    pasosActuales,
    transicion,
    modoArriba,
    transicionArriba,
    gestorI.filtrada
  );

  if (IMPRIMIR){
    printData();
  }
}

function drawLinea() {
  stroke('#CBCCD0');
  strokeWeight(0);
  line(0, yLinea, width, yLinea);
}

function detectarAplauso() {
  if (!fft) return;

  let energiaMedia = fft.getEnergy("mid");
  let energiaAlta = fft.getEnergy("highMid");
  let energiaTotal = energiaMedia + energiaAlta;

  let ahora = millis();
  let pico = energiaTotal - energiaAnterior;

  if (
    pico > 50 &&
    energiaTotal > 150 &&
    ahora - tiempoUltimoAplauso > tiempoEntreAplausos
  ) {
    toggleModo();
    tiempoUltimoAplauso = ahora;
  }

  energiaAnterior = energiaTotal;
}
 function toggleModo() {
  modoArriba = !modoArriba; 
  transicionArriba = 0; 

  for (let m of dibujo.manchas) {
    m.invertirDireccion(yLinea, modoArriba);
  }
}

//pitchs
function startPitch() {
  pitch = ml5.pitchDetection(model_url, audioContext, mic.stream, modelLoaded);
}

function modelLoaded() {
  getPitch();
}

function getPitch() {
  pitch.getPitch(function (err, frequency) {
    if (frequency) {
      let nota = freqToMidi(frequency);
      gestorPitch.actualizar(nota);
    }
    getPitch();
  });
}

function freqToMidi(freq) {
  return 69 + 12 * Math.log2(freq / 440);
}
function printData() {
  background(255);
  push();
  textSize(16);
  fill(0);
  let texto;
  texto = 'amplitud:' + intensidad;
  text(texto, 20, 20);
  fill(0);
  ellipse(width/2, height-intensidad * 1000, 30, 30 );
  pop();
}
