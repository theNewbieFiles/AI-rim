export function noise2(X, Y, Width, Height) {
   let nx = X/Width - 0.5, ny = Y/Height - 0.5;
    let total = 0;
    let frequency = Settings.frequency;

    for (let o = 0; o < Settings.octaves; o++) {
        total += noise.simplex2(frequency * nx, frequency*ny)/frequency

        frequency *= 2;
    }

    let x = Width/2;
    let y = Height/2;




    return (total*total);

}


//noise.simplex2(nx, ny)