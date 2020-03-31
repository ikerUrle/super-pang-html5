export default class SpriteSheet {
  constructor(image, width, height) {
    this.image = image;
    this.width = width;
    this.height = height;
    this.buffers = new Map();
  }

  define(name, x, y) {
    const buffers = [false, true].map(flip => {
      const buffer = document.createElement("canvas");
      buffer.width = this.width;
      buffer.height = this.height;
      const context = buffer.getContext("2d");
      if (flip) {
        context.scale(-1, 1);
        context.translate(-buffer.width, 0);
      }
      context.drawImage(
        this.image,
        x * this.width,
        y * this.height,
        this.width,
        this.height,
        0,
        0,
        this.width,
        this.height
      );
      return buffer;
    });
    this.buffers.set(name, buffers);
  }

  draw(name, context, x, y) {
    const buffer = this.buffers.get(name);
    context.drawImage(buffer, x, y);
  }

  get(name, heading = 0) {
    return this.buffers.get(name)[heading > 0 ? 1 : 0];
  }
}
