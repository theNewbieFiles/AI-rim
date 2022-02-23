import {AnimationComObj, TransformCompObj} from "../Components.js";
import {Vector3} from "../../lib/three.module.js";




/**
 *
 * @param ID {string}
 * @param Components {object}
 */
export function chestFactory(ID, Components) {

    Components.Container.set(ID, true);

    Components.Transform.set(ID, new TransformCompObj());

    Components.Animation.set(ID, new AnimationComObj("Chest", false, 0, 1));

    Components.Inventory.set(ID, []);
}