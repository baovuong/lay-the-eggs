/* import styles */
require('../css/app.css');
var misc = require('./misc.js');
var physics = require('./physics.js');


var world;

var bgCanvas = document.getElementById('bg');
var bgCtx = bgCanvas.getContext('2d');
var fgCanvas = document.getElementById('fg');
var fgCtx = fgCanvas.getContext('2d');
var scale = 30;


var parts = new Array();
var bgObjects = new Array();
var fgObjects = new Array();

// images
var eggWidth = 3; //24;
var eggHeight = 4; //32;

var brownEggImage = misc.loadImage('img/brown-egg.png', eggWidth, eggHeight);
var whiteEggImage = misc.loadImage('img/white-egg.png', eggWidth, eggHeight);
var rainbowEggImage = misc.loadImage('img/rainbow-egg.png', eggWidth, eggHeight);
var goldenEggImage = misc.loadImage('img/golden-egg.png', eggWidth, eggHeight);
var diamondEggImage = misc.loadImage('img/diamond-egg.png', eggWidth, eggHeight);

var henX = 0;
var henY = 0;
var henWidth = 48;
var henHeight = 48;
var henImage = misc.loadImage('img/hen.png', henWidth, henHeight);


var backgroundImage = new Image();

// cool art bro: http://austriaangloalliance.deviantart.com/art/Barn-Inside-With-Hay-357489378
backgroundImage.src = 'img/barn_inside.jpg';


// sounds
var cannonSound = new Audio();
cannonSound.src = 'aud/cannon.mp3';

var blopSound = new Audio();
blopSound.src = 'aud/blop.mp3';

var maxVelocity = 0;

var numDiamond = 0;
var numGolden = 0;
var numRainbow = 0;
var numRegular = 0;


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
        for (var i = 0; i < bgObjects.length; i++) {
            bgObjects[i].body.GetWorld().DestroyBody(bgObjects[i].body);
        }
        bgObjects = new Array();

        bgObjects.push(new physics.Platform(world.body, bgCanvas.width, 0.1, 0, (bgCanvas.height - 2) / scale));
        bgObjects.push(new physics.Platform(world.body, bgCanvas.width, 0.1, 0, 0));
        bgObjects.push(new physics.Platform(world.body, 0.1, bgCanvas.height, 0, 0));
        bgObjects.push(new physics.Platform(world.body, 0.1, bgCanvas.height, (bgCanvas.width - 2) / scale, 0));
        //for (var i=0; i<bgObjects.length; i++) {
        //    bgObjects[i].render(bgCtx, scale);
        //}

        // rendering background
        bgCtx.drawImage(backgroundImage, 0, 0, bgCanvas.width, bgCanvas.height);


        brownEggImage = misc.loadImage('img/brown-egg.png', eggWidth * scale, eggHeight * scale);
        whiteEggImage = misc.loadImage('img/white-egg.png', eggWidth * scale, eggHeight * scale);
        rainbowEggImage = misc.loadImage('img/rainbow-egg.png', eggWidth * scale, eggHeight * scale);
        goldenEggImage = misc.loadImage('img/golden-egg.png', eggWidth * scale, eggHeight * scale);
        diamondEggImage = misc.loadImage('img/diamond-egg.png', eggWidth * scale, eggHeight * scale);
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
        var newEggImage;

        var choice = Math.floor(Math.random() * 100) + 1;
        if (choice >= 1 && choice <= 5) {
            newEggImage = diamondEggImage; //'img/diamond-egg.png';
            numDiamond++;
        } else if (choice >= 6 && choice <= 15) {
            newEggImage = goldenEggImage; //'img/golden-egg.png';
            numGolden++;
        } else if (choice >= 16 && choice <= 35) {
            newEggImage = rainbowEggImage; //'img/rainbow-egg.png';
            numRainbow++;
        } else {
            //newEggImage = Math.random() > 0.5 ? 'img/white-egg.png' : 'img/brown-egg.png';
            newEggImage = Math.random() > 0.5 ? whiteEggImage : brownEggImage;
            numRegular++;
        }
        //newEgg = new ImageBall(world, newEggImage, 24/scale, 32/scale, henX/scale, henY/scale);
        newEgg = new physics.CachedImageBall(world, newEggImage, henX / scale, henY / scale, scale);
        fgObjects.push(newEgg);

        var force = new physics.b2Vec2(misc.randInt(10, 0.2 * fgCanvas.width * 2) * scale, misc.randInt(5, 0.2 * fgCanvas.height * 0.1));

        newEgg.body.ApplyImpulse(force, newEgg.body.GetWorldCenter());
        newEgg.body.ApplyTorque(misc.randInt(500, 5000) * scale);

        if (force.Length() >= maxVelocity * 0.45) {
            cannonSound.currentTime = 0;
            cannonSound.play();
        } else {
            blopSound.currentTime = 0;
            blopSound.play();
        }
    });
    //setup debug draw
    var debugDraw = new physics.b2DebugDraw();
    debugDraw.SetSprite(fgCtx);
    debugDraw.SetDrawScale(30.0);
    debugDraw.SetFillAlpha(0.5);
    debugDraw.SetAlpha(0.5);
    debugDraw.SetLineThickness(3.0);
    debugDraw.SetFlags(physics.b2DebugDraw.e_shapeBit | physics.b2DebugDraw.e_jointBit);
    world.SetDebugDraw(debugDraw);

    window.setInterval(update, 1000 / 60);
}

function update() {
    fgCtx.clearRect(0, 0, fgCanvas.width, fgCanvas.height);



    world.Step(1 / 60, 10, 10);
    //world.DrawDebugData();
    for (var i = 0; i < fgObjects.length; i++) {
        fgObjects[i].render(fgCtx, scale);
    }
    world.ClearForces();

    // drawing the chicken
    fgCtx.save();
    //fgCtx.translate(henX, henY);

    // optimized
    fgCtx.translate(misc.round(henX), misc.round(henY));
    fgCtx.drawImage(henImage.canvas, -1 * henWidth, -1 * henHeight);
    fgCtx.restore();
}

window.onload = init();
