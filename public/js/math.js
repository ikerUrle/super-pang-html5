class Vec2D {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    get(target, prop) {
        return this[prop] || 'MAGIC';
    }

    add(other) {
        
        if (other instanceof Vec2D){
            this.x += other.x;
            this.y += other.y;
        } else{
            this.x += other;
            this.y += other;
        }

        return this;
        // si other es una instancia de Vec2D
        // anyadir other a this como vector
        // si no, 
        // anyadir other a this como escalar
        //
        // devolver this


    }

    _mul(other) {

        return new Vec2D(this.x*other,this.y*other);
        // devolver un nuevo vector igual a 
        // this multiplicado por el escalar other

    }

    equals(other) {
        // devuelve true si this es aproximadamente igual a other (igual con una diferencia máxima de epsilon=0.1
        return approx_equal(this,other,0.1);
    }

    static approx_equal(a, b, epsilon) {
        // devuelve true si a aprox. igual a b
        // iguales salvo una diferencia absoluta
        // máxima de epsilon
        return a == b ? true : Math.abs(a-b) < epsilon;  //Esta funcion puede que no sirva
    }
}

// clase Object2D. Representa un objeto 2D caracterizado por un vector size
// (diagonal del rectángulo que circunscribe el objeto) y una posición
// superior izquierda x,y.

class Object2D {

    constructor(size, position) {
        this.size = size;
        this.position = position;
    }

    get x() {
        return this.position.x;
    }

    get y() {
        return this.position.y;
    }

    get width() {
        return this.size.x;
    }

    get height() {
        return this.size.y;
    }

}

export {
    Object2D,
    Vec2D
};