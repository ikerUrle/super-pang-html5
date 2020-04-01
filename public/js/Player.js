import { Object2D, Vec2D } from "./math.js";
import Settings from "./Settings.js";
import { HookType, Hook } from "./Hook.js";
import { BonusType } from "./Bonus.js";

const frames = ["buster", "buster-1", "buster-2", "buster-3"];

export default class Player extends Object2D {
  routeFrame() {
    if (this.hit) {
      return "hit";
    }
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
    this.hookType = HookType.rope;
    this.hit = false;
    this.hits = 0;
  }

  setHookManager(hookManager) {
    this.hookManager = hookManager;
  }

  shoot() {
    this.hookManager(this.position.x + 16, this.position.y, this.hookType);
  }

  // time respresenta el tiempo que ha pasado desde la última ejecución
  update(time) {
    if (this.direction.x !== 0) {
      this.distance += Settings.PLAYER_SPEED * time;
    } else {
      this.distance = 0;
    }

    /*
        Asume por el momento que Settings.SCREEN_HEIGHT y Settings.SCREEN_WIDTH indican el tamaño de
        la pantalla del juego. Settings tiene otras constantes definidas (échales un vistazo)
        El objeto player tiene una altura (height) y una anchura (width) 
         */

    if (this.y < Settings.SCREEN_HEIGHT - this.height - Settings.MARGIN) {
      this.force = this.force.add(Settings.GRAVITY * time);
      this.position = this.position.add(new Vec2D(0, this.force.y * time));
    }

    this.position = this.position.add(
      new Vec2D(this.direction.x * time * Settings.PLAYER_SPEED, 0)
    );

    // si buster está cayendo (está por debajo de la altura de la pantalla)
    // fuerza = añadir fuerza vertical de gravedad * tiempo
    // position = añadir fuerza * tiempo al eje y

    // position = añadir dirección * tiempo * velocidad del jugador al eje x
    if (this.x < Settings.MARGIN) {
      this.position = new Vec2D(Settings.MARGIN, this.y);
    } else if (this.x > Settings.SCREEN_WIDTH - this.width - Settings.MARGIN) {
      this.position = new Vec2D(
        Settings.SCREEN_WIDTH - this.width - Settings.MARGIN,
        this.y
      );
    }

    if (this.y > Settings.SCREEN_HEIGHT) {
      this.position = new Vec2D(this.x, Settings.SCREEN_HEIGHT);
    }
  }

  draw(context) {
    context.drawImage(
      this.spriteSheet.get(this.routeFrame(), this.direction.x),
      this.x,
      this.y
    );
  }

  killThemAll() {
    for (var i = 0; i < Settings.SCREEN_WIDTH; i += 5) {
      this.hookManager(i, this.position.y, this.hookType);
    }
  }

  setPos(pos) {
    this.position = new Vec2D(pos[0], pos[1]);
  }

  activateBonus(type) {
    if (type === BonusType.chain_hook) {
      this.hookType = HookType.chain;
    }
  }
}
