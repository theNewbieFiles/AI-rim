import * as ComObj from "../Components.js";
import {Vector3} from "../../lib/three.module.js";
import {Vec2} from "../Utilities.js";

import {Components} from "../Components.js";
import {BehaviorTree} from "../BehaviorTree.js";
import {BehaviorTreeComObj} from "../Components.js";


//vars
let success = true;
let failure = false;
let running = "running";








/**
 * Give a entity all the components of a npc
 * @param ID
 * @param Components
 */
export function npcFactory(ID, Components) {
    //position
    Components.Transform.set(ID, new ComObj.TransformCompObj(new Vector3(100, 100)));
    Components.Transform.get(ID).scale = new Vec2(2, 2);



    //energy
    Components.Energy.set(ID, new ComObj.EnergyComObj(100));

    //food
    Components.Hunger.set(ID, new ComObj.HungerComObj());

    //AI
    Components.HumanAITest.set(ID, new ComObj.HumanAITestComObj());

    //inventory
    Components.Inventory.set(ID, []);

    //Movement
    Components.Movement.set(ID, new ComObj.MovementComObj(-2, 2, -2, 2))





}

export function wayPointFactory(ID, Components) {

}

/**
 * create a Human NPC
 * @param ID
 * @param Components
 */
export function humanFactory(ID, Components) {
    //give it the general npc components
    npcFactory(ID, Components);

    //renderer
    Components.Animation.set(ID, new ComObj.AnimationComObj("Goomba", false, 0, 1));

    //Components.Character.set(ID, new ComObj.CharacterComObj('human'));

    Components.BehaviorTree.set(ID, new BehaviorTreeComObj("HelloWorld"));

}






export function NPC_AI_Sys(Components, Cell) {
    Components.BehaviorTree.forEach((tree, ID) => {
        console.log(ID);

        BehaviorTree(ID, tree, Components);

    });


}



let nodes ={};

//leafs


function amITired(ID, Components) {
    let entity = Components.Energy.get(ID);

    if(entity && entity.current <= entity.lowEnergyValue){
        return true
    }

    return false;
};

function doIHaveFood(ID, Components) {
    //let food = [];


    //check personal inventory
    Components.Inventory.get(ID).forEach(Item => {
        if(Components.Food.has(Item)){
            console.log(Item);
            return true;

        }
    });


    return false;



};

nodes.containersNearBy = function(ID, Components) {

    let containers = [];
    //get the cell you are located in
    let cell = Components.CharacterCell.get(ID);

    if(cell){
        Components.Cell.get(cell).entities.forEach(entity => {
            if(Components.Container.has(entity)){
                //found a container
                containers.push(entity);
            }
        });
    }

    return containers;

};

nodes.moveToEntitySys = function(Components) {





};


//todo: how does it move???? can it fly? does it have magic to teleport or walk thru walls???
/**
 *
 * @param Components
 */
export function moveToPositionSys(Components) {

    Components.MoveToPosition.forEach((Data, ID) => {
        let myPosition = Components.Transform.get(ID).position;
        let target =  Components.Transform.get(Data.target).position;

        if(myPosition && target){
            let direction = target.clone();
            direction.sub(myPosition);
            direction.normalize();
            myPosition.add(direction);
        }


        if(myPosition.distanceToSquared(target)< 1000){
            Components.MoveToPosition.delete(ID);
            return true;
        }

        return false;
    })
}

function amIHungry(ID, Components) {

    if(Components.Hunger.get(ID).calories <= 20){
        return success
    }

    return failure;
}





export function AiTest(Components) {

    Components.HumanAITest.forEach((Data, ID) => {
        if(amIHungry(ID, Components)){
            
        }

    });


}


//actions system
export function f() {
    
}

function getScheduledTask(ID, Components) {
    
}


