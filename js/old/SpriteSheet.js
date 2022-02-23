// JavaScript source code
export default function SpriteSheet(Img) {
    let img = Img;

    let tiles = new Map(); 


    this.define = function (name, x, y, width, height) {
        const buffer = document.createElement('canvas');
        buffer.width = width;
        buffer.height = height;
        buffer.getContext('2d').drawImage(
            img,
            x,
            y,
            width, 
            height, 
            0, 
            0, 
            width,
            height
        );
        tiles.set(name, buffer); 
    };

    this.draw = function(name, ctx, x, y, scale){
        const img = tiles.get(name);
        if(img){
            ctx.drawImage(
                img,
                0,
                0,
                img.width,
                img.height,
                x,
                y,
                img.width * scale,
                img.height * scale
            )
        }else{
            //error!?!
        }

    };


}