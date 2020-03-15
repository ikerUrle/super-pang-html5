import SpriteSheet from "./SpriteSheet.js";

function loadImage(url) {
    return new Promise(resolve => {
        const image = new Image();
        image.addEventListener('load', () => resolve(image));
        image.src = url;

    });
}

const canvas = document.getElementById('screen');
const context = canvas.getContext('2d');


loadImage('img/sprites.png').then(image => {


    const sprites = new SpriteSheet(image, 32, 32);
    sprites.define('buster', 0, 0);

    let deltaTime = 0;
    let lastTime = 0;

    let pos = {
        x:64,
        y:64
    }

    function update(time) {

        deltaTime = time - lastTime;
        console.log(deltaTime);
        context.clearRect(0, 0, canvas.width, canvas.height);
        sprites.draw('buster', context, pos.x, pos.y);
        pos.x +=2;
        lastTime = time;
        requestAnimationFrame(update);
    }

    update(0);

});