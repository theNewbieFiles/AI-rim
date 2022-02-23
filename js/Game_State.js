import {Vec2, uuidv4} from "./Utilities.js";

import {Entities} from "./entities.js";
import * as Systems from "./Systems.js";


import {Components, TransformCompObj, SpriteComObj, AnimationComObj, JumpComObj} from "./Components.js";

import * as THREE from "../lib/three.module.js";
import { PointerLockControls } from '../lib/PointerLockControls.js';

import {Scene} from "../lib/three.module.js";

import {Terrain} from "./Terrain/Terrain.js";

import {characterAnimationData} from "./old/AnimationData.js";
import {AiTest, NPC_AI_Sys, humanFactory, npcFactory} from "./GameObjects/characters.js";
import {chestFactory} from "./GameObjects/Containers.js";
import * as ComObj from "./Components.js"

import {Stats} from "../lib/Stats.js";
import {City} from "./proc/City.js";

import {CellManager} from "./Cells.js";


/**
 *
 * @param {Game} Game
 * @constructor
 */
export function Game_State(Game) {

    let game = Game;

    //seed
    noise.seed(Settings.seed);

    //stats
    let stats = new Stats();
    stats.showPanel(0);
    document.body.appendChild( stats.dom );

    let renderCount = 0;

    let mainCanvas = document.getElementById('mainCanvas');
    //mainCanvas.width = 2700;
    //mainCanvas.height = 800;


    let overlayCanvas = document.getElementById('overlayCanvas');
    overlayCanvas.width = 1200;
    overlayCanvas.height = 800;

    let overlayCtx = overlayCanvas.getContext('2d');
    overlayCtx.font = "15px Arial";














    let entities = new Entities();

    //Components

    const scene = new Scene();


    const fogColor = new THREE.Color(0xaaaabb);
    const density = 0.00004;
    //scene.fog = new THREE.FogExp2(fogColor, density);

    scene.background = fogColor

    let camera = new THREE.PerspectiveCamera( 60, 1200/800, 0.1, 150000 );
    camera.updateProjectionMatrix();

    scene.add(camera)


    let renderer = new THREE.WebGLRenderer({canvas: mainCanvas});
    renderer.setPixelRatio( 1200/800 );
    renderer.setSize(1200, 800);
    //renderer.shadowMap.enabled = true;















    let sun = new THREE.DirectionalLight(0xffffff, 1);

    //scene.add( light );
    scene.add(sun)

    let light = new THREE.HemisphereLight(0xdddddd, 0x000000, 1);
    scene.add(light)




    //raycaster
    let ray = new THREE.Raycaster();
    let down = new THREE.Vector3(0, -1, 0);


    camera.position.x = 630;
    camera.position.y = 6000;
    camera.position.z = 630;
    camera.lookAt(-0,0,-0);

    ///////////////////////world



    let terrain = new Terrain(scene);

    terrain.init(camera.position);

    /*let geo = new THREE.PlaneGeometry(1024, 1024, 1, 1);
    geo.rotateX(-Math.PI/2);
    let mat = new THREE.MeshStandardMaterial();
    let world = new THREE.Mesh(geo, mat);
    scene.add(world);*/


    //////////////////controls
    let controls = new PointerLockControls(camera, document.body);

    mainCanvas.addEventListener('click', () =>{controls.lock()}, false);





    /////////////////////////////Time///////////////////////////////////
    let time = entities.create("worldTime");
    Components.Time.set(time, new ComObj.TimeComObj());

    ///////////////////////////////testing///////////////////////////////////////////
    /*let cellManager = new CellManager(game.getAssetManager(), scene);

    cellManager.createCell(camera.position)*/


    let city = new City(0, camera.position, 100, scene);





//////////////////////////////////////////////////////////////////////////


    this.init = function () {







    };

    let heightValue = 6;

    this.update = function (Delta) {
        stats.begin();

        terrain.update(camera.position);



        //Systems.TimeSys(Components, Delta);

        Systems.input_Sys(game.keyboardInput, Components);
        //Systems.playerControlled_Sys(Components);

        //AiTest(Components);


        if(game.keyboardInput.isKeyDown('KeyQ')){
            controls.moveForward(250)
        }
        if(game.keyboardInput.isKeyDown('KeyW')){
            controls.moveForward(25)
        }
        if(game.keyboardInput.isKeyDown('KeyE')){
            controls.moveForward(.5)
        }
        if(game.keyboardInput.isKeyDown('KeyA')){
            controls.moveRight(-0.25)
        }
        if(game.keyboardInput.isKeyDown('KeyS')){
            controls.moveForward(-5)
        }
        if(game.keyboardInput.isKeyDown('KeyD')){
            controls.moveRight(0.25)
        }

        if(game.keyboardInput.isKeyDown('KeyX')){
            camera.position.y += 50;
        }
        if(game.keyboardInput.isKeyDown('KeyZ')){
            camera.position.y -= 50;
        }
        if(game.keyboardInput.isKeyDown('KeyF')){

        }
        if(game.keyboardInput.isKeyDown('KeyC')){
            //console.log(renderer.info);

            camera.position.x = 0;
            camera.position.z = 0;
        }

        if(game.keyboardInput.isKeyDown('KeyP')){
            game.keyboardInput.clearKeys();
            Settings.flyMode = !Settings.flyMode;
        }


        //world.update(camera.position, scene)



        if(!Settings.flyMode){
            camera.position.y += 100;
            ray.set(camera.position, down);


            let intersects = ray.intersectObjects(scene.children, true);


            if(intersects.length > 0){
                camera.position.set(intersects[0].point.x, intersects[0].point.y, intersects[0].point.z);

                camera.position.y += heightValue;
            }else{
                //console.log("nothing beneath me")
            }
        }



        stats.end();
    };

    this.render = function (Delta) {
        renderer.render( scene, camera );

        //clear over lay
        overlayCtx.clearRect(0, 0, 100, 50);
        overlayCtx.fillText("x: " + Math.floor(camera.position.x), 10, 15);
        overlayCtx.fillText("y: " + Math.floor(camera.position.y), 10, 30);
        overlayCtx.fillText("z: " + Math.floor(camera.position.z), 10, 45);



    };


}