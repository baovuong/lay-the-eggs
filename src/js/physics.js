var misc = require('./misc.js');

import planck from 'planck-js';

export class ImageBall {
    constructor(src, width, height) {
        this.body = null;
        this.width = width;
        this.height = height;
        this.image = new Image();
        this.image.src = src;
    }

    attachToWorld(world, x, y) {
        var bodyDef = new planck.Body();
        bodyDef.type = planck.Body.DYNAMIC;
        bodyDef.position.x = x;
        bodyDef.position.y = y;
        this.body = world.CreateBody(bodyDef);

        // fixtures
        var fixDef = new planck.Fixture();
        fixDef.shape = new planck.Polygon();
        var vectors = new Array();
        var angle = Math.PI / 3;
        var mh = this.height * Math.sin(angle);
        var mw = this.width * Math.cos(angle);

        vectors.push(new planck.Vec2(-1 * width, 0));
        vectors.push(new planck.Vec2(-1 * mw, -1 * mh));

        vectors.push(new planck.Vec2(0, -1 * height));
        vectors.push(new planck.Vec2(mw, -1 * mh));

        vectors.push(new planck.Vec2(width, 0));
        vectors.push(new planck.Vec2(mw, mh));

        vectors.push(new planck.Vec2(0, height));
        vectors.push(new planck.Vec2(-1 * mw, mh));

        fixDef.shape.SetAsArray(vectors);
        fixDef.density = 1;
        this.body.CreateFixture(fixDef);
    }

    render(ctx, scale) {
        if (this.body != null) {
            var pos = this.body.GetPosition();
            this.image.height = this.height * scale;
            this.image.width = this.width * scale;
            ctx.save();
            //ctx.translate(pos.x*scale, pos.y*scale);
            // optimized
            ctx.translate(misc.round(pos.x * scale), misc.round(pos.y * scale));


            ctx.rotate(this.body.GetAngle());
            ctx.drawImage(this.image, -1 * this.image.width, -1 * this.image.height, this.image.width * 2, this.image.height * 2);
            ctx.restore();
        }
    }
}

export class CachedImageBall {

    constructor(cachedImage, scale) {
        this.body = null;
        this.image = cachedImage;
        this.scale = scale;
    }

    attachToWorld(world, x, y) {
        // body
        var bodyDef = new planck.Body();
        bodyDef.type = planck.Body.DYNAMIC;
        bodyDef.position.x = x;
        bodyDef.position.y = y;
        this.body = world.CreateBody(bodyDef);

        // fixtures
        var fixDef = new planck.Fixture();
        fixDef.shape = new planck.Polygon();
        var vectors = new Array();
        var angle = Math.PI / 3;

        var width = this.image.canvas.width / (this.scale * 2);
        var height = this.image.canvas.height / (this.scale * 2);

        var mh = height * Math.sin(angle);
        var mw = width * Math.cos(angle);

        vectors.push(new planck.Vec2(-1 * width, 0));
        vectors.push(new planck.Vec2(-1 * mw, -1 * mh));

        vectors.push(new planck.Vec2(0, -1 * height));
        vectors.push(new planck.Vec2(mw, -1 * mh));

        vectors.push(new planck.Vec2(width, 0));
        vectors.push(new planck.Vec2(mw, mh));

        vectors.push(new planck.Vec2(0, height));
        vectors.push(new planck.Vec2(-1 * mw, mh));

        fixDef.shape.SetAsArray(vectors);
        fixDef.density = 1;
        this.body.CreateFixture(fixDef);
    }

    render(ctx, scale) {
        if (this.body != null) {
            var pos = this.body.GetPosition();
            //this.image.height = this.height*scale;
            //this.image.width = this.width*scale;
            ctx.save();
            //ctx.translate(pos.x*scale, pos.y*scale);
            // optimized
            ctx.translate(misc.round(pos.x * scale), misc.round(pos.y * scale));


            ctx.rotate(this.body.GetAngle());
            //ctx.drawImage(this.image.canvas,0, 0);
            //ctx.fillRect(0, 0, this.image.canvas.width, this.image.canvas.height);

            ctx.drawImage(this.image.canvas, -1 * misc.round(this.image.canvas.width / 2), -1 * misc.round(this.image.canvas.height / 2));
            //var image = this.image.ctx.getImageData(0, 0, this.image.canvas.width, this.image.canvas.height);
            //ctx.putImageData(image, 0, 0);
            ctx.restore();
        }
    }
}

