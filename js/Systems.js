import {Vec2} from "./Utilities.js";
import {JumpComObj} from "./Components.js";


/**
 *
 * @param {Health_Comp} Health_Comp
 * @param {Death_Comp} Death_Comp
 * @constructor
 */
export function Health_Sys(Health_Comp, Death_Comp) {
    let hp = Health_Comp;
    let death = Death_Comp;

    this.addHealth = function (ID, amount) {
        let temp = hp.getIndividual(ID);

        if(temp.currentHp + amount > temp.maxHp){
            temp.currentHp = temp.maxHp;
        }else{
            temp.currentHp += amount;
        }

    };

    this.subHealth = function (ID, amount) {
        let temp = hp.getIndividual(ID);

        if(temp){
            if(temp.currentHp - amount <= 0){
                temp.currentHp = 0;

            }else{
                temp.currentHp -= amount;


            }
        }
    };

    this.setCurrentHp = function (ID, value) {
        hp.get(ID).currentHp = value;
    };

    this.setMaxHp = function (ID, value) {
        hp.get(ID).maxHp = value;
    };

    this.create = function (Id, currentHp, maxHp) {
        hp.create(Id, currentHp, maxHp);
    }

}

/**
 *
 * @param Velocity_Comp
 * @param Transform_Comp
 * @constructor
 */
export function Velocity_Sys(Velocity_Comp, Transform_Comp) {
    let velocity = Velocity_Comp;
    let position = Position_Comp;

    let velocities = [];

    this.add = function (Id, vector) {
        if(vector instanceof Vec2){
            let temp = {};
            temp.id = Id;
            temp.vec = vector;

            velocities.push(temp);
        }else{
            console.log("Vector isn't of type Vec2");
        }

    };





    this.update = function (Delta) {
        let count = 0;
        velocities.forEach(entity => {

            position.addTo(entity.id, entity.vec.x, entity.vec.y);
        });

        velocities = [];
    }
}

/**
 *
 * @param {Death_Comp} Death_Comp
 * @param {Health_Comp} Health_Comp
 * @constructor
 */
export function Death_Sys(Death_Comp, Health_Comp) {
    let death = Death_Comp;
    let hp = Health_Comp;

    this.update = function (Delta) {
        let health = hp.get();

        health.forEach((value, key) => {
            if(value.currentHp === 0){
                death.getIndividual(key)(key);
            }


        });

    }
}



/**
 *
 * @param CharacterData
 * @param Components
 * @param SpriteSheets
 * @param Delta
 * @param ctx
 */
export let render_Sys = function(CharacterData, Components, SpriteSheets, Delta, ctx) {


    //rotation
    //xnew = Xold * Math.cos(angle) - Yold * Math.sin(angle)
    //ynew = Xold * Math.sin(angle) + Yold * Math.cos(angle);

    //vars
    let frame = null;

    //TODO: need to check if on screen
    Components.Animation.forEach((animationObj, ID) => {

        let transform = Components.Transform.get(ID);

        if(transform){
            //get current frame

            frame = CharacterData[animationObj.animationData].animation[animationObj.currentFrame];

            //position is the center of the image
            ctx.drawImage(
                SpriteSheets.get(frame.spriteSheet),
                frame.position.x,
                frame.position.y,
                frame.size.x,
                frame.size.y,
                transform.position.x - ((frame.size.x * transform.scale.x) / 2),
                transform.position.y - ((frame.size.y * transform.scale.y) / 2),
                frame.size.x * transform.scale.x,
                frame.size.y * transform.scale.y
            );

            if(animationObj.repeat){
                animationObj.currentFrame++;
                if(animationObj.currentFrame >= CharacterData[animationObj.animationData].animation.length){
                    animationObj.currentFrame = 0;
                }
            }

            if(Settings.ShowBoundingBoxes){

                let bb = Components.boundingBox.get(ID);
                if(bb){
                    ctx.beginPath();
                    ctx.lineWidth = "1";
                    ctx.strokeStyle = 'red'; //"#"+((1<<24)*Math.random()|0).toString(16);
                    ctx.rect(
                        transform.position.x - ((transform.scale.x * bb.width) / 2),
                        transform.position.y - ((transform.scale.y * bb.height) / 2),
                        bb.width * transform.scale.x,
                        bb.height * transform.scale.y
                    );
                    ctx.stroke();

                }
            }

            ctx.beginPath();
            ctx.lineWidth = "1";
            ctx.strokeStyle = 'white'; //"#"+((1<<24)*Math.random()|0).toString(16);
            ctx.rect(
                transform.position.x,
                transform.position.y,
                1,
                1
            );
            ctx.stroke();
        }

        //reset
        frame = null;
    });



};

