class Paleta{

    constructor( nombre ){
        this.imagen = loadImage(nombre);
    }

darColor(alfa = 230) { 
  colorMode(RGB, 255);
        let x = int( random( this.imagen.width ));
        let y = int( random( this.imagen.height ));
        let elColor = this.imagen.get( x , y );
        elColor = color( red(elColor) , green(elColor) , blue(elColor) , alfa );
        return elColor;
    }
}