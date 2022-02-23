/*
* Thanks to simonDev for the help
* https://www.youtube.com/watch?v=YO_A5w_fxRQ
*
* https://github.com/simondevyoutube/ProceduralTerrain_Part3/tree/25f3563a0702d70eecb40266f578757c4f88eb5b
*
*/

import {Vector3} from "../../lib/three.module.js";
import * as THREE from "../../lib/three.module.js";
import {QuadTree} from "./QuadTree.js";
import {lerp, TerrainUtils} from "../Utilities.js";

import {noise2} from "../noise2.js";


export function Terrain(Scene){

    let manager = new TerrainManager(Scene);
    //let manager = new TerrainManagerV2(Scene);
    //let manager = new TerrainManager_old(Scene)

    this.init = function (Pos) {
        manager.buildTerrain(Pos)
        //manager.init(Pos)

    };

    this.update = function (position) {
        manager.update(position)



    };

    this.rebuild = function(){
        manager.rebuild();
    }



}

function TerrainManager(Scene){
    let self = this;
    function generateKey(c) {
        return c.center[0] + '/' + c.center[1] + ' [' + c.dimensions[0] + ']';
    }

    let group = new THREE.Group();
    Scene.add(group);



    let chunks = {};
    let newTerrainChunks = {};
    let allChunks  = {};
    let hiddenChunks = {};

    let lastPos = new THREE.Vector2();
    let newPos = new THREE.Vector2();

    let buildList = new Set();

    this.update = function (Pos) {
        newPos.x = Pos.x;
        newPos.y = Pos.z;

        //console.log(lastPos.distanceTo(newPos))
        if(lastPos.distanceTo(newPos)> 500){
            self.buildTerrain(Pos);
        }


        if(buildList.size>0){


            const k = buildList.values().next().value; //get the first element in the set

            if(chunks[k]){
                chunks[k].chunk.generate();

                //remove that key
                buildList.delete(k);
            }else{
                console.log(k, " isn't in the list");
                buildList.delete(k);
            }

        }
    };

    this.buildTerrain = function (Pos) {
        lastPos.x = Pos.x;
        lastPos.y = Pos.z;

        //create a new quadTree
        let q = new QuadTree({
            min: new THREE.Vector2(-Settings.mapSizeHalf, -Settings.mapSizeHalf),
            max: new THREE.Vector2(Settings.mapSizeHalf, Settings.mapSizeHalf)
        });

        //let the quadtree quad
        q.insert(Pos);

        //get the children
        let children = q.getChildren();

        //reset chunks
        newTerrainChunks = {};

        for(let k in chunks){}


        let center = new THREE.Vector2();
        let dimensions = new THREE.Vector2();

        for (let c of children) {

            c.bounds.getCenter(center);
            c.bounds.getSize(dimensions);

            const child = {
                center: [center.x, center.y],
                dimensions: [dimensions.x, dimensions.y]
            };

            const k = generateKey(child);
            newTerrainChunks[k] = child;

        }

        //newTerrainChunks is the list of chunks that are currently needed;

        //const intersection = TerrainUtils.DictIntersection(chunks, newTerrainChunks); //list of chunks already created

        //const difference = TerrainUtils.DictDifference(newTerrainChunks, chunks); //list of chunks that need to be created

        //list of chunks that aren't needed anymore;


        //newTerrainChunks = intersection; //newTerrainChunks is now the list of all chunks already created




        //add the chunks that haven't been created
        for (let k in newTerrainChunks) {

            //first check if the chunk already exist
            if(k in chunks){
                //it is so show it
                chunks[k].chunk.show();

            }else{
                //it doesn't exist so create it
                chunks[k] = {
                    center: newTerrainChunks[k].center,
                    dimensions: newTerrainChunks[k].dimensions,
                    chunk: createTerrainChunk(newTerrainChunks[k].center, newTerrainChunks[k].dimensions),

                };

                //buildList.add(k);
            }



            //testing
            if(Settings.firstChunk)break
        }

        const hidden = TerrainUtils.DictDifference(chunks, newTerrainChunks);

        //debugger

        //chunks are now the list of all active chunks
        //chunks = newTerrainChunks;

        //recycle chunks not needed;
        for (let k in hidden) {
            hidden[k].chunk.hide();



        }

    };



    function createTerrainChunk(Center, Dimensions, Offset) {

        let temp = new TerrainChunk(
            self,
            new THREE.Vector3(Center[0], 0, Center[1]),
            Dimensions[0],
            group

        );

        temp.init();
        temp.generate();

        return temp;
    }

}


/**
 *
 * @param Manager {TerrainManager}
 * @param Center {Vector3}
 * @param Dimensions {number}
 * @param Group {Group}
 * @constructor
 */
