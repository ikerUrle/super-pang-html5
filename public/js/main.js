import SpriteSheet from "./SpriteSheet.js";
import {
  loadBuster,
  loadImage,
  loadLevel,
  loadBalls,
  loadHookManager,
  loadBackground,
  createBallFactory
} from "./loaders.js";
import setupKeyboard from "./input.js";
import Settings from "./Settings.js";
import { CollisionManager } from "./collisions.js";

const canvas = document.getElementById("screen");
const context = canvas.getContext("2d");

//Override settings

Settings.SCREEN_HEIGHT = canvas.height;
Settings.SCREEN_WIDTH = canvas.width;

Promise.all([
  loadImage("img/sprites.png"),
  loadImage("img/hookRope.png"),
  loadLevel("1"),
  loadImage("img/backgrounds.png"),
  loadImage("img/balls.png")
]).then(([image, hookImage, levelSpec, backgrounds, ballsImage]) => {
  const ballFactory = createBallFactory(ballsImage);
  const balls = loadBalls(levelSpec.balls, ballFactory);

  const hooks = new Set();
  const hookManager = loadHookManager(hookImage, hooks);
  const drawBackground = loadBackground(backgrounds);

  const buster = loadBuster(image, levelSpec.player);
  buster.setHookManager(hookManager);

  const collisionManager = new CollisionManager(hooks, balls, ballFactory);

  let deltaTime = 0;
  let lastTime = 0;

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

    collisionManager.checkCollisions();

    lastTime = time;
    requestAnimationFrame(update);
  }

  const input = setupKeyboard(buster);
  input.listenTo(window);

  buster.draw(context);
  update(0);
});
