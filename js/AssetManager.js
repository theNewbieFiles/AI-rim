import * as THREE from "../lib/three.module.js";
import {assetList} from "./assetList.js";
import {GLTFLoader} from "../lib/GLTFLoader.js";


export function AssetManager(Game) {
    let models = {};
    let textures = new Map();
    let allModelsDoneLoading = false;

    let loadingManager = new THREE.LoadingManager();

    let modelLoader = new GLTFLoader(loadingManager);

    let textureLoader = new THREE.TextureLoader();


    this.init = function () {

        for(let asset in assetList){
            models[asset] = {};
            modelLoader.load(
                assetList[asset].url,
                //onload
                glft => {

                    //loop thru the models and add them to the asset object
                    glft.scene.children.forEach((model, index) => {

                        models[asset][model.name] = model;
                    });


                },
                null, //on progress

                //on error
                error => {
                    console.error(error, asset);
                }
                )
        }


        //when all models are done loading
        loadingManager.onLoad = () =>{
            allModelsDoneLoading = true;
        }

    };

    this.loadTexture = function (TextureName) {

    }

    this.loadSet = function (LoadList, loadingCallback, callback) {


    };

    this.update = function (Delta) {

    }

    this.getModels = function () {
        return models;
    }
    
    function loadModel(ItemID) {
        let item = assetList[ItemID]

        return new Promise((resolve, reject) => {
            modelLoader.load(item.url, resolve, null, reject);
        });
    }

    this.allModelsLoaded = function () {
        return allModelsDoneLoading;
    }
}