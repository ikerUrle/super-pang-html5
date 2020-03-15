export default class SpriteSheet {

    constructor(image, width, height) {
        this.image = image;
        this.width = width;
        this.height = height;
        this.buffers = new Map();
    }

    define(name, x, y) {
        const buffer = document.createElement('canvas');
        buffer.width = this.width;
        buffer.height = this.height;
        buffer.getContext("2d").drawImage(this.image, x*this.width, y*this.height, this.width, this.height, 0, 0, this.width, this.height);
        this.buffers.set(name, buffer);
    }

    draw(name, context, x, y) {
        const buffer = this.buffers.get(name);
        context.drawImage(buffer, x, y);
    }

    get(name){
        return this.buffers.get(name);
    }

}