export function NoiseGenerator() {




    this.get2 = function(x, y, initial ) {
        const xs = x / Settings.scale;
        const ys = y / Settings.scale;

        const G = 2.0 ** (-Settings.persistence);

        let frequency = Settings.frequency;
        let amplitude = Settings.amplitude;

        let normalization = 0;
        let total = initial || 0;

        for (let o = 0; o < Settings.octaves; o++) {
            const noiseValue = noise.simplex2(xs * frequency, ys * frequency) * 0.5 + 0.5;

            total += noiseValue * Settings.amplitude;

            normalization += Settings.amplitude;
            amplitude *= G;
            frequency *= Settings.lacunarity;
        }
        total /= normalization;

        //return total * height;

        return Math.pow(total, Settings.exponentiation)// * height;

        //return total;
    };

    this.get = function (X, Y, Scale) {

        let scale = Scale || 17160;
        let nx = X / scale;
        let ny = Y / scale;

        let e = 0;
        let normalization = 0;

        for (let i = 0; i < 8; i++) {
            e  += noise.perlin2(i*nx, i*ny);
            normalization++
        }
        e = e / normalization



        return e ** 1;
    }
}