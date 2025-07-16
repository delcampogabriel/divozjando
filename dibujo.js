class Dibujo {
  constructor(yLimite) {
    this.yLimite      = yLimite;
    this.manchas      = [];
    this.lineas       = [];
    this.totalManchas = 0;
    this.brushStrokes  = [];
    this.maxStrokes   = 250;    

    for (let i = 0; i < 5; i++) {
      let x = map(i, 0, 4, 50, width - 50);
      this.lineas.push(new LineaDinamica(x, yLimite, color(0, 0, 0, 80)));
      this.lineas.push(new LineaDinamica(x, yLimite, color(0, 0, 0, 80)));
    }
  }

mostrarParcial(pasos, transicion, arriba, transicionArriba, intensidad) {
  noTint();

  if (pasos > this.totalManchas) {
    let nuevas = pasos - this.totalManchas;
    this.generarManchas(nuevas, transicion);
    this.totalManchas = pasos;
  }
  for (let m of this.manchas) {
    m.actualizar(arriba, transicion, transicionArriba);
    colorMode(HSB, 360, 100, 100, 255);
    m.dibujar();
  }

  let n = min(this.brushStrokes.length, this.maxStrokes);
  for (let i = 0; i < n; i++) {
    let b = this.brushStrokes[i];
  push();
    tint(b.col);             
    translate(b.x, b.y);
    rotate(b.ang);
    scale(b.sc);
    image(pinceladas[b.cual], 0, 0);
  pop();
}

if (intensidad > umbral && this.brushStrokes.length < this.maxStrokes) {
    let canGen = min(1, this.maxStrokes - this.brushStrokes.length);
    for (let i = 0; i < canGen; i++) {
      let cual = int(random(cantidad));
      let x, y, pix;
      do {
        x = random(10, width - 10);
        y = random(10, height - 10);
        let xi = int(map(x, 0, width, 0, elefante.width));
        let yi = int(map(y, 0, height, 0, elefante.height));
        pix   = elefante.get(xi, yi);
      } while (!(red(pix) === 0 && green(pix) === 0 && blue(pix) === 0));

    //calcula transformaciones y color UNA VEZ
    let ang = radians(map(x, 0, width, 0, 90));
    let sc  = random(0.2, 0.5);

    if (intensidad > barrera) {
     pal = paleta[0]; // elige entre paleta[0] o paleta[1]
    }
    if (intensidad < barrera) {
     pal = paleta[1]; // elige entre paleta[0] o paleta[1]
    }

    let col = pal.darColor();

    push();
      tint(col);
      translate(x, y);
      rotate(ang);
      scale(sc);
      image(pinceladas[cual], 0, 0);
    pop();
    //almacena usando esas mismas propiedades
    this.brushStrokes.push({ x, y, cual, ang, sc, col });
  }
}

    //3)( líneas dinámicas encima
    for (let l of this.lineas) {
      if (intensidad > umbral) l.actualizar(intensidad);
      l.dibujar();
    }
  }

  generarManchas(cantidad, transicion) {
    for (let i = 0; i < cantidad; i++) {
      let x = random(width);
      let y = random(this.yLimite + 1, height + 100);
      let r = random(40, 50);
      let azul = color('#04678C'), verde = color('#A7BD03');
      let cF = lerpColor(azul, verde, transicion);
      let h = hue(cF), s = saturation(cF), b = brightness(cF);
      let a = random(12, 100);
      this.manchas.push(new Mancha(x, y, r, h, s, b, a));
    }
  }

  textura(arriba) {
    for (let i = 0; i < 300; i++) {
      stroke(210, 80, 40, 20);
      strokeWeight(1);
      let yBase = arriba ? 0 : this.yLimite + 1;
      let yTop  = arriba ? this.yLimite - 1 : height;
      point(random(width), random(yBase, yTop));
    }
  }
}
