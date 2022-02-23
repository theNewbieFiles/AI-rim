import {Game_State} from "./Game_State.js";

export default function MainMenu_State(Game) {

    let game = Game;
    let input = game.keyboardInput;

    this.load = function (callback) {




        callback();
    };

    this.update = function (Delta) {
        if(game.isModelsLoaded()){
            game.stateManager.addState(new Game_State(game));
        }



    };

    this.render = function (Delta) {

    }



}