export function TimeSys(Components, Delta) {

    let time = Components.Time.get("worldTime");

    time.delta += Delta;


    if(time.delta > time.tickTime){
        time.delta -= time.tickTime;
        console.log("Time: " + time.hour + ":" + time.min);
        time.min++;

        if(time.min === 60){
            time.min = 0;
            time.hour++;


        }

        if(time.hour === 24){
            time.hour = 0;

            //day++
            //month++
            //year++
            //etc...
        }
    }
}


export function konamiCode_Sys(KeyboardInput) {

    let code = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight" ];

    let keylist = KeyboardInput.getKeyList();

    //if(keylist.length > 2)debugger

    for (let x = 0; x < code.length; x++) {

        if(code[x] !== keylist[x]){
            return
        }
    }
    console.log("konami code!!");
    KeyboardInput.clearKeys();
}


/**
 *
 * @param KeyboardInput
 * @param Components
 */
export function input_Sys(KeyboardInput, Components) {

    //reset all key presses
    Components.Keys.clear();

    Settings.keys.forEach((Action, Key) => {
        if(KeyboardInput.isKeyDown(Key)){
            Components.Keys.set(Action, true);

        }
    });

}



export function playerControlled_Sys(Components) {

    Components.PlayerControlled.forEach(ID => {

        let movement = Components.Movement.get(ID);
        let transform = Components.Transform.get(ID);


        if(transform && movement){
            if(Components.Keys.has(jump)){

                if(!Components.Jump.has(ID)){
                    Components.Jump.set(ID, new JumpComObj());
                }


            }

            if(Components.Keys.has(left)){
                transform.position.x += movement.left;

            }

            if(Components.Keys.has(right)){
                transform.position.x += movement.right;
            }
        }


    })
}






export function entityInput(Components) {




}

export function jump_Sys(Components) {

    Components.Jump.forEach((jump, ID)=>{
        let transform = Components.Transform.get(ID);

        if(transform){
            transform.position.y -= Settings.JumpForce;

            jump.currentJumpHeight += Settings.JumpForce;

            if(jump.currentJumpHeight > jump.maxJumpHeight){
                Components.Jump.delete(ID);
            }
        }else{
            //no transform why do you have a jump component
            //Components.Jump.delete(ID);
        }
    });
}

export function variableJump_Sys(Components) {


}

export function levelCollisionDetection(Components, Level) {

    Components.boundingBox.forEach((box, ID) => {

        let transform = Components.Transform.get(ID);

        if(transform){
            //start with the upper left corner

            //transform.scale.x * bb.width
            let topLeft = new Vec2(
                Math.floor(transform.position.x / 50),
                Math.floor(transform.position.y / 50)
            );

            let topRight = new Vec2(
                Math.floor((transform.position.x + (box.width * transform.scale.x)) / 50),
                Math.floor(transform.position.y / 50)
            );

            let bottomLeft = new Vec2(
                Math.floor(transform.position.x / 50),
                Math.floor((transform.position.y + (box.height * transform.scale.y)/2) /50)
            );

            if(Level.collision.get('x' + bottomLeft.x + "y" + bottomLeft.y)){

                transform.position.y = bottomLeft.y * 50 - ((box.height * transform.scale.y) / 2);
            }


        }

    });
}

export function gravity_Sys(Components, Delta){

    Components.Gravity.forEach((gravity, ID) => {
        let transform = Components.Transform.get(ID);

        if(transform){
            transform.position.x += (gravity.x);// * Delta);
            transform.position.y += (gravity.y);// * Delta);
        }
    });
}

export function GoombaSystem(Components) {

}





