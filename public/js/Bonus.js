import { Object2D, Vec2D } from "./math.js";
import Settings from "./Settings.js";

export let BonusType = {
  stop_time: "stop",
  extra_hook: "extrahook",
  chain_hook: "chainhook",
  break_balls_once: "breakonce",
  break_balls_max: "breakmax",
  invulnerability: "invulnerable",
  shoot: "shoot",
  extra_hit: "extrahit"
};

export class Bonus extends Object2D {
  constructor(position, bonus_type, sprite) {
    super(new Vec2D(Settings.BONUS_SIZE, Settings.BONUS_SIZE), position);
    this.bonus_type = bonus_type;
    this.force = new Vec2D(0, 0);
    this.to_kill = false;
    this.falling = true;
    this.timer = Settings.BONUS_DURATION;
    this.sprite = sprite;
  }

  update(time_passed) {
    // si no está cayendo
    // acumular en this.timer el tiempo transcurrido
    // si this.timer es menor que 0, preparar el bonus para sacarlo de pantalla
    if (!this.falling) {
      this.timer -= time_passed;
      if (this.timer < 0) {
        this.to_kill = true;
      }
    } else {
      let increment =
        Settings.BONUS_SPEED * time_passed < 1 ? 1 : Settings.BONUS_SPEED * time_passed;
      this.position = this.position.add(new Vec2D(0, increment));

      if (this.x < Settings.MARGIN) {
        this.position = new Vec2D(Settings.MARGIN, this.y);
      } else if (this.x > Settings.SCREEN_WIDTH - Settings.MARGIN - 20) {
        this.position = new Vec2D(Settings.SCREEN_WIDTH - Settings.MARGIN - 20, this.y);
      }
      if (this.y > Settings.SCREEN_HEIGHT - Settings.MARGIN - 20) {
        this.position = new Vec2D(this.x, Settings.SCREEN_HEIGHT - Settings.MARGIN - 20);
        this.falling = false;
      }
    }
  }

  draw(ctx) {
    // pintar el bonus en el contexto
    ctx.drawImage(this.sprite, this.position.x, this.position.y);
  }
}
