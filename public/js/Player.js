import {Object2D, Vec2D} from "./math.js";
import Settings from "./Settings.js";

export default class Player extends Object2D {

    constructor(size, pos, sprite) {
        super(size, pos);
        this.force = new Vec2D(0, 0);
        this.sprite = sprite;
        this.direction = new Vec2D(0,0);
        this.distance = 0;
    }

    // time respresenta el tiempo que ha pasado desde la última ejecución
    update(time) {

        if(this.direction.x !== 0){
            this.distance += Settings.PLAYER_SPEED * time;
        } else{
            this.distance = 0;
        }

        /*
        Asume por el momento que Settings.SCREEN_HEIGHT y Settings.SCREEN_WIDTH indican el tamaño de
        la pantalla del juego. Settings tiene otras constantes definidas (échales un vistazo)
        El objeto player tiene una altura (height) y una anchura (width) 
         */


        if (this.y < Settings.SCREEN_HEIGHT-this.height){
            this.force = this.force.add(Settings.GRAVITY * time); 
            this.position = this.position.add(new Vec2D(0,this.force.y * time));
            
        }
        
        this.position = this.position.add(new Vec2D(this.direction.x * time * Settings.PLAYER_SPEED,0));
       
        // si buster está cayendo (está por debajo de la altura de la pantalla) 
        // fuerza = añadir fuerza vertical de gravedad * tiempo
        // position = añadir fuerza * tiempo al eje y

        // position = añadir dirección * tiempo * velocidad del jugador al eje x
        if (this.x < 0){
            this.position = new Vec2D(0,this.y);
        } else if(this.x > Settings.SCREEN_WIDTH - this.width){
            this.position = new Vec2D(Settings.SCREEN_WIDTH - this.width, this.y);
        } 
      


        // si buster se sale por la izquierda de la pantalla
        // position = 0,y
      
        // sino, si buster se sale por la derecha
        // position =  lo más a la derecha sin salirse , y    
      
        if(this.y > Settings.SCREEN_HEIGHT){
            this.position = new Vec2D(this.x,Settings.SCREEN_HEIGHT);
        }

        // si buster se sale por la parte inferior de la pantalla
        // position = x, lo más abajo sin salirse
      
    }

    draw(context) {
        context.drawImage(this.sprite,this.x,this.y);
        // pintar this.sprite en el contexto (en posicion x,y)
    }
}