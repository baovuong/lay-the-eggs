
let instance = null;

export class AssetManager {
    constructor() {
        if (!instance) {
            instance = this;
        }

        this.images = {};
        this.sounds = {};

        return instance;
    }

    setSound(key, src) {

    }

    getSound(key) {

    }

    setImage(key, src) {

    }

    getImage(key) {

    }
}
