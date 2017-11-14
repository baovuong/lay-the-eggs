var misc = require('./misc.js');

import Box2D from 'box2d-es6';

export var b2Vec2 = Box2D.Common.Math.b2Vec2,
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



export function ImageBall(world, src, width, height, x, y) {
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
    ctx.translate(misc.round(pos.x*scale), misc.round(pos.y*scale));
  
  
    ctx.rotate(this.body.GetAngle());
    ctx.drawImage(this.image, -1*this.image.width, -1*this.image.height, this.image.width*2, this.image.height*2);
    ctx.restore();
  };
  
  export function CachedImageBall(world, cachedImage, x, y, scale) {
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
    ctx.translate(misc.round(pos.x*scale), misc.round(pos.y*scale));
  
  
    ctx.rotate(this.body.GetAngle());
    //ctx.drawImage(this.image.canvas,0, 0);
    //ctx.fillRect(0, 0, this.image.canvas.width, this.image.canvas.height);
  
    ctx.drawImage(this.image.canvas, -1*misc.round(this.image.canvas.width/2), -1*misc.round(this.image.canvas.height/2));
    //var image = this.image.ctx.getImageData(0, 0, this.image.canvas.width, this.image.canvas.height);
    //ctx.putImageData(image, 0, 0);
    ctx.restore();
  };
  
  export function TestBox(world, width, height, x, y) {
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
  
  
  export function Platform(world, width, height, x, y) {
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
  
  
  export function Nest(world, width, height, x, y) {
  
  }
  Nest.prototype = Object.create(Platform.prototype);
  Nest.prototype.constructor = Platform;
  
  Nest.prototype.render=function(ctx, scale) {
  
  };
  