export class TestBox {
    constructor(world, width, height, x, y) {
        this.width = width;
        this.height = height;
        // body
        var bodyDef = new planck.Body();
        bodyDef.type = planck.Body.DYNAMIC;
        bodyDef.position.x = x;
        bodyDef.position.y = y;
        this.body = world.CreateBody(bodyDef);

        // fixture
        var shape = new planck.Polygon();
        shape.SetAsBox(width, height, 0.5);
        var fixDef = new planck.Fixture();
        fixDef.shape = shape;
        fixDef.density = 1;
        this.body.CreateFixture(fixDef);
    }

    render(ctx, scale) {
        var pos = this.body.GetPosition();
        var angle = this.body.GetAngle();
        ctx.save();

        ctx.translate(pos.x * scale, pos.y * scale);
        ctx.rotate(angle);

        ctx.beginPath();
        ctx.moveTo(-1 * this.width * scale, -1 * this.height * scale);
        ctx.lineTo(this.width * scale, -1 * this.height * scale);
        ctx.lineTo(this.width * scale, this.height * scale);
        ctx.lineTo(-1 * this.width * scale, this.height * scale);
        ctx.lineTo(-1 * this.width * scale, -1 * this.height * scale);
        ctx.closePath();
        ctx.strokeStyle = '#000000';
        ctx.stroke();

        ctx.restore();
    }
}

export class Platform {
    constructor(world, width, height, x, y) {
        this.body = null;
        this.width = width;
        this.height = height;

        // body
        var bodyDef = new planck.Body();
        bodyDef.type = planck.Body.STATIC;
        bodyDef.setPosition(new planck.Vec2(x, y));
        this.body = world.CreateBody(bodyDef);

        // fixture
        var shape = new planck.Polygon();
        shape.SetAsBox(width, height, 0.5);
        var fixDef = new planck.Fixture();
        fixDef.shape = shape;
        fixDef.density = 1;
        this.body.CreateFixture(fixDef);
    }

    render(ctx, scale) {
        var pos = this.body.GetPosition();
        ctx.save();
        ctx.fillStyle = '#555555';
        ctx.translate(pos.x * scale, pos.y * scale);
        ctx.rotate(this.body.GetAngle());
        ctx.beginPath();
        ctx.moveTo(-1 * this.width * scale, -1 * this.height * scale);
        ctx.lineTo(this.width * scale, -1 * this.height * scale);
        ctx.lineTo(this.width * scale, this.height * scale);
        ctx.lineTo(-1 * this.width * scale, this.height * scale);
        ctx.lineTo(-1 * this.width * scale, -1 * this.height * scale);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }
}

export class Nest extends Platform {
    render(ctx, scale) {}
}

export class World {
    constructor(gX, gY) {
        this.body = new planck.World(new planck.Vec2(gX, gY), true);
        this.bgObjects = new Array();
        this.fgObjects = new Array();
    }

    addObject(object, x, y, fx, fy, t) {
        this.fgObjects.push(object);
        object.attachToWorld(this.body, x, y);

        var force = new planck.Vec2(fx, fy);
        object.body.ApplyImpulse(force, object.body.GetWorldCenter());
        object.body.ApplyTorque(t);

        return force;
    }

    init() {

    }

    refresh(scale, width, height) {
        for (var i = 0; i < this.bgObjects.length; i++) {
            this.bgObjects[i].body.GetWorld().DestroyBody(this.bgObjects[i].body);
        }
        this.bgObjects = new Array();

        this.bgObjects.push(new Platform(this.body, width, 0.1, 0, (height - 2) / scale));
        this.bgObjects.push(new Platform(this.body, width, 0.1, 0, 0));
        this.bgObjects.push(new Platform(this.body, 0.1, height, 0, 0));
        this.bgObjects.push(new Platform(this.body, 0.1, height, (width - 2) / scale, 0));
    }

    update(ctx, width, height, scale) {
        ctx.clearRect(0, 0, width, height);

        this.body.Step(1 / 60, 10, 10);
        //world.DrawDebugData();
        for (var i = 0; i < this.fgObjects.length; i++) {
            this.fgObjects[i].render(ctx, scale);
        }
        this.body.ClearForces();

        // drawing the chicken
        ctx.save();
    }
}
