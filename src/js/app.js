/* import styles */
import Box2D from 'box2d-es6';
require('../css/app.css');

var b2Vec2 = Box2D.Common.Math.b2Vec2,
  b2BodyDef = Box2D.Dynamics.b2BodyDef,
  b2Body = Box2D.Dynamics.b2Body,
  b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
  b2Fixture = Box2D.Dynamics.b2Fixture,
  b2World = Box2D.Dynamics.b2World,
  b2MassData = Box2D.Collision.Shapes.b2MassData,
  b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
  b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
  b2DebugDraw = Box2D.Dynamics.b2DebugDraw,
  b2Transform = Box2D.Common.Math.b2Transform,
  b2Mat22 = Box2D.Common.Math.b2Mat22;

function round(num) {
  return (0.5 + num) | 0;
}

function ImageBall(world, src, width, height, x, y) {
  var body = null;
  this.width = width;
  this.height = height;
  this.image = new Image();
  this.image.src = src;

  // body
  var bodyDef = new b2BodyDef();
  bodyDef.type = b2Body.b2_dynamicBody;
  bodyDef.position.x = x;
  bodyDef.position.y = y;
  this.body = world.CreateBody(bodyDef);

  // fixtures
  var fixDef = new b2FixtureDef();
  fixDef.shape = new b2PolygonShape();
  var vectors = new Array();
  var angle = Math.PI/3;
  var mh = this.height*Math.sin(angle);
  var mw = this.width*Math.cos(angle);

  vectors.push(new b2Vec2(-1 * width, 0));
  vectors.push(new b2Vec2(-1*mw, -1*mh));

  vectors.push(new b2Vec2(0, -1 * height));
  vectors.push(new b2Vec2(mw, -1*mh));

  vectors.push(new b2Vec2(width, 0));
  vectors.push(new b2Vec2(mw, mh));

  vectors.push(new b2Vec2(0, height));
  vectors.push(new b2Vec2(-1*mw, mh));

  fixDef.shape.SetAsArray(vectors);
  fixDef.density = 1;
  this.body.CreateFixture(fixDef);        
}
ImageBall.prototype.render=function(ctx, scale) {
  var pos = this.body.GetPosition();
  this.image.height = this.height*scale;
  this.image.width = this.width*scale;
  ctx.save();
  //ctx.translate(pos.x*scale, pos.y*scale);
  // optimized
  ctx.translate(round(pos.x*scale), round(pos.y*scale));


  ctx.rotate(this.body.GetAngle());
  ctx.drawImage(this.image, -1*this.image.width, -1*this.image.height, this.image.width*2, this.image.height*2);
  ctx.restore();
};

function CachedImageBall(world, cachedImage, x, y, scale) {
  var body = null;
  this.image = cachedImage;

  // body
  var bodyDef = new b2BodyDef();
  bodyDef.type = b2Body.b2_dynamicBody;
  bodyDef.position.x = x;
  bodyDef.position.y = y;
  this.body = world.CreateBody(bodyDef);

  // fixtures
  var fixDef = new b2FixtureDef();
  fixDef.shape = new b2PolygonShape();
  var vectors = new Array();
  var angle = Math.PI/3;

  var width = this.image.canvas.width/(scale*2);
  var height = this.image.canvas.height/(scale*2);

  var mh = height*Math.sin(angle);
  var mw = width*Math.cos(angle);

  vectors.push(new b2Vec2(-1 * width, 0));
  vectors.push(new b2Vec2(-1*mw, -1*mh));

  vectors.push(new b2Vec2(0, -1 * height));
  vectors.push(new b2Vec2(mw, -1*mh));

  vectors.push(new b2Vec2(width, 0));
  vectors.push(new b2Vec2(mw, mh));

  vectors.push(new b2Vec2(0, height));
  vectors.push(new b2Vec2(-1*mw, mh));

  fixDef.shape.SetAsArray(vectors);
  fixDef.density = 1;
  this.body.CreateFixture(fixDef);            
}
CachedImageBall.prototype.render=function(ctx, scale) {
  var pos = this.body.GetPosition();
  //this.image.height = this.height*scale;
  //this.image.width = this.width*scale;
  ctx.save();
  //ctx.translate(pos.x*scale, pos.y*scale);
  // optimized
  ctx.translate(round(pos.x*scale), round(pos.y*scale));


  ctx.rotate(this.body.GetAngle());
  //ctx.drawImage(this.image.canvas,0, 0);
  //ctx.fillRect(0, 0, this.image.canvas.width, this.image.canvas.height);

  ctx.drawImage(this.image.canvas, -1*round(this.image.canvas.width/2), -1*round(this.image.canvas.height/2));
  //var image = this.image.ctx.getImageData(0, 0, this.image.canvas.width, this.image.canvas.height);
  //ctx.putImageData(image, 0, 0);
  ctx.restore();
};

function TestBox(world, width, height, x, y) {
  this.width=width;
  this.height=height;
  // body
  var bodyDef = new b2BodyDef();
  bodyDef.type = b2Body.b2_dynamicBody;
  bodyDef.position.x = x;
  bodyDef.position.y = y;
  this.body = world.CreateBody(bodyDef);

  // fixture
  var shape = new b2PolygonShape();
  shape.SetAsBox(width, height, 0.5);
  var fixDef = new b2FixtureDef();
  fixDef.shape = shape;
  fixDef.density = 1;
  this.body.CreateFixture(fixDef);
}
TestBox.prototype.render=function(ctx, scale) {
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
};


