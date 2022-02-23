/*
* Thanks to simonDev for the help
* https://www.youtube.com/watch?v=YO_A5w_fxRQ
*
* https://github.com/simondevyoutube/ProceduralTerrain_Part3/tree/25f3563a0702d70eecb40266f578757c4f88eb5b
*
*/

import {Vector3} from "../lib/three.module.js";
import * as THREE from "../lib/three.module.js";
import {QuadTree} from "./QuadTree.js";
import {lerp, TerrainUtils} from "./Utilities.js";

import {noise2} from "./noise2.js";


export function Terrain(Scene){



    let manager = new TerrainManager(Scene);







    this.init = function (Location) {

        //self.generateSection(Location)



    };

    /*this.generateSection = function (Location, Scene) {
        //figure out what section your in
        let currentPixel = new Vector3();

        //current pixel
        currentPixel.x = Math.floor(Location.x / 3); //a section is 1 mile 5280/20 = 264 a cell is 20 and 1 pixel on the image
        currentPixel.z = Math.floor(Location.z / 3);


        //figure out what section that pixel is in
        let currentSection = new Vector3();

        currentSection.x = Math.floor(currentPixel.x / 1760);
        currentSection.z = Math.floor(currentPixel.z / 1760);


        //TODO: figure out what the texture is
        //generate the material
        let sectionMat = new THREE.MeshStandardMaterial({/!*color: Color,*!/ flatShading: true, side: THREE.DoubleSide});


        let sectionGeo = new THREE.PlaneGeometry(5280, 5280, 1760, 1760);

        sectionGeo.rotateX( - Math.PI / 2 );//rotate so y is up


        let imgd = context.getImageData((currentSection.x * 1760), (currentSection.z * 1760), 1761, 1761);

        for(let i = 0, j = 0; i < imgd.data.length; j += 3, i += 4){
            sectionGeo.attributes.position.array[j+1] = (imgd.data[i] * 3) / (12/10);

        }



        let sectionMesh = new THREE.Mesh(sectionGeo, sectionMat);

        sectionMesh.position.set(currentSection.x * 5280, 0, currentSection.z * 5280);


        let section = new Section(keyGenerator(currentSection));
        section.location = currentSection;
        section.mesh = sectionMesh;

        worldMap.set(section.id, section);

        Scene.add(sectionMesh)

        //clean up
        imgd = null;



    };*/



    this.generateSection = function (Location, Img) {
        //figure out what pixel your in
        let currentPixel = new Vector3();

        //current pixel
        currentPixel.x = Math.floor(Location.x / 20); //a section is 1 mile 5280/20 = 264 a cell is 20 and 1 pixel on the image
        currentPixel.z = Math.floor(Location.z / 20);


        //figure out what section that pixel is in
        let currentSection = new Vector3();

        currentSection.x = Math.floor(currentPixel.x / 264);
        currentSection.z = Math.floor(currentPixel.z / 264);


        //TODO: figure out what the texture is
        //generate the material
        const texture = new THREE.TextureLoader().load( 'img/checkered.png' );


        //let sectionMat = new THREE.MeshLambertMaterial();
        let sectionMat = new THREE.MeshLambertMaterial();


        let sectionGeo = new THREE.PlaneGeometry(5280, 5280, 264, 264);

        sectionGeo.rotateX( - Math.PI / 2 );//rotate so y is up


        let imgd = context.getImageData((currentSection.x * 264), (currentSection.z * 264), 265, 265);

        for(let i = 0, j = 0; i < imgd.data.length; j += 3, i += 4){


            let value = (imgd.data[i] + imgd.data[i+1] + imgd.data[i+2])/3 ;

            /*value = value * value;
            value = value / 25;*/


            sectionGeo.attributes.position.array[j+1] = value * 12;
        }

        sectionGeo.computeFaceNormals();
        sectionGeo.computeVertexNormals();

        let sectionMesh = new THREE.Mesh(sectionGeo, sectionMat);

        sectionMesh.position.set(currentSection.x * 5280, 0, currentSection.z * 5280);


        let section = new Section(keyGenerator(currentSection));
        section.location = currentSection;
        section.mesh = sectionMesh;

        worldMap.set(section.id, section);



        //clean up
        imgd = null;

    };




    this.update = function (position) {
        manager.update(position)



        /*let currentPixel = new Vector3();

        //current pixel
        currentPixel.x = Math.floor(Location.x / 20); //a section is 1 mile 5280/20 = 264 a cell is 20 and 1 pixel on the image
        currentPixel.z = Math.floor(Location.z / 20);


        //figure out what section that pixel is in
        let currentSection = new Vector3();

        currentSection.x = Math.floor(currentPixel.x / 264);
        currentSection.z = Math.floor(currentPixel.z / 264);


        let key = keyGenerator(currentSection);

        //check if the location has been created yet
        if(!worldMap.has(key)){

            self.generateSection(Location, Texture);
            scene.add(worldMap.get(key).mesh);
        }*/


    };

    this.rebuild = function(){
        manager.rebuild();
    }

    this.render = function () {

    }





}

