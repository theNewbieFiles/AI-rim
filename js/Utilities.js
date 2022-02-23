export function Vec2(x, y) {
    this.x = x || 0;
    this.y = y || 0;
}

/**
 *
 * @param {Vec2} Vec
 */
Vec2.prototype.add = function (Vec) {
    this.x += Vec.x;
    this.y += Vec.y;
};

Vec2.prototype.mag = function () {
    return Math.sqrt((this.x * this.x) + (this.y * this.y));

};

Vec2.prototype.normalize = function () {
    let n = this.mag();

    if(n > 0){
        this.x = this.x / n;
        this.y = this.y / n;
    }
};

export function Vec4(x, y, w, h) {
    this.x = x || 0;
    this.y = y || 0;
    this.w = w || 0;
    this.h = h || 0;
}


/**
 * this is for generating uuid's that are version 4
 * @returns {string}
 */
export function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}


/**
 * this gets a random number between the min and the max
 * @param min
 * @param max
 * @returns {*}
 */
export function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

export const TerrainUtils = (function() {
    return {
        DictIntersection: function(dictA, dictB) {
            //let count = 0;
            const intersection = {};
            for (let k in dictB) {
                if (k in dictA) {
                    intersection[k] = dictA[k];
                    //count++;
                }
            }
            //console.log("inter: ", count);
            return intersection
        },

        DictDifference: function(dictA, dictB) {
            //let count = 0;
            const diff = {...dictA};
            for (let k in dictB) {
                delete diff[k];
                //count++;
            }
            //console.log("diff: ", count, diff);
            return diff;
        },

        DictDiffIntersection: function(dictA, dictB) {
            //let count = 0;
            const intersection = {};
            for (let k in dictB) {
                if(!(k in dictA)) {
                    intersection[k] = dictB[k];
                    //count++;
                }
            }
            //console.log("inter: ", count);
            return intersection
        }
    };
})();

export function lerp(P1, P2, T) {
    return (1-T) * P1 + P2 * T;
}