import SpriteSheet from "./SpriteSheet.js";
import {loadBuster, loadImage, loadLevel, loadBalls} from "./loaders.js";
import setupKeyboard from "./input.js";
import Settings from "./Settings.js";

const canvas = document.getElementById('screen');
const context = canvas.getContext('2d');

//Override settings

Settings.SCREEN_HEIGHT = canvas.height;
Settings.SCREEN_WIDTH = canvas.width;


Promise.all([loadImage('img/sprites.png'), loadLevel('1')])
    .then(([image,levelSpec]) => {

    const buster = loadBuster(image, levelSpec.player);

    const balls = loadBalls(levelSpec.balls);
  
    let deltaTime = 0;
    let lastTime = 0;

 
    function update(time) {

        deltaTime = time - lastTime;
        context.clearRect(0, 0, canvas.width, canvas.height);
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