function TerrainChunk(Manager, Center, Dimensions, Group, ) {
    let center = Center || console.error("Missing Center");
    let dimensions = Dimensions;
    let group = Group;
    let subdivisions = 48;

    let canvas, ctx, imageData, texture, geometry, material, plane;




    this.init = function(){

        canvas = document.createElement('canvas');
        canvas.width = 48;
        canvas.height = 48;
        ctx = canvas.getContext('2d');
        ctx.fillStyle = 'magenta'; //bright pink to indicate something is wrong;
        ctx.fillRect(0,0,canvas.width, canvas.height);
        imageData = ctx.createImageData(48, 48);
        texture = new THREE.CanvasTexture(canvas);

        //create the geometry
        geometry = new THREE.PlaneGeometry(dimensions, dimensions, subdivisions, subdivisions);
        geometry.rotateX(-Math.PI/2); //so y is up

        //create the material
        material = new THREE.MeshPhongMaterial({
            /*vertexColors: true,
            color: color,    // red (can also use a CSS color string here)*/
            flatShading: true,
            wireframe: false,
            map: texture,
        });

        //create the mesh
        plane = new THREE.Mesh(
            geometry,
            material);
        plane.castShadow = false;
        plane.receiveShadow = true;

        //set the position
        plane.position.set(
            center.x,
            center.y,
            center.z
        );

        //add it to the group
        group.add(plane);


    }

    this.generate = function() {

        let cen = new THREE.Vector2(0,0);
        let point;
        let d;
        let f = Math.sqrt(0.5);
        let total, nx, ny, tx, ty;

        let pixelIndex;

        let count = 0;
        let vertices = ((subdivisions+1)**2)*3;

        for(let j = 0; j < vertices ; j = j + 3){

            nx = (plane.geometry.attributes.position.array[j] + center.x);
            ny = (plane.geometry.attributes.position.array[j + 2] + center.z);

            total = noise2(nx, ny, Settings.mapSize, Settings.mapSize);// * Settings.heightScale;

            //point = new THREE.Vector2(nx/Settings.mapSize - .5, ny/Settings.mapSize - .5);
            point = new THREE.Vector2(nx, ny);

            d = point.length() / 100;

            //d = Math.sqrt(point.x*point.x + point.y*point.y) / f;

            //f = lerp(d, )
            total *= Settings.heightScale;
            console.log(total, d)


            total = (total - d);






            /*if(total < 10){
                total -= (10 - total) * 6.2;
            }*/
            //texture
            tx = count % 49;
            ty = Math.floor(count / 49);

            pixelIndex = (ty * 48 + tx) * 4;

            textureData(total, imageData.data, pixelIndex);




            plane.geometry.attributes.position.array[j + 1] = total ;

            count++;
        }





        //plane.geometry.elementsNeedUpdate = true;
        //plane.geometry.verticesNeedUpdate = true;
        //plane.geometry.computeVertexNormals();
        plane.geometry.computeBoundingSphere();
        plane.geometry.computeBoundingBox();
        //plane.updateMatrix();
        plane.geometry.attributes.position.needsUpdate = true;
        //plane.frustumCulled = false;

        //update texture
        ctx.putImageData(imageData, 0, 0);
        texture.needsUpdate = true;
    }

    function textureData(height, imageData, location) {
        //red green blue
        if(height > 10000){
            imageData[location]     = 255;
            imageData[location + 1] = 255;
            imageData[location + 2] = 255;
            imageData[location + 3] = 255;
        }

        if(height < 10000){
            imageData[location]     = 95;
            imageData[location + 1] = 95;
            imageData[location + 2] = 95;
            imageData[location + 3] = 255;
        }

        if(height < 5000){
            imageData[location] = 0;
            imageData[location + 1] = 125;
            imageData[location + 2] = 0;
            imageData[location + 3] = 255;
        }


        if(height < 11){
            imageData[location] = 0;
            imageData[location + 1] = 0;
            imageData[location + 2] = 125;
            imageData[location + 3] = 255;

        }





    }

    this.show = function () {
        plane.visible = true;
        group.add(plane);
    };

    this.hide = function () {
        plane.visible = false;
        group.remove(plane);


    };

    this.dispose = function () {
        plane.visible = false;
        plane.parent.remove(plane);
        group.remove(plane);
        //need to remove the material and geometry
    }



}







function invLerp(a, b, v) {
    return (v-a) / (b-a);
}


