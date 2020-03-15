import SpriteSheet from "./SpriteSheet.js";
import {loadBuster, loadImage} from "./loaders.js";
import Keyboard from "./Keyboard.js";

const canvas = document.getElementById('screen');
const context = canvas.getContext('2d');


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
        //sprites.draw('buster', context, pos.x, pos.y);
        lastTime = time;
        requestAnimationFrame(update);
    }

    const input = new Keyboard();
    input.addMapping('Space', keyState => {if(keyState == 1){console.log(keyState)}});
    input.listenTo(window);

    update(0);

});