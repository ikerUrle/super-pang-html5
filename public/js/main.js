import SpriteSheet from "./SpriteSheet.js";
import {loadBuster, loadImage, loadLevel, loadBalls, loadHookManager} from "./loaders.js";
import setupKeyboard from "./input.js";
import Settings from "./Settings.js";

const canvas = document.getElementById('screen');
const context = canvas.getContext('2d');

//Override settings

Settings.SCREEN_HEIGHT = canvas.height;
Settings.SCREEN_WIDTH = canvas.width;


Promise.all([loadImage('img/sprites.png'),loadImage('img/hookRope.png'), loadLevel('1')])
    .then(([image,hookImage, levelSpec]) => {

   

    const balls = loadBalls(levelSpec.balls);
    const hooks = [];
    const hookManager = loadHookManager(hookImage, hooks);

    const buster = loadBuster(image, levelSpec.player);
    buster.setHookManager(hookManager);
  
    let deltaTime = 0;
    let lastTime = 0;

 
    function update(time) {

        deltaTime = time - lastTime;
        context.clearRect(0, 0, canvas.width, canvas.height);
       

        hooks.forEach(hook =>{
            hook.draw(context);
            hook.update(deltaTime/1000);
        });

      

        buster.draw(context);
        buster.update(deltaTime/1000);
       
        balls.forEach(ball =>{
            ball.draw(context);
            ball.update(deltaTime/1000);
        });
        
        lastTime = time;
        requestAnimationFrame(update);
    }

    const input = setupKeyboard(buster);
    input.listenTo(window);

    buster.draw(context);
    update(0);

});