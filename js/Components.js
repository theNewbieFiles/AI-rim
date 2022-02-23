import {Vec2} from "./Utilities.js";
import {Vector3} from "../lib/three.module.js";




//new components just data
export let Components = {};

//world time
Components.Time = new Map();
export function TimeComObj(){
    this.hour = 0;
    this.min = 0;

    this.delta = 0;

    this.tickTime = 1000;

    this.currentMinsInYear = 0; //525,600 mins in a year 365 days a year
    this.currentMinsInDay = 0;




}

Components.Schedule = new Map();
export function ScheduleComObj(){

}




//character stats
Components.CharacterStats = new Map();
export function CharacterStatsComObj(){
    this.strength = 0;
    this.agility = 0;
    this.luck = 0;
}

//debugger info
Components.Debugger = new Map();


Components.Inventory = new Map();

Components.Transform = new Map();
export let TransformCompObj  = function (Position, Rotation, Scale) {
    this.position = Position || new Vec2();
    this.rotation = Rotation || new Vec2();
    this.scale = Scale || new Vec2(1, 1);
    this.rotationCenter = new Vec2();
};



//todo: need to redo the render component
Components.RenderCom = new Map();


Components.Animation = new Map();
export let AnimationComObj = function(AnimationData, Repeat, CurrentFrame, FrameRate){
    this.animationData = AnimationData || console.error("no animation data");
    this.currentFrame = CurrentFrame || 0;  //the current frame they are on.
    this.repeat = Repeat || false;
    this.frameRate = FrameRate || 1;
    this.currentFrameRate = 0;
};

Components.SpriteCom = new Map();
export let SpriteComObj = function (Name, SpriteSheet, Position, Size) {
    this.name = Name || "";                 //name you want to give it
    this.spriteSheet = SpriteSheet || "";   //sprite sheet its from
    this.position = Position || new Vec2(); //the position on the sprite sheet
    this.size = Size || new Vec2();         //the width and height

};

Components.Cell = new Map();
export function CellsComObj() {
    //this.section = Section;
    this.location = new Vector3();

    //Todo: are cells 2d or 3d?
    //links to nearby cells

    this.nw = null;
    this.n = null;
    this.ne = null;
    this.e = null;
    this.w = null;
    this.sw = null;
    this.s = null;
    this.se = null;
    //todo: need to finish this for 3d;

    this.entities = [];
}


Components.CharacterCell = new Map();



Components.Movement = new Map();
export function MovementComObj(Left, Right, Up, Down){
    this.left = Left || -1;
    this.right = Right || 1;
    this.up = Up || -1;
    this.down = Down || 1;

}


Components.Gravity = new Map();
export let GravityComObj = function(X, Y){
    this.x = X || Settings.Gravity.x;
    this.y = Y || Settings.Gravity.y;
};

Components.Jump = new Map();
export let JumpComObj = function () {
    this.maxJumpHeight = 50;
    this.currentJumpHeight = 0;
};

Components.Keys = new Map(); //





Components.PlayerControlled = []; //id

Components.Container = new Map(); //this is a flag


Components.Item = new Map();
export function ItemComObj(){
    this.type = null;

}

Components.Food = new Map();
export function FoodComObj(Type, Calories){
    this.type = Type || "";
    this.calories = Calories || 0;
}










Components.Energy = new Map();
export function EnergyComObj(Current, Max, ReplenishRate, LowEnergyValue, ExhaustionValue){
    this.current = Current;
    this.max = Max || Current;
    this.replenishRate = ReplenishRate || 2;
    this.lowEnergyValue = LowEnergyValue || 25;
    this.exhaustionValue = ExhaustionValue || 10;
}

//for hunger
Components.Hunger = new Map();
export function HungerComObj(Calories){
    this.calories = Calories ||100;
}







Components.boundingBox = new Map();

export function BoundingBoxObj(Width, Height){
    this.width = Width || 0;
    this.height = Height || 0;
}

//collision table
Components.CollisionWithMap = new Map();
export function CollisionWithMapTable(Entity, Block){
    this.entity = Entity || null;
    this.block = Block || null;
}

Components.Type = new Map();
export function TypeComObj(Character){
    this.character = Character;

}
///
Components.World = {};

Components.World.Cities = new Map();


/////////////////behaviors/////////////////////
Components.BehaviorTree = new Map();
export function BehaviorTreeComObj(Root){
    this.currentNode = null;
    this.root = Root;
}



Components.NodeSelector = new Map();
export function NodeSelectorComObj(){
    this.currentNode = 0;
    this.children = [];
}




Components.MoveToPosition = new Map();
export function MoveToPositionComObj(Target) {
    this.target = Target;
    console.log("here");
}


Components.HumanAITest = new Map();
export function HumanAITestComObj(Root){
    //so far just a flag
    //maybe have a type of ai

    this.task = null;

}
Components.AI = {};

Components.AI.NPCStats = new Map();
export function NPCStats(){

    this.perception = 100;

}

Components.AI.hungry = new Map();





//3d

Components.Material = new Map();

Components.Geometry = new Map();

Components.Meshes = new Map(); 










//debugging
//components
window.Comp = Components;



//printing a list
window.printList = function (MapToPrint) {
    console.log(Components[MapToPrint]);
};

//entities
window.entity = function (ID) {
    for (const [key, value] of Object.entries(Components)) {
        try {
            if(value.has(ID)){
                console.log(value.get(ID))
            }
        }catch (e) {

        }
    }
};

