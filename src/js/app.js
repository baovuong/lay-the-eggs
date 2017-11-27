/* import styles */
require('../css/app.css');
var misc = require('./misc.js');
var physics = require('./physics.js');
var assetManager = require('./asset-manager.js');

var world;
var assets = new assetManager.AssetManager();
var bgCanvas = document.getElementById('bg');
var bgCtx = bgCanvas.getContext('2d');
var fgCanvas = document.getElementById('fg');
var fgCtx = fgCanvas.getContext('2d');
var scale = 30;

// images
var eggWidth = 3; //24;
var eggHeight = 4; //32;


assets.setImage('brownEgg', 'img/brown-egg.png', eggWidth, eggHeight);
assets.setImage('whiteEgg', 'img/white-egg.png', eggWidth, eggHeight);
assets.setImage('rainbowEgg', 'img/rainbow-egg.png', eggWidth, eggHeight);
assets.setImage('goldenEgg', 'img/golden-egg.png', eggWidth, eggHeight);
assets.setImage('diamondEgg', 'img/diamond-egg.png', eggWidth, eggHeight);


var henX = 0;
var henY = 0;
var henWidth = 48;
var henHeight = 48;

assets.setImage('hen', 'img/hen.png', henWidth, henHeight);


var backgroundImage = new Image();

// cool art bro: http://austriaangloalliance.deviantart.com/art/Barn-Inside-With-Hay-357489378
backgroundImage.src = 'img/barn_inside.jpg';


// sounds
assets.setSound('cannon', 'aud/cannon.mp3');
assets.setSound('blop', 'aud/blop.mp3');


var maxVelocity = 0;

var numDiamond = 0;
var numGolden = 0;
var numRainbow = 0;
var numRegular = 0;

function randomEgg() {
    var eggImage;

    var choice = Math.floor(Math.random() * 100) + 1;
    if (choice >= 1 && choice <= 5) {
        eggImage = 'diamondEgg';
        numDiamond++;
    } else if (choice >= 6 && choice <= 15) {
        eggImage = 'goldenEgg';
        numGolden++;
    } else if (choice >= 16 && choice <= 35) {
        eggImage = 'rainbowEgg';
        numRainbow++;
    } else {
        eggImage = Math.random() > 0.5 ? 'whiteEgg' : 'brownEgg';
        numRegular++;
    }

    return assets.getImage(eggImage);
}

function init() {
    world = new physics.World(0, 50);

    window.onresize = function() {
        bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
        scale = Math.max(1, Math.max(bgCanvas.width, bgCanvas.height) / 100);
        bgCanvas.width = misc.round(window.innerWidth * 0.85);
        bgCanvas.height = misc.round(window.innerHeight * 0.85);
        fgCanvas.width = bgCanvas.width;
        fgCanvas.height = bgCanvas.height;
        maxVelocity = new physics.b2Vec2(0.2 * fgCanvas.width * 2, 0.2 * fgCanvas.height * 0.1).Length();

        world.refresh(scale, bgCanvas.width, bgCanvas.height);

        bgCtx.drawImage(backgroundImage, 0, 0, bgCanvas.width, bgCanvas.height);

        var newEggWidth = eggWidth * scale;
        var newEggHeight = eggHeight * scale;
        assets.resizeImage('brownEgg', newEggWidth, newEggHeight);
        assets.resizeImage('whiteEgg', newEggWidth, newEggHeight);
        assets.resizeImage('rainbowEgg', newEggWidth, newEggHeight);
        assets.resizeImage('goldenEgg', newEggWidth, newEggHeight);
        assets.resizeImage('diamondEgg', newEggWidth, newEggHeight);
    };

    window.onresize();

    fgCanvas.addEventListener('mousemove', function(evt) {
        //fgCtx.clearRect(henX - hen.width, henY - hen.height, hen.width*2, hen.height*2);
        var rect = fgCanvas.getBoundingClientRect();
        henX = evt.pageX - rect.left;
        henY = evt.pageY - rect.top;

    });


    fgCanvas.addEventListener('click', function(evt) {
        // lay the egg

        var newEgg;
        //newEgg = new ImageBall(world, newEggImage, 24/scale, 32/scale, henX/scale, henY/scale);
        newEgg = new physics.CachedImageBall(randomEgg(), scale);
        var force = world.addObject(newEgg,
            henX/scale,
            henY/scale,
            misc.randInt(10, 0.5 * fgCanvas.width * 2),
            misc.randInt(5, 0.5 * fgCanvas.height * 0.1),
            misc.randInt(500, 5000) * scale);

        if (force.Length() >= maxVelocity * 0.45) {
            assets.playSound('cannon');
        } else {
            assets.playSound('blop');
        }
    });
    //setup debug draw
    // var debugDraw = new physics.b2DebugDraw();
    // debugDraw.SetSprite(fgCtx);
    // debugDraw.SetDrawScale(30.0);
    // debugDraw.SetFillAlpha(0.5);
    // debugDraw.SetAlpha(0.5);
    // debugDraw.SetLineThickness(3.0);
    // debugDraw.SetFlags(physics.b2DebugDraw.e_shapeBit | physics.b2DebugDraw.e_jointBit);
    // world.SetDebugDraw(debugDraw);

    window.setInterval(update, 1000 / 60);
}

function update() {
    world.update(fgCtx, fgCanvas.width, fgCanvas.height, scale);
    // optimized
    fgCtx.translate(misc.round(henX), misc.round(henY));
    fgCtx.drawImage(assets.getImage('hen').canvas, -1 * henWidth, -1 * henHeight);
    fgCtx.restore();
}

window.onload = init();