function TerrainManager(Scene){
    let self = this;
    function generateKey(c) {
        return c.center[0] + '/' + c.center[1] + ' [' + c.dimensions[0] + ']';
    }

    let group = new THREE.Group();
    Scene.add(group);



    let material = new THREE.MeshStandardMaterial({
        wireframe: false,
        wireframeLinewidth: 1,
        color: 0xFFFFFF,
        side: THREE.FrontSide,
        vertexColors: THREE.VertexColors,
    });


    let newTerrainChunks = {};
    let chunks = {};

    this.update = function (Pos) {

        //create a new quadTree
        let q = new QuadTree({
            min: new THREE.Vector2(-Settings.mapSizeHalf, -Settings.mapSizeHalf),
            max: new THREE.Vector2(Settings.mapSizeHalf, Settings.mapSizeHalf)
        });

        q.insert(Pos);

        let children = q.getChildren();



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
        const intersection = TerrainUtils.DictIntersection(chunks, newTerrainChunks); //list of chunks already created
        const difference = TerrainUtils.DictDifference(newTerrainChunks, chunks); //list of chunks that need to be created

        newTerrainChunks = intersection;




        for (let k in difference) {
            newTerrainChunks[k] = {
                center: difference[k].center,
                dimensions: difference[k].dimensions,
                chunk: createTerrainChunk(difference[k].center, difference[k].dimensions),

            };
            if(Settings.firstChunk)break
        }



    };

    this.rebuild = function () {

        for (let c in newTerrainChunks){
            newTerrainChunks[c].chunk.generate();


        }
    }

    function createTerrainChunk(Center, Dimensions) {


        return new TerrainChunk(
            self,
            new THREE.Vector3(Center[0], 0, Center[1]),
            Dimensions[0],
            group

        );

        /*let position = new THREE.Vector3(Center[0], 0, Center[1]);

        let subdivisions = Math.floor(50 / (Dimensions[0] / 1072.5));
        if(subdivisions < 15) subdivisions *= 3



        let geo = new THREE.PlaneGeometry(Dimensions[0], Dimensions[1], subdivisions, subdivisions);
        geo.rotateX(-Math.PI/2); //so y is up





        for(let j = 0; j < ((subdivisions+1)**2)*3 ; j= j + 3){

            let nx = (geo.attributes.position.array[j] + position.x);
            let ny = (geo.attributes.position.array[j + 2] + position.z);


            geo.attributes.position.array[j + 1] = noiseGenerator.get(nx, ny)

        }





        const color = new THREE.Color().set(Math.random() * 0xffffff);

        let mat = new THREE.MeshStandardMaterial({color: color, wireframe: false});

        let _plane = new THREE.Mesh(
            geo,
            mat);
        _plane.castShadow = false;
        _plane.receiveShadow = true;
        //_plane.rotation.x = -Math.PI / 2;

        _plane.position.set(
            position.x,
            position.y,
            position.z
        );
        group.add(_plane);






        return _plane;*/
    }







}

