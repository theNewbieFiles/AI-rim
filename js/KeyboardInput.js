
//check if the settings file exists
if(!window.Settings){
    throw new Error("Settings file is missing!");
}


export default function KeyboardInput() {

    let pressed = new Map();
    let anyKeyPressed = false;
    let keyList = [];

    let ctrl = false;
    let shiftLeft = false;
    let altRight = false;

    let settings = window.Settings;

    this.onKeyDown = function (Event) {
        pressed.set(Event.code, performance.now());
        anyKeyPressed = performance.now();

        //Todo: is this even needed?
        if(Event.code === "ControlLeft"){
            ctrl = true;
        }

        if(Event.code === "ShiftLeft"){
            shiftLeft = true;
        }

        if(Event.code === "AltRight"){
            altRight = true;
        }

        keyList.push(Event.code);
        if(keyList.length > window.Settings.keyBufferLength){
            keyList.shift();
        }

        if(window.Settings.showKey){
            console.log(Event.code);
        }

    };

    this.onKeyUp = function (Event) {
        pressed.delete(Event.code);

        if(Event.code === "ControlLeft"){
            ctrl = false;
        }

        if(Event.code === "ShiftLeft"){
            shiftLeft = false;
        }

        if(Event.code === "AltRight"){
            altRight = false;
        }
    };

    this.clearKeys = function () {
        pressed.clear();
        anyKeyPressed = 1000000;
        keyList = [];
        ctrl = false;
        shiftLeft = false;
        altRight = false;

    };

    this.getKeyList = function () {
        return keyList;
    };

    this.isKeyDown = function (Key) {
        return pressed.has(Key);
    };

    this.keysPressed = pressed;



    function showKeys() {
        settings.showKey = !settings.showKey;
    }



    //console access
    window.showKeys = showKeys;
    window.clearKeys = this.clearKeys;
}