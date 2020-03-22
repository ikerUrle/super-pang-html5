import {Vec2D,Object2D} from './math.js';
import Settings from './Settings.js';

class Ball extends Object2D {

    constructor(radius, position, force) {
        super(new Vec2D(radius * 2, radius * 2), position);
        this.radius = radius;
        this.position = position;
        this.force = force;
        this.falling = this.force.y >= 0;
        this.max_height = Settings.SCREEN_HEIGHT - 150 - radius * 4;
    }

    update(time_passed) {

        var  gravity = 0.1,
        damping = 0.9,
        traction = 0.8
        // this.force.add(new Vec2D(0, Settings.GRAVITY * time_passed));
        // this.position.add(this.force._mul(time_passed));

        // if (this.x < this.radius || this.x > Settings.SCREEN_WIDTH - this.radius) {
        //     this.force = new Vec2D(-this.force.x, this.force.y);

        //     if (this.x < this.radius)
        //         this.position = new Vec2D(2 * this.radius - this.x, this.y);
        //     else
        //         this.position = new Vec2D(2 * (Settings.SCREEN_WIDTH - this.radius) - this.x, this.y);
        // }
        // if (this.y > Settings.SCREEN_HEIGHT - this.radius) {
        //     this.position = new Vec2D(this.x, 2 * (Settings.SCREEN_HEIGHT - this.radius) - this.y);
        //     this.force = new Vec2D(this.force.x, -(((this.y - this.max_height) * 2 * Settings.GRAVITY) ** .5));
        // }

        // this.falling = this.force.y > 0;

        //////////////////////////

        if (this.x + this.radius >= Settings.SCREEN_WIDTH) {
            this.force = new Vec2D(-this.force.x * damping,this.force.y);
            this.position = new Vec2D(Settings.SCREEN_WIDTH - this.radius,this.position.y);
          } else if (this.x - this.radius <= 0) {
            this.force = new Vec2D(-this.force.x * damping,this.force.y);
            this.position = new Vec2D(this.radius, this.position.y);
          }

          if (this.y + this.radius >= Settings.SCREEN_HEIGHT) {
            this.force = new Vec2D(this.force.x*traction, -this.force.y * damping);
            this.position = new Vec2D(this.position.x,Settings.SCREEN_HEIGHT - this.radius);
            // traction here
          

          } else if (this.y - this.radius <= 0) {
            this.force = new Vec2D(this.force.x,-this.force.y * damping);
            this.position = new Vec2D(this.position.x,this.radius);
          }
        
          this.force = this.force.add(new Vec2D(0,gravity));

          this.position = this.position.add(this.force);

          this.falling = this.force.y > 0;

    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, 2* Math.PI, false);
        ctx.fillStyle = 'green';
        ctx.fill();
        ctx.lineWidth = 5;
        ctx.strokeStyle = '#003300';
        ctx.stroke();

     // Añade el métododrawa la clase Ball para que se pinte a sí misma en el contexto que se le pasa como parámetro

    }

    get pos(){
        return this.position;
    }

    get vel(){
        return this.force;
    }
}

export {Ball};