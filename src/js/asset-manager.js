export class AssetManager {
    constructor() {
        this.images = {};
        this.sounds = {};
    }

    setSound(key, src) {
        var newSound = new Audio();
        newSound.src = src;
        this.sounds[key] = newSound;
    }

    getSound(key) {
        // return audio object if exists
        return key in this.sounds ? this.sounds[key] : null;
    }

    playSound(key) {
        if (key in this.sounds) {
            this.sounds[key].currentTime = 0;
            this.sounds[key].play();
        }
    }

    setImage(key, src, width, height) {
        var image = {};
        image.canvas = document.createElement('canvas');
        image.ctx = image.canvas.getContext('2d');
        image.width = width;
        image.height = height;

        var i = new Image();
        i.onload = function() {
            i.width = width;
            i.height = height;
            image.canvas.width = 2*i.width;
            image.canvas.height = 2*i.height;
            image.ctx.drawImage(i, 0, 0, image.canvas.width, image.canvas.height);
        };
        i.src = src;

        this.images[key] = image;
    }

    getImage(key) {
        return key in this.images ? this.images[key] : null;
    }

    rescaleImages(scale) {

    }
}
