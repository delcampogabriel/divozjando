// lineadinamica.js
class LineaDinamica {
  constructor(x, y, colorLinea = color(0)) {
    this.x = x;
    this.y = y;
    this.tamanio = 2500;   
    this.escala  = 0.12;
    this.miGrafico = createGraphics(this.tamanio, this.tamanio);
    this.miGrafico.colorMode(HSB, 360, 100, 100, 255);
    this.miGrafico.noFill();

    this.elColor = colorLinea;
    this.angulo  = random(TWO_PI);
    this.puntos  = [];

    this.crecerCada = 5;
    this.contador   = 0;

    //punto inicial en el centro
    let c = this.tamanio / 2;
    this.puntos.push({ x: c, y: c });
  }

  actualizar(intensidad) {
    this.intensidad = intensidad;
    let reps = floor(map(intensidad, 0, 1, 0, 5));
    reps = constrain(reps, 0, 5);
    if (reps === 0) return;

    for (let k = 0; k < reps; k++) {
      this.contador++;
      if (this.contador % this.crecerCada === 0) {
        let c    = this.tamanio / 2;
        let base = this.tamanio * 0.2;
        let ext  = this.tamanio * 0.1 * intensidad;
        let radio = random(base, base + ext);

        let x = c + radio * cos(this.angulo) + random(-200, 200);
        let y = c + radio * sin(this.angulo) + random(-200, 200);

        this.angulo += radians(random(-100, 200));

        this.puntos.push({ x, y });
        if (this.puntos.length > 10) this.puntos.shift();

        this._dibujarCurva();
      }
    }
  }

  _dibujarCurva() {
    let g = this.miGrafico;
    let c = this.tamanio / 2;
    g.clear();

    //1)trazo negro base
    g.stroke(0, 95);
    g.strokeWeight(12);
    g.beginShape();
    for (let p of this.puntos) {
      g.curveVertex(p.x, p.y);
    }
    g.endShape();

    // 2)trazo color random
    let hueR      = random(360);
    let alphaR    = map(this.intensidad, 0, 1, 50, 120);
    let angleOff  = radians(random(-45, 45));
    let jitterC   = 0;

    g.stroke(hueR, 100, 100, alphaR);
    g.strokeWeight(30);
    g.beginShape();
    for (let p of this.puntos) {
      let dx = p.x - c, dy = p.y - c;
      //rotación simple
      let xr = dx * cos(angleOff) - dy * sin(angleOff);
      let yr = dx * sin(angleOff) + dy * cos(angleOff);
      //vplver al centro
      let xc = c + xr;
      let yc = c + yr;
      g.curveVertex(xc, yc);
    }
    g.endShape();

    // 3)trazo blanco expandido
    let jitterW = map(this.intensidad, 0, 1, 10, 50);
    let factor  = map(this.intensidad, 0, 1, 2.0, 1.0);

    g.stroke(255, 99);
    g.strokeWeight(7);
    g.noFill();
    g.beginShape();
    for (let p of this.puntos) {
      let dx = p.x - c, dy = p.y - c;
      let xw = c + (-dy) * factor + random(-jitterW, jitterW);
      let yw = c + ( dx) * factor + random(-jitterW, jitterW);
      g.curveVertex(xw, yw);
    }
    g.endShape();
  }

  dibujar() {
    push();
    imageMode(CENTER);
    translate(this.x, this.y);
    scale(this.escala);
    image(this.miGrafico, 0, 0);
    pop();
  }
}
