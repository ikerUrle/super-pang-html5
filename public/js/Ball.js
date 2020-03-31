import { Vec2D, Object2D } from "./math.js";
import Settings from "./Settings.js";

class Ball extends Object2D {
  constructor(radius, position, force, sprite, color) {
    super(new Vec2D(radius * 2, radius * 2), position);
    this.radius = radius;
    this.position = position;
    this.force = force;
    this.falling = this.force.y >= 0;
    this.max_height = Settings.SCREEN_HEIGHT - 150 - radius * 4;
    this.color = color;
    this.sprite = sprite;
  }

  update(time_passed) {
    var gravity = 0.1,
      damping = 0.9,
      traction = 0.8;

    if (this.x + this.radius >= Settings.SCREEN_WIDTH) {
      this.force = new Vec2D(-this.force.x * damping, this.force.y);
      this.position = new Vec2D(
        Settings.SCREEN_WIDTH - this.radius,
        this.position.y
      );
    } else if (this.x - this.radius <= 0) {
      this.force = new Vec2D(-this.force.x * damping, this.force.y);
      this.position = new Vec2D(this.radius, this.position.y);
    }

    if (this.y + this.radius >= Settings.SCREEN_HEIGHT) {
      this.force = new Vec2D(this.force.x * traction, -this.force.y * damping);
      this.position = new Vec2D(
        this.position.x,
        Settings.SCREEN_HEIGHT - this.radius
      );
      // traction here
    } else if (this.y - this.radius <= 0) {
      this.force = new Vec2D(this.force.x, -this.force.y * damping);
      this.position = new Vec2D(this.position.x, this.radius);
    }

    this.force = this.force.add(new Vec2D(0, gravity));
    if (Math.abs(this.force.y) < 2) {
      this.force = new Vec2D(this.force.x, -3);
    }

    this.position = this.position.add(this.force);

    this.falling = this.force.y > 0;
  }

  draw(ctx) {
    ctx.fillText(this.force.y, 20, 20);
    ctx.drawImage(
      this.sprite,
      this.x - this.radius,
      this.y - this.radius,
      this.radius * 2,
      this.radius * 2
    );
  }

  get pos() {
    return this.position;
  }

  get vel() {
    return this.force;
  }
}

export { Ball };