function TerrainManager_old(Scene){
    let self = this;
    function generateKey(c) {
        return c.center[0] + '/' + c.center[1] + ' [' + c.dimensions[0] + ']';
    }

    let group = new THREE.Group();
    Scene.add(group);

    let currentChunk;



    let chunks = {};
    let newTerrainChunks = {};
    let lastPos = new THREE.Vector2();
    let newPos = new THREE.Vector2();

    this.update = function (Pos) {
        newPos.x = Pos.x;
        newPos.y = Pos.z;

        //console.log(lastPos.distanceTo(newPos))
        if(lastPos.distanceTo(newPos)> 500){
            console.log("updating");
            self.buildTerrain(Pos);
        }
    };

    this.buildTerrain = function (Pos) {

        lastPos.x = Pos.x;
        lastPos.y = Pos.z;

        //create a new quadTree
        let q = new QuadTree({
            min: new THREE.Vector2(-Settings.mapSizeHalf, -Settings.mapSizeHalf),
            max: new THREE.Vector2(Settings.mapSizeHalf, Settings.mapSizeHalf)
        });

        q.insert(Pos);

        let children = q.getChildren();

        newTerrainChunks = {};


        let center = new THREE.Vector2();
        let dimensions = new THREE.Vector2();

        for (let c of children) {

            c.bounds.getCenter(center);
            c.bounds.getSize(dimensions);

            const child = {
                center: [center.x, center.y],
                dimensions: [dimensions.x, dimensions.y]
            };

            const k = generateKey(child);
            newTerrainChunks[k] = child;

        }


        if(chunks === newTerrainChunks){
            console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        }


        const intersection = TerrainUtils.DictIntersection(chunks, newTerrainChunks); //list of chunks already created
        const difference = TerrainUtils.DictDifference(newTerrainChunks, chunks); //list of chunks that need to be created

        //list of chunks that aren't needed anymore;
        const recycle = TerrainUtils.DictDifference(chunks, newTerrainChunks);



        newTerrainChunks = intersection; //newTerrainChunks is now the list of all chunks already created




        //add the chunks that haven't been created
        for (let k in difference) {
            newTerrainChunks[k] = {
                center: difference[k].center,
                dimensions: difference[k].dimensions,
                chunk: createTerrainChunk(difference[k].center, difference[k].dimensions),

            };


            //testing
            if(Settings.firstChunk)break
        }

        chunks = newTerrainChunks;

        //recycle chunks not needed;
        for (let k in recycle) {

            let chunk = recycle[k].chunk;

            chunk.hide();


        }

    };

    this.rebuild = function () {

        for (let c in newTerrainChunks){
            //newTerrainChunks[c].chunk.generate();


        }
    };

    function createTerrainChunk(Center, Dimensions, Offset) {

        let temp = new TerrainChunk(
            self,
            new THREE.Vector3(Center[0], 0, Center[1]),
            Dimensions[0],
            group

        );

        temp.init();
        temp.generate();

        return temp;
    }

}

function TerrainManagerV2(Scene) {
    let self = this;
    let group = new THREE.Group();
    Scene.add(group);

    let bigChunks = [];
    let medChunks = [];
    let smallChunks = [];


    /**
     *
     * @param Pos {Vector3}
     */
    this.init = function (Pos) {
        //create big chunks
        for (let i = 0; i < 9; i++) {
            let x = i % 3;
            let y = Math.floor(i/3);

            x--;
            y--;
            if(x === 0 && y === 0)continue
            let position = new Vector3(Pos.x + x * 15360, 0 , Pos.z + y * 15360);



            bigChunks[i] = new TerrainChunk(self, position, 15360, group);
            bigChunks[i].init()
            bigChunks[i].generate();
        }

        //med chunks
        for (let i = 0; i < 9; i++) {
            let x = i % 3;
            let y = Math.floor(i/3);

            x--;
            y--;
            if(x === 0 && y === 0)continue

            let position = new Vector3((Pos.x)  + (x * 5120), 0 , (Pos.z) + (y * 5120));

            medChunks[i] = new TerrainChunk(self, position, 5120, group);
            medChunks[i].init()
            medChunks[i].generate();
        }

        //small chunks
        for (let i = 0; i < 25; i++) {
            let x = i % 5;
            let y = Math.floor(i/5);

            x-=2;
            y-=2;

            //if(x === 0 && y === 0)continue


            let position = new Vector3(Pos.x + x * (1024), 0 , Pos.z + y * (1024));



            smallChunks[i] = new TerrainChunk(self, position, 1024, group);
            smallChunks[i].init()
            smallChunks[i].generate();
        }



    }



    this.update = function(Pos){

    }
















    function generateKey(c) {
        return c.center[0] + '/' + c.center[1] + ' [' + c.dimensions[0] + ']';
    }
}