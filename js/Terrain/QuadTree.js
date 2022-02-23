/*
* Thanks to simonDev for the help
* https://www.youtube.com/watch?v=YO_A5w_fxRQ
*
* https://github.com/simondevyoutube/ProceduralTerrain_Part3/tree/25f3563a0702d70eecb40266f578757c4f88eb5b
*
*/

import * as THREE from "../../lib/three.module.js";

export function QuadTree(params) {

    let minNodeSize = 2000;

    let b = new THREE.Box2(params.min, params.max); //min and max need to be vector 2
    let root = {
        bounds: b,
        children: [],
        center: b.getCenter(new THREE.Vector2()),
        size: b.getSize(new THREE.Vector2())

    };
    this.root = root;
    
    this.getChildren = function () {
        let children = [];
        getChildren(root, children);
        return children;
    };

    /**
     *
     * @param node {Object}
     * @param target {Array}
     */
    function getChildren(node, target) {

        if(node.children.length === 0){
            target.push(node);
            return;
        }

        for (let c of node.children) {
            getChildren(c, target);
        }
    }


    this.insert = function (pos) {
        insert(root, new THREE.Vector2(pos.x, pos.z))//why create a new one ?
    };
    
    function insert(child, pos) {
        const distToChild = child.center.distanceTo(pos);

        if(distToChild < child.size.x && child.size.x > minNodeSize){
            child.children = createChildren(child);
        }

        for (let c of child.children) {
            insert(c, pos);
        }
    }


    function createChildren(child) {
        const midPoint = child.bounds.getCenter(new THREE.Vector2());

        //top left
        let b1 = new THREE.Box2(child.bounds.min, midPoint);

        //top right
        let b2 = new THREE.Box2(
            new THREE.Vector2(midPoint.x, child.bounds.min.y),
            new THREE.Vector2(child.bounds.max.x, midPoint.y)
        );

        //bottom left
        let b3 = new THREE.Box2(
            new THREE.Vector2(child.bounds.min.x, midPoint.y),
            new THREE.Vector2(midPoint.x, child.bounds.max.y)
        );

        //bottom right
        let b4 = new THREE.Box2(
            midPoint,
            child.bounds.max
        );

        let children = [b1, b2, b3, b4].map(
            b => {
                return {
                    bounds: b,
                    children: [],
                    center: b.getCenter(new THREE.Vector2()),
                    size: b.getSize(new THREE.Vector2())
                }
            }
        );
        return children;
    }



}