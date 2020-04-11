import { Object2D, Vec2D } from "./math.js";
import Settings from "./Settings.js";
import { HookType, Hook } from "./Hook.js";
import { BonusType, Bonus } from "./Bonus.js";

const frames = ["buster", "buster-1", "buster-2", "buster-3"];

export default class Player extends Object2D {
  routeFrame() {
    if (this.direction.x !== 0) {
      const frameIndex = Math.floor(this.distance / 10) % frames.length;
      const frameName = frames[frameIndex];
      return frameName;
    }

    return "idle";
  }

  constructor(size, pos, spriteSheet) {
    super(size, pos);
    this.force = new Vec2D(0, 0);
    this.spriteSheet = spriteSheet;
    this.direction = new Vec2D(0, 0);
    this.distance = 0;
    this.hit = false;
    this.hits = 0;
    this.bonuses = new Set();
    this.inmune = false;

    this.drawAux = true;
  }

  setHookManager(hookManager) {
    this.hookManager = hookManager;
  }

  shoot() {
    var hookType = HookType.rope;
    if (this.bonuses.has(BonusType.chain_hook)) {
      hookType = HookType.chain;
    }
    if (this.bonuses.has(BonusType.extra_hook)) {
      this.hookManager(this.position.x + 11, this.position.y, hookType);
      this.hookManager(this.position.x + 21, this.position.y, hookType);
    } else {
      this.hookManager(this.position.x + 16, this.position.y, hookType);
    }
  }

  // time respresenta el tiempo que ha pasado desde la última ejecución
  update(time) {
    if (this.direction.x !== 0) {
      this.distance += Settings.PLAYER_SPEED * time;
    } else {
      this.distance = 0;
    }

    if (this.y < Settings.SCREEN_HEIGHT - this.height - Settings.MARGIN) {
      this.force = this.force.add(Settings.GRAVITY * time);
      this.position = this.position.add(new Vec2D(0, this.force.y * time));
    }

    this.position = this.position.add(
      new Vec2D(this.direction.x * time * Settings.PLAYER_SPEED, 0)
    );

    if (this.x < Settings.MARGIN) {
      this.position = new Vec2D(Settings.MARGIN, this.y);
    } else if (this.x > Settings.SCREEN_WIDTH - this.width - Settings.MARGIN) {
      this.position = new Vec2D(Settings.SCREEN_WIDTH - this.width - Settings.MARGIN, this.y);
    }

    if (this.y > Settings.SCREEN_HEIGHT - this.height - Settings.MARGIN) {
      this.position = new Vec2D(this.x, Settings.SCREEN_HEIGHT - this.height - Settings.MARGIN);
    }
  }

  draw(context) {
    if (this.inmune) {
      if (this.drawAux) {
        context.drawImage(
          this.spriteSheet.get(this.routeFrame(), this.direction.x),
          this.x,
          this.y
        );
      }
      this.drawAux = !this.drawAux;
    } else {
      context.drawImage(this.spriteSheet.get(this.routeFrame(), this.direction.x), this.x, this.y);
    }
  }

  setPos(pos) {
    this.position = new Vec2D(pos[0], pos[1]);
  }

  activateBonus(type) {
    if (!this.bonuses.has(type)) {
      this.bonuses.add(type);
    }
  }
}
