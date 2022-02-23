import {lerp} from "../Utilities.js";
import {NoiseGenerator} from "./Noise.js";


export function CreateMap(MapData) {

    let noiseGen = new NoiseGenerator();

    let ctx = MapData.getContext('2d');
    let total = 4096;



    
    let data = [];

    for (let i = 0; i < total; i++) {
        data[i] = [];
    }


    //was 1024
    for (let y = 0; y < total/4; y++) {
        for (let x = 0; x < total/4; x++) {
            //let position = x + (y * 1024)

            let h = ctx.getImageData(x, y, 1, 1);

            data[x*4][y*4] = h.data[0] * 10;


        }
    }

    let x1, x2;
    for (let y = 0; y < total-8; y += 1) {
        for (let x = 0; x < total-8; x+=8) {
            //let position = x + (y * 1024)


            x1 = data[x][y];
            x2 = data[x+8][y];

            if(x1 === x2){

                data[x+8][y] *= noise.perlin2(x/4096, y/4096);
                x2 = data[x+8][y];
            }

            data[x+1][y] = lerp(x1, x2, .1428);
            data[x+2][y] = lerp(x1, x2, .1428*2);
            data[x+3][y] = lerp(x1, x2, .1428*3);
            data[x+4][y] = lerp(x1, x2, .1428*4);
            data[x+5][y] = lerp(x1, x2, .1428*5);
            data[x+6][y] = lerp(x1, x2, .1428*6);
            data[x+7][y] = lerp(x1, x2, .1428*7);



        }

    }

    for (let y = 0; y < total-8; y += 8) {
        for (let x = 0; x < total-8; x+=1) {
            //let position = x + (y * 1024)

//debugger
            x1 = data[x][y];
            x2 = data[x][y+8];

            if(x1 === x2){
                data[x][y+8] *=  noise.perlin2(x/4096, y/4096);
                x2 = data[x][y+8];
            }

            data[x][y+1] = lerp(x1, x2, .1428);
            data[x][y+2] = lerp(x1, x2, .1428*2);
            data[x][y+3] = lerp(x1, x2, .1428*3);
            data[x][y+4] = lerp(x1, x2, .1428*4);
            data[x][y+5] = lerp(x1, x2, .1428*5);
            data[x][y+6] = lerp(x1, x2, .1428*6);
            data[x][y+7] = lerp(x1, x2, .1428*7);



        }

    }



    this.get = function (X, Y) {
        return data[X][Y];
    }





}