import {Vector2} from "../lib/three.module.js";
import {Group} from "../lib/three.module.js";
import {cellData} from "./Data/cellData.js";


export function CellManager(AssetManager, Scene) {
    let cells = new Map();
    let cellSize = Settings.cellSize;
    let models = AssetManager.getModels();
    let scene = Scene;


    /**
     *
     * @param Pos {Vector3}
     */
     function getCellOnMap(Pos) {
        let position = new Vector2(Pos.x, Pos.z);

        position.x = Math.floor(position.x / cellSize);
        position.y = Math.floor(position.y / cellSize);

        return position;
    };

    /**
     *
     * @param Pos {Vector3}
     */
    this.createCell = function (Pos) {

        //debugger
        let data = cellData[genKey(getCellOnMap(Pos))];
        let cell = new Cell();

        /*data.assetList.forEach(mesh => {
            let asset = models[mesh.parent][mesh.asset].clone();

            asset.position.set(
                mesh.x,
                mesh.y,
                mesh.z
            );
            asset.rotateX(mesh.rx *  Math.PI/180);
            asset.rotateY(mesh.ry *  Math.PI/180);
            asset.rotateZ(mesh.rz *  Math.PI/180);

            cell.group.add(asset);
        })*/

        scene.add(cell.group);
        cells.set(data, cell);

    };

    /**
     *
     * @param Pos {Vector2}
     */
    function genKey(Pos) {
        return Pos.x + "," + Pos.y;
    }
}



function Cell() {

    this.group = new Group();
    
    this.show = function () {
        
    };
    
    this.hide = function () {
        
    };
    
    this.dispose = function () {
        
    }
}