function TerrainChunk(Manager, Center, Dimensions, Group, ) {

    let center = Center || console.error("Missing Center");
    let dimensions = Dimensions;
    let position = new THREE.Vector2(center.x - dimensions/2, center.z - dimensions/2);
    let imagePos = new THREE.Vector2();
    imagePos.x = (position.x + Settings.mapSizeHalf)  / (Settings.mapSize/256);
    imagePos.y = (position.y + Settings.mapSizeHalf) / (Settings.mapSize/256);

    let imgDim = dimensions / (Settings.mapSize/256);




    let group = Group;
    let subdivisions = 48;

    let canvas = document.createElement('canvas');
    canvas.width = 48;
    canvas.height = 48;
    let ctx = canvas.getContext('2d');
    ctx.fillStyle = 'magenta';
    ctx.fillRect(0,0,canvas.width, canvas.height);

    //document.body.appendChild(canvas)

    let imageData = ctx.createImageData(48, 48);



    let texture = new THREE.CanvasTexture(canvas);





    let geometry = new THREE.PlaneGeometry(dimensions, dimensions, subdivisions, subdivisions);
    geometry.rotateX(-Math.PI/2); //so y is up

    const color = new THREE.Color().set(Math.random() * 0xffffff);

    let material = new THREE.MeshPhongMaterial({
        /*vertexColors: true,
        color: color,    // red (can also use a CSS color string here)*/
        flatShading: true,
        wireframe: false,
        map: texture,
    });

    //creating the mesh
    let plane = new THREE.Mesh(
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
    group.add(plane);






    this.generate = function () {

        let total, nx, ny, tx, ty;
        /*let ratio = dimensions/48;
        let halfDim = dimensions / 2;*/

        let pixelIndex;

        let count = 0;
        let vertices = ((subdivisions+1)**2)*3;

        for(let j = 0; j < vertices ; j = j + 3){

            nx = (plane.geometry.attributes.position.array[j] + center.x);
            ny = (plane.geometry.attributes.position.array[j + 2] + center.z);

            total = noise2(nx, ny, 65536, 65536) * Settings.heightScale;

            //texture
            tx = count % 49;
            ty = Math.floor(count / 49);

            pixelIndex = (ty * 48 + tx) * 4;

            textureData(total, imageData.data, pixelIndex);




            plane.geometry.attributes.position.array[j + 1] = total ;

            count++;
        }





        plane.geometry.elementsNeedUpdate = true;
        plane.geometry.verticesNeedUpdate = true;
        plane.geometry.computeVertexNormals();
        plane.updateMatrix();
        plane.geometry.attributes.position.needsUpdate = true;

        //update texture

        //needs rotating
        ctx.translate(canvas.width/2,canvas.height/2);
        ctx.rotate(0*Math.PI/180);
        ctx.putImageData(imageData, 0, 0);

        texture.needsUpdate = true;
    };

    function textureData(height, imageData, location) {
        //red green blue
        if(height > 12000){
            imageData[location]     = 255;
            imageData[location + 1] = 255;
            imageData[location + 2] = 255;
            imageData[location + 3] = 255;
        }

        if(height < 12000){
            imageData[location]     = 125;
            imageData[location + 1] = 125;
            imageData[location + 2] = 125;
            imageData[location + 3] = 255;
        }

        if(height < 5000){
            imageData[location] = 0;
            imageData[location + 1] = 125;
            imageData[location + 2] = 0;
            imageData[location + 3] = 255;
        }


        if(height < 100){
            imageData[location] = 0;
            imageData[location + 1] = 0;
            imageData[location + 2] = 125;
            imageData[location + 3] = 255;

        }





    }

    this.rebuild = function () {

        /*
        * geometry.getAttribute("color");*/
        console.log('rebuilding chunk...')
        var colors = new Uint8Array( [
            255,  0,  0,
            0,  255,  0,
            0,  0,  255,

            0,  0,  255,
            0,  255,  0,
            255,  0,  0
        ] );

        plane.geometry.setAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );


        for(let j = 0; j < ((subdivisions+1)**2)*3 ; j= j + 3){

            let nx = (plane.geometry.attributes.position.array[j] + center.x);
            let ny = (plane.geometry.attributes.position.array[j + 2] + center.z);




            let value = Manager.get(nx, ny) * 10;

            let added = heightGenerator.get2(nx, ny);

            //added *= added;

            let total = value * added;


            plane.geometry.attributes.position.array[j + 1] =  total * 5280 ;

        }


        plane.geometry.elementsNeedUpdate = true;
        plane.geometry.verticesNeedUpdate = true;
        plane.geometry.computeVertexNormals();
    };


    this.generate();

}







function invLerp(a, b, v) {
    return (v-a) / (b-a);
}



function HeightGenerator(Generator, Position, MinRadius, MaxRadius) {
    let position = Position.clone();
    let radius = [MinRadius, MaxRadius];
    let generator = Generator;

    this.get = function (X, Y) {
        const distance = position.distanceTo(new THREE.Vector2(X, Y));

        let x = (distance - radius[0]) / (radius[1] - radius[0]);
        let normalization = 1.0 - Math.min(Math.max(x, 0.0), 1.0);

        normalization = normalization * normalization * (3 - 2 * normalization);

        return [generator.get(X, Y), normalization];
    }
}

