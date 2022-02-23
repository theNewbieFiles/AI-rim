export function loadImage(url) {
    return new Promise((resolve, reject) => {
        const image = new Image();

        image.addEventListener('load', ()=> {
            resolve(image);
        });


        image.onerror = error => {
            reject(new Error("can't load " + url));
        };

        image.src = url;
    })
}