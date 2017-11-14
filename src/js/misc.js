export function round(num) {
    return (0.5 + num) | 0;
}

export function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
  
export function loadImage(src, width, height) {
  
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