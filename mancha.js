class Mancha {
  constructor(x, y, r, h, s, b, a, colorFijo = false) {
    this.x = x;
    this.y = y;
    this.yBase = y;
    this.r = r;
    this.h = h;
    this.s = s;
    this.b = b;
    this.a = a;
    this.colorFijo = colorFijo;
    this.direccion = 1;

    this.puntos = [];
    let anguloOffset = random(TWO_PI);
    for (let a = 0; a < TWO_PI; a += 0.3) {
      let rx = this.r * cos(a) + random(-3, 3);
      let ry = this.r * sin(a) + random(-3, 3);
      this.puntos.push({ x: rx, y: ry });
    }
    this.angulo = anguloOffset;
  }

  invertirDireccion(yLinea, arriba) {
    this.direccion = arriba ? -1 : 1;
    if (arriba) {
      this.y = yLinea - abs(this.yBase - yLinea);
    } else {
      this.y = this.yBase;
    }
  }

  actualizar(arriba, transicion, transicionArriba) {
    if (this.colorFijo) return;

    if (!arriba) {
      // azul-verde
      let azul = color('#04678C');
      let verde = color('#A7BD03');
      let c = lerpColor(azul, verde, transicion);
      this.h = hue(c);
      this.s = saturation(c);
      this.b = brightness(c);
    } else {
      // rojo-gris
      let rojo = color('#AD1917');
      let gris = color('#68737F');
      let c = lerpColor(rojo, gris, transicionArriba);
      this.h = hue(c);
      this.s = saturation(c);
      this.b = brightness(c);
    }
  }

  dibujar() {
    noStroke();
    fill(this.h, this.s, this.b, this.a);
    push();
    translate(this.x, this.y);
    rotate(this.angulo);
    beginShape();
    for (let p of this.puntos) {
      vertex(p.x, p.y);
    }
    endShape(CLOSE);
    pop();
  }
}
