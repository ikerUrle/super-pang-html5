import SpriteSheet from "./SpriteSheet.js";
import { Vec2D } from "./math.js";
import Player from "./Player.js";
import { Ball } from "./Ball.js";
import { Hook, HookType } from "./Hook.js";
import Settings from "./Settings.js";
import { Bonus, BonusType } from "./Bonus.js";
import { AudioManager } from "./AudioManager.js";

export function createBallFactory(ballsImage) {
  const spriteSheet = new SpriteSheet(ballsImage, 48 * 2, 40 * 2);
  spriteSheet.define("red", 0, 0);
  spriteSheet.define("blue", 1, 0);
  spriteSheet.define("green", 2, 0);

  return function(radius, pos, force, color) {
    return new Ball(radius, pos, force, spriteSheet.get(color), color);
  };
}

export function createBonusFactory(bonusImage) {
  const bonusSprites = new SpriteSheet(bonusImage, 20, 20);
  bonusSprites.define(BonusType.chain_hook, 2, 0);

  return function(pos, bonusType) {
    return new Bonus(pos, bonusType, bonusSprites.get(bonusType));
  };
}

export function loadLevel(currentLevel) {
  return fetch(`levels/${currentLevel}.json`).then(r => r.json());
}

export function loadBalls(balls, ballFactory) {
  let returnBalls = new Set();
  balls.forEach(element => {
    returnBalls.add(
      ballFactory(
        element.radius,
        new Vec2D(element.pos[0], element.pos[1]),
        new Vec2D(element.force[0], element.force[1]),
        element.color
      )
    );
  });
  return returnBalls;
}

export function loadBackground(backgrounds, level) {
  const buffer = document.createElement("canvas");
  buffer.width = 256;
  buffer.height = 192;
  // recortar super-sprite y dejarlo preparado en un buffer
  const context = buffer.getContext("2d");
  context.drawImage(
    backgrounds,
    (level - 1) * buffer.width,
    0,
    buffer.width,
    buffer.height,
    0,
    0,
    buffer.width,
    buffer.height
  );
  return function(ctx) {
    ctx.drawImage(
      buffer,
      0,
      0,
      buffer.width,
      buffer.height,
      0,
      0,
      Settings.SCREEN_WIDTH,
      Settings.SCREEN_HEIGHT
    );
  };
}

export function startLevel(level, balls, ballFactory, buster) {
  return new Promise(resolve => {
    loadLevel(level).then(levelInfo => {
      var ballsAux = loadBalls(levelInfo.balls, ballFactory);
      buster.setPos(levelInfo.player.pos);
      ballsAux.forEach(ball => balls.add(ball));
      resolve();
    });
  });
}

export function loadHookManager(hookImages, hooks) {
  return (x, y, hookType) => {
    if (hooks.size < Settings.MAX_HOOKS) {
      AudioManager.playShoot();
      hooks.add(
        new Hook(10, new Vec2D(x, y), hookType, hookImages.get(hookType))
      );
    }
  };
}

export function loadImage(url) {
  return new Promise(resolve => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.src = url;
  });
}

export function loadBuster(image, playerSpec) {
  const spriteSheet = new SpriteSheet(image, 32, 32);
  spriteSheet.define("buster", 1, 0);
  spriteSheet.define("buster-1", 0, 0);
  spriteSheet.define("buster-2", 2, 0);
  spriteSheet.define("buster-3", 3, 0);
  spriteSheet.define("idle", 4, 0);
  spriteSheet.define("hit", 7, 0);

  const pos = new Vec2D(playerSpec.pos[0], playerSpec.pos[1]);
  const size = new Vec2D(32, 32);

  return new Player(size, pos, spriteSheet);
}
