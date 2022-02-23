import {Vec2} from "../Utilities";

export function Camera(position, windowSize, world) {
    this.position = new Vec2();
    this.window = new Vec2(window.Settings.cameraWidth, window.Settings.cameraHeight);
}