function Platform(world, width, height, x, y) {
  this.body = null;
  this.width = width;
  this.height = height;

  // body
  var bodyDef = new b2BodyDef();
  bodyDef.type = b2Body.b2_staticBody;
  bodyDef.position.x = x;
  bodyDef.position.y = y;
  this.body = world.CreateBody(bodyDef);

  // fixture
  var shape = new b2PolygonShape();
  shape.SetAsBox(width, height, 0.5);
  var fixDef = new b2FixtureDef();
  fixDef.shape = shape;
  fixDef.density = 1;
  this.body.CreateFixture(fixDef);
}
Platform.prototype.render=function(ctx, scale) {
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
};


function Nest(world, width, height, x, y) {

}
Nest.prototype = Object.create(Platform.prototype);
Nest.prototype.constructor = Platform;

Nest.prototype.render=function(ctx, scale) {

};

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function loadImage(src, width, height) {

  var image = {};
  image.canvas = document.createElement('canvas');
  image.ctx = image.canvas.getContext('2d');

  var i = new Image();
  i.onload = function() {
    i.width = width;
    i.height = height;           
    image.canvas.width = 2*i.width;
    image.canvas.height = 2*i.height;
    image.ctx.drawImage(i, 0, 0, image.canvas.width, image.canvas.height);
  };
  i.src = src;       

  return image;
}

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

var brownEggImage = loadImage('img/brown-egg.png', eggWidth, eggHeight);
var whiteEggImage = loadImage('img/white-egg.png', eggWidth, eggHeight);
var rainbowEggImage = loadImage('img/rainbow-egg.png', eggWidth, eggHeight);
var goldenEggImage = loadImage('img/golden-egg.png', eggWidth, eggHeight);
var diamondEggImage = loadImage('img/diamond-egg.png', eggWidth, eggHeight);

var henX = 0;
var henY = 0;
var henWidth = 48;
var henHeight = 48;
var henImage = loadImage('img/hen.png', henWidth, henHeight);


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
  world = new b2World(new b2Vec2(0, 50),true);

  window.onresize=function() {
    bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
    scale = Math.max(1, Math.max(bgCanvas.width, bgCanvas.height)/100);
    bgCanvas.width = round(window.innerWidth * 0.85); 
    bgCanvas.height = round(window.innerHeight * 0.85); 
    fgCanvas.width = bgCanvas.width; 
    fgCanvas.height = bgCanvas.height; 
    maxVelocity = new b2Vec2(0.2*fgCanvas.width*2, 0.2*fgCanvas.height*0.1).Length();
    for (var i=0; i<bgObjects.length; i++) {
      bgObjects[i].body.GetWorld().DestroyBody(bgObjects[i].body);
    }
    bgObjects = new Array();

    bgObjects.push(new Platform(world, bgCanvas.width, 0.1, 0, (bgCanvas.height-2)/scale));
    bgObjects.push(new Platform(world, bgCanvas.width, 0.1, 0, 0));
    bgObjects.push(new Platform(world, 0.1, bgCanvas.height, 0, 0));
    bgObjects.push(new Platform(world, 0.1, bgCanvas.height, (bgCanvas.width-2)/scale, 0));
    //for (var i=0; i<bgObjects.length; i++) {
    //    bgObjects[i].render(bgCtx, scale);
    //}

    // rendering background
    bgCtx.drawImage(backgroundImage, 0, 0, bgCanvas.width, bgCanvas.height);


    brownEggImage = loadImage('img/brown-egg.png', eggWidth*scale, eggHeight*scale);
    whiteEggImage = loadImage('img/white-egg.png', eggWidth*scale, eggHeight*scale);
    rainbowEggImage = loadImage('img/rainbow-egg.png', eggWidth*scale, eggHeight*scale);
    goldenEggImage = loadImage('img/golden-egg.png', eggWidth*scale, eggHeight*scale);
    diamondEggImage = loadImage('img/diamond-egg.png', eggWidth*scale, eggHeight*scale);
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

    var choice = Math.floor(Math.random()*100)+1;
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
    newEgg = new CachedImageBall(world, newEggImage, henX/scale, henY/scale, scale);
    fgObjects.push(newEgg);

    var force = new b2Vec2(randInt(10,0.2*fgCanvas.width*2)*scale , randInt(5, 0.2*fgCanvas.height*0.1));

    newEgg.body.ApplyImpulse(force, newEgg.body.GetWorldCenter());
    newEgg.body.ApplyTorque(randInt(500, 5000)*scale);

    if (force.Length() >= maxVelocity*0.45) {
      cannonSound.currentTime = 0;
      cannonSound.play();
    } else {
      blopSound.currentTime = 0;
      blopSound.play();
    }
  });
  //setup debug draw
  var debugDraw = new b2DebugDraw();
  debugDraw.SetSprite(fgCtx);
  debugDraw.SetDrawScale(30.0);
  debugDraw.SetFillAlpha(0.5);
  debugDraw.SetAlpha(0.5);
  debugDraw.SetLineThickness(3.0);
  debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
  world.SetDebugDraw(debugDraw);

  window.setInterval(update, 1000 / 60);
}

function update() {
  fgCtx.clearRect(0, 0, fgCanvas.width, fgCanvas.height);



  world.Step(1/60, 10, 10);
  //world.DrawDebugData();
  for (var i=0; i<fgObjects.length; i++) {
    fgObjects[i].render(fgCtx, scale);
  }
  world.ClearForces();

  // drawing the chicken
  fgCtx.save();
  //fgCtx.translate(henX, henY);

  // optimized
  fgCtx.translate(round(henX), round(henY));
  fgCtx.drawImage(henImage.canvas, -1*henWidth, -1*henHeight);
  fgCtx.restore();
}

window.onload = init();
