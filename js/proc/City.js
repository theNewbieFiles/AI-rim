import * as THREE from "../../lib/three.module.js";


/**
 *
 * @param Seed {String}
 * @param Position {Vector3}
 * @param Length {number}
 * @param Scene {Scene}
 * @constructor
 */
export function City(Seed, Position, Length, Scene) {

    //identify the area
    //nodes can be vecter3s
    let nodes = [];

    let ray = new THREE.Raycaster();
    let down = new THREE.Vector3(0, -1, 0);


    ray.set(Position, down);
    let intersects = ray.intersectObjects(Scene.children, true);
    console.log(intersects)


    //roads 
    
    
    //generate a list of nodes

    //connect nodes to make roads

    //create regions

    //add buildings 
}

City.prototype.analyze = function () {

};

function Roads() {
    
}
