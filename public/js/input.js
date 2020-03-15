import { Vec2D } from "./math.js";

const PRESSED = 1;
const RELEASED = 0;

export default function setupKeyboard(buster) {
    const keyboard = new KeyboardState();
    ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].forEach(eventName => {
        keyboard.addMapping(eventName, keyState => console.log(eventName));
    });

    keyboard.addMapping('ArrowLeft', keyState => {
        if (keyState == PRESSED) {
            buster.direction.x = -1;
           
        } else{
            buster.direction.x = 0;
        }

    });

    keyboard.addMapping('ArrowRight', keyState => {
        if (keyState == PRESSED) {
            buster.direction.x = 1;
        } else{
            buster.direction.x = 0 
        }
    });
    return keyboard;
}


class KeyboardState {


    constructor() {

        this.keyStates = new Map();

        this.keyMap = new Map();
    }

    addMapping(keyCode, callback) {
        this.keyMap.set(keyCode, callback);
    }

    handleEvent(event) {
        const {
            code
        } = event;
        if (!this.keyMap.has(code)) {
            return;
        }
        event.preventDefault();

        const keyState = event.type === 'keydown' ? PRESSED : RELEASED;

        if (this.keyStates.get(code) === keyState) {
            return;
        }

        this.keyStates.set(code, keyState);
        this.keyMap.get(code)(keyState);

    }

    listenTo(window) {
        ['keydown', 'keyup'].forEach(eventName => {
            window.addEventListener(eventName, event => {
                this.handleEvent(event);
            })
        });

    }
}