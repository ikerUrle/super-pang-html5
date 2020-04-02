import SpriteSheet from "./SpriteSheet.js";
import {
  loadBuster,
  loadImage,
  loadLevel,
  loadBalls,
  loadHookManager,
  loadBackground,
  createBallFactory,
  startLevel,
  createBonusFactory
} from "./loaders.js";
import setupKeyboard from "./input.js";
import Settings from "./Settings.js";
import { CollisionManager } from "./collisions.js";
import { HookType } from "./Hook.js";
import { AudioManager } from "./AudioManager.js";
import { Bonus, BonusType } from "./Bonus.js";

const canvas = document.getElementById("screen");
const context = canvas.getContext("2d");

//Override settings

Settings.SCREEN_HEIGHT = canvas.height;
Settings.SCREEN_WIDTH = canvas.width;

Promise.all([
  loadImage("img/player.png"),
  loadImage("img/hookRope.png"),
  loadImage("img/backgrounds.png"),
  loadImage("img/balls.png"),
  loadImage("img/bonus.png"),
  loadImage("img/hookChain.png"),
  loadImage("img/endScreen.png"),
  loadImage("img/hit.png"),
  loadImage("img/shield.png")
]).then(
  ([
    playerImage,
    hookImage,
    backgrounds,
    ballsImage,
    bonusImage,
    hookChainImage,
    endScreen,
    hitImage,
    shieldImage
  ]) => {
    let level = 1;
    let drawBackground;
    const ballFactory = createBallFactory(ballsImage);
    let balls = new Set();
    const bonusFactory = createBonusFactory(bonusImage);
    let bonus = new Set();

    const hooks = new Set();

    const hookImages = new Map();
    hookImages.set(HookType.rope, hookImage);
    hookImages.set(HookType.chain, hookChainImage);
    const hookManager = loadHookManager(hookImages, hooks);
    const buster = loadBuster(playerImage);
    buster.setHookManager(hookManager);
    const collisionManager = new CollisionManager(
      hooks,
      balls,
      ballFactory,
      bonus,
      bonusFactory,
      buster
    );

    let deltaTime = 0;
    let lastTime = 0;

    AudioManager.playSoundtrack();
    let finish = false;

    function update(time) {
      deltaTime = time - lastTime;
      drawBackground(context);

      hooks.forEach(hook => {
        hook.draw(context);
        hook.update(deltaTime / 1000);
      });

      buster.draw(context);
      buster.update(deltaTime / 1000);

      balls.forEach(ball => {
        ball.draw(context);
        ball.update(deltaTime / 1000);
      });

      if (buster.bonuses.has(BonusType.extra_hit) && buster.hits > 0) {
        buster.hits--;
        buster.bonuses.delete(BonusType.extra_hit);
      }

      for (var i = 0; i < Settings.MAX_HITS - buster.hits; i++) {
        context.drawImage(hitImage, 13 + 20 * i, 13, 20, 20);
      }
      if (buster.bonuses.has(BonusType.invulnerability)) {
        context.drawImage(shieldImage, 13, 33, 20, 20);
      }
      context.font = "bold 50px mono";
      context.fillStyle = "#FFFFFF";
      context.fillText(level, Settings.SCREEN_WIDTH - 40, 50);

      collisionManager.checkCollisions();

      bonus.forEach(item => {
        item.draw(context);
        item.update(deltaTime / 1000);
      });

      if (!finish) {
        if (buster.hit) {
          buster.hits++;
          balls.clear();
          hooks.clear();
          buster.hit = false;
          buster.bonuses.clear();
          if (buster.hits < Settings.MAX_HITS) {
            startLevel(level, balls, ballFactory, buster).then(r => {
              drawBackground = loadBackground(backgrounds, level);
              lastTime = time;
              requestAnimationFrame(update);
            });
          } else {
            context.clearRect(0, 0, Settings.SCREEN_WIDTH, Settings.SCREEN_HEIGHT);
            context.drawImage(endScreen, 0, 0, Settings.SCREEN_WIDTH, Settings.SCREEN_HEIGHT);
            finish = true;
            requestAnimationFrame(update);
          }
        } else if (balls.size === 0) {
          hooks.clear();
          if (level < Settings.MAX_LEVELS) {
            startLevel(++level, balls, ballFactory, buster).then(r => {
              drawBackground = loadBackground(backgrounds, level);
              lastTime = time;
              requestAnimationFrame(update);
            });
          } else {
            finish = true;
            lastTime = time;
            requestAnimationFrame(update);
          }
        } else {
          lastTime = time;
          requestAnimationFrame(update);
        }
      } else {
        context.clearRect(0, 0, Settings.SCREEN_WIDTH, Settings.SCREEN_HEIGHT);
        context.drawImage(endScreen, 0, 0, Settings.SCREEN_WIDTH, Settings.SCREEN_HEIGHT);

        if (buster.hits < Settings.MAX_HITS) {
          AudioManager.playVictory();
          context.font = "bold 50px mono";
          context.fillStyle = "#FFFFFF";
          context.fillText("Victory!!!", 80, 280);
        } else {
          AudioManager.playGameover();
          context.font = "bold 50px mono";
          context.fillStyle = "#FF0000";
          context.fillText("GAME OVER", 40, 280);
        }
        requestAnimationFrame(update);
      }
    }

    const input = setupKeyboard(buster);
    input.listenTo(window);

    startLevel(level, balls, ballFactory, buster).then(r => {
      drawBackground = loadBackground(backgrounds, level);
      update(0);
    });
  }
);
