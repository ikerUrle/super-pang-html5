const PRESSED = 1;
const RELEASED = 0;

export default class KeyboardState {


    constructor(){

        this.keyStates = new Map();

        this.keyMap = new Map();
    }

    addMapping(keyCode, callback){
        this.keyMap.set(keyCode,callback);
    }

    handleEvent(event){
        const {code} = event;
        if (!this.keyMap.has(code)){
            return;
        }
        event.preventDefault();

        const keyState = event.type === 'keydown' ? PRESSED : RELEASED;

        if (this.keyStates.get(code) === keyState){
            return;
        }

        this.keyStates.set(code, keyState);
        this.keyMap.get(code)(keyState);
       
    }

    listenTo(window){
        ['keydown','keyup'].forEach(eventName => {
            window.addEventListener(eventName, event => {
                this.handleEvent(event);
            })
        });
        
    }
}