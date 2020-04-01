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

const canvas = document.getElementById("screen");
const context = canvas.getContext("2d");

//Override settings

Settings.SCREEN_HEIGHT = canvas.height;
Settings.SCREEN_WIDTH = canvas.width;

Promise.all([
  loadImage("img/player.png"),
  loadImage("img/hookRope.png"),
  loadLevel("1"),
  loadImage("img/backgrounds.png"),
  loadImage("img/balls.png"),
  loadImage("img/bonus.png"),
  loadImage("img/hookChain.png"),
  loadImage("img/endScreen.png"),
  loadImage("img/hit.png")
]).then(
  ([
    playerImage,
    hookImage,
    levelSpec,
    backgrounds,
    ballsImage,
    bonusImage,
    hookChainImage,
    endScreen,
    hitImage
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
    const buster = loadBuster(playerImage, levelSpec.player);
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
      for (var i = 0; i < Settings.MAX_HITS - buster.hits; i++) {
        context.drawImage(hitImage, 13 + 20 * i, 13, 20, 20);
      }

      collisionManager.checkCollisions();

      bonus.forEach(item => {
        item.draw(context);
        item.update(deltaTime / 1000);
      });

      if (balls.size === 0) {
        hooks.clear();
        if (level < Settings.MAX_LEVELS) {
          startLevel(++level, balls, ballFactory, buster).then(r => {
            drawBackground = loadBackground(backgrounds, level);
          });
        } else {
          AudioManager.playVictory();
          finish = true;
        }
      }

      if (!finish) {
        if (buster.hit) {
          buster.hits++;
          balls.clear();
          hooks.clear();
          buster.hit = false;
          if (buster.hits < Settings.MAX_HITS) {
            startLevel(level, balls, ballFactory, buster).then(r => {
              drawBackground = loadBackground(backgrounds, level);
            });
          } else {
            context.clearRect(
              0,
              0,
              Settings.SCREEN_WIDTH,
              Settings.SCREEN_HEIGHT
            );
            context.drawImage(
              endScreen,
              0,
              0,
              Settings.SCREEN_WIDTH,
              Settings.SCREEN_HEIGHT
            );
            AudioManager.playGameover();
            finish = true;
          }
        }
        lastTime = time;
        requestAnimationFrame(update);
      } else {
        context.clearRect(0, 0, Settings.SCREEN_WIDTH, Settings.SCREEN_HEIGHT);
        context.drawImage(
          endScreen,
          0,
          0,
          Settings.SCREEN_WIDTH,
          Settings.SCREEN_HEIGHT
        );
        if (buster.hits < Settings.MAX_HITS) {
          context.font = "bold 50px mono";
          context.fillStyle = "#FFFFFF";
          context.fillText("Victory!!!", 80, 280);
        } else {
          context.font = "bold 50px mono";
          context.fillStyle = "#FF0000";
          context.fillText("GAME OVER", 40, 280);
        }
      }
    }

    const input = setupKeyboard(buster);
    input.listenTo(window);

    startLevel(level, balls, ballFactory, buster).then(r => {
      drawBackground = loadBackground(backgrounds, level);
      update(0);
    });

    //buster.draw(context);
  }
);
