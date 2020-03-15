import SpriteSheet from "./SpriteSheet.js";
import {loadBuster, loadImage} from "./loaders.js";
import setupKeyboard from "./input.js";
import Settings from "./Settings.js";

const canvas = document.getElementById('screen');
const context = canvas.getContext('2d');

//Override settings

Settings.SCREEN_HEIGHT = canvas.height;
Settings.SCREEN_WIDTH = canvas.width;


loadImage('img/sprites.png').then(image => {

    const buster = loadBuster(image);


    const sprites = new SpriteSheet(image, 32, 32);
    sprites.define('buster', 0, 0);

    let deltaTime = 0;
    let lastTime = 0;

 
    function update(time) {

        deltaTime = time - lastTime;
        context.clearRect(0, 0, canvas.width, canvas.height);
        buster.draw(context);
        buster.update(deltaTime/1000);
        lastTime = time;
        requestAnimationFrame(update);
    }

    const input = setupKeyboard(buster);
    input.listenTo(window);

    buster.draw(context);
    update(0);

});