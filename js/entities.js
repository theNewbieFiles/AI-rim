import {uuidv4} from "./Utilities.js";

export function Entities() {
    let entities = [];

    this.create = function (ID) {
        let id = ID || uuidv4();

        entities.push(id);

        return id;
    };
    /*this.create = function (ID, Name, Description) {
        let entity = {};
        entity.id = ID || uuidv4();
        entity.name = Name;
        entity.description = Description;

        entities.push(entity);

        return entity;
    };*/

    this.printEntities = function () {
        console.log(entities);
    };

    //console access
    window.printEntites = this.printEntities;
}

export function EntityManager(){

}