// gestor.js
class GestorSenial {
  constructor(min, max) {
    this.min = min;
    this.max = max;
    this.valor = 0;
    this.filtrada = 0;
  }

  actualizar(nuevoValor) {
    this.valor = map(nuevoValor, this.min, this.max, 0, 1);
    this.valor = constrain(this.valor, 0, 1);
    this.filtrada = this.filtrada * 0.9 + this.valor * 0.1;
  }
}