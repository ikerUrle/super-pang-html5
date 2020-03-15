import SpriteSheet from './SpriteSheet.js'
import { Vec2D } from './math.js';
import Player from './Player.js';

export function loadImage(url){
    return new Promise(resolve => {
        const image = new Image();
        image.addEventListener('load', () => resolve(image));
        image.src = url;
    });
}

export function loadBuster(image){
    const spriteSheet = new SpriteSheet(image,32,32);
    spriteSheet.define('buster',1,0);
    spriteSheet.define('buster-1',0,0);
    spriteSheet.define('buster-2',2,0);
    spriteSheet.define('buster-3',3,0);

    const pos = new Vec2D(175,240);
    const size = new Vec2D(32,32);

    return new Player(size,pos,spriteSheet);
}