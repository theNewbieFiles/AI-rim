


import MainMenu_State from "./MainMenu_State.js";
import StateManager from "./StateManagement.js";
import KeyboardInput from "./KeyboardInput.js";
import {AssetManager} from "./AssetManager.js";


//check if the settings file exists
if(!window.Settings){
    throw new Error("Settings file is missing!");
}





export default function Game() {
    let self = this;
    this.resources = {};

    //statemanager
    const stateManager = new StateManager();



    //inputs
    const keyboardInput = new KeyboardInput();

    let now = performance.now();
    let then = performance.now();
    let delta = 0;

    //setup inputs

    window.addEventListener('keydown', function (Event) {keyboardInput.onKeyDown(Event)}, true);
    window.addEventListener('keyup', function (Event) {keyboardInput.onKeyUp(Event)}, true);


    //resources
    let assetManager = new AssetManager(this);




    this.load = function () {

        //start loading the models and textures
        assetManager.init();

        self.ready();
    };

    this.ready = function () {

        //remove the loading notice

        document.getElementById('loading').remove();

        stateManager.addState(new MainMenu_State(self));



        //everything is done

        tick();
    };

    function tick () {

        now = performance.now();

        delta = now - then;

        stateManager.update(delta);

        stateManager.render(delta);


        then = now;
        requestAnimationFrame(tick);
    }


    this.keyboardInput = keyboardInput;
    this.stateManager = stateManager;



    this.isModelsLoaded = function () {
        return assetManager.allModelsLoaded();
    }

    this.getAssetManager = function () {
        return assetManager;
    }



}