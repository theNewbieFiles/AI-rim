import {EnergyComObj, HungerComObj, TransformCompObj} from "./Components.js";
import {Vector3} from "../lib/three.module.js";
import {getRandomInt} from "./Utilities.js";

export function DeerFactory(ID, Components) {

    Components.Transform.set(ID, new TransformCompObj(new Vector3()));
    Components.Energy.set(ID, new EnergyComObj(100, 100, 1));
    Components.Hunger.set(ID, new HungerComObj(0, 100, 1));

    Components.DeerState.set(ID, new DeerStateComObj());


}

export function Deer_Sys(Components) {
    //debugger

    Components.DeerState.forEach((Deer, ID) => {

        //just existing
        Deer.calories -= 1;

        if(Deer.currentState !== 'sleeping'){
            Deer.energy -= 1;

            if(Deer.energy < Deer.lowEnergyValue ){
                Deer.currentState = 'sleeping';
                //console.log(ID + " is tired, sleeping");
            }

            if(Deer.currentState !== 'eating'){
                if(Deer.currentState === 'idle' && Deer.calories < 250){
                    Deer.currentState = 'eating';
                }
            }


        }

        switch (Deer.currentState) {
            case 'idle':
                Deer_IdleState_Sys(Deer, ID);
                break;

            case 'wondering':
                deerWonderingState(Deer, ID);
                break;

            case 'eating':
                deerEating(Deer, ID);
                break;

            case 'sleeping':
                deerSleepingState(Deer, ID);
                break;

            default:
                Deer.currentState = 'idle';
        }


        console.log(Deer);
    })


}

function deerEating(Deer, ID) {
    Deer.calories += 7;

    if(Deer.calories > 100){
        Deer.currentState = 'idle';
    }
}


function Deer_IdleState_Sys(Deer, ID){
    //console.log(ID + ' is idle for: ' + Deer.idleTimer );
    Deer.idleTimer += Deer.idleTimerRate;

    if(Deer.idleTimer > 10){
        Deer.currentState = 'wondering';
        Deer.idleTimer = 0;
    }
}



function deerWonderingState(Deer, ID){

    //console.log(ID + ' is wondering...')
}

function deerSleepingState(Deer, ID){
    Deer.energy += 1;
    //console.log(ID + ' is sleeping...', Deer.energy);


    let ran = getRandomInt(1, 100);

    if(ran > 98){
        //console.log("something woke you up!!!!!!!!!!!!!!!!");
        Deer.currentState = 'wondering';
    }

    if(Deer.energy >= 100){
        Deer.currentState = 'idle';
        //console.log("I've woken up...");
    }


}