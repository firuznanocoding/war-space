var WIDTH = window.innerWidth,
    HEIGHT = window.innerHeight,
    MAX_PARTICLES = 200,
    DRAW_INTERVAL = 10,
    container = document.querySelector('#container'),
    canvas = document.querySelector('#canvas'),
    context = canvas.getContext('2d'),
    gradient = null,
    pixies = new Array(),
    korabl = new Image(),
    leftRight = 1,
    upDown = 1,
    h = 0,
    w = Math.floor(Math.random()*WIDTH),
    stage = 0;

    korabl.src = 'img/F5S1.png';

function setDimensions(e) {
    WIDTH = window.innerWidth;
    HEIGHT = window.innerHeight;
    container.style.width = WIDTH+'px';
    container.style.height = HEIGHT+'px';
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
}
setDimensions();
window.addEventListener('resize', setDimensions);

function Circle() {
    this.settings = {ttl:8000, xmax:5, ymax:2, rmax:10, rt:1, xdef:960, ydef:540, xdrift:4, ydrift: 4, random:true, blink:true};

    this.reset = function() {
        this.x = (this.settings.random ? WIDTH*Math.random() : this.settings.xdef);
        this.y = (this.settings.random ? HEIGHT*Math.random() : this.settings.ydef);
        this.r = ((this.settings.rmax-1)*Math.random()) + 1;
        this.dx = (Math.random()*this.settings.xmax) * (Math.random() < .5 ? -1 : 1);
        this.dy = (Math.random()*this.settings.ymax) * (Math.random() < .5 ? -1 : 1);
        this.hl = (this.settings.ttl/DRAW_INTERVAL)*(this.r/this.settings.rmax);
        this.rt = Math.random()*this.hl;
        this.settings.rt = Math.random()+1;
        this.stop = Math.random()*.2+.4;
        this.settings.xdrift *= Math.random() * (Math.random() < .5 ? -1 : 1);
        this.settings.ydrift *= Math.random() * (Math.random() < .5 ? -1 : 1);
    }

    this.fade = function() {
        this.rt += this.settings.rt;
    }

    this.draw = function() {
        if(this.settings.blink && (this.rt <= 0 || this.rt >= this.hl)) {
            this.settings.rt = this.settings.rt*-1;
        } else if(this.rt >= this.hl) {
            this.reset();
        }

        var newo = 1-(this.rt/this.hl);
        context.beginPath();
        context.arc(this.x, this.y, this.r, 0, Math.PI*2, true);
        context.closePath();

        var cr = this.r*newo;
        gradient = context.createRadialGradient(this.x, this.y, 0, this.x, this.y, (cr <= 0 ? 1 : cr));
        gradient.addColorStop(0.0, 'rgba(255,255,255,'+newo+')');
        gradient.addColorStop(this.stop, 'rgba(77,101,181,'+(newo*.6)+')');
        gradient.addColorStop(1.0, 'rgba(77,101,181,0)');
        context.fillStyle = gradient;
        context.fill();
    }

    this.move = function() {
        this.x += 0;
        this.y += 5;
        if(this.x < 0) this.x = WIDTH;
        if(this.y > HEIGHT) this.y = 0;
        //if(this.x > WIDTH || this.x < 0) this.dx *= -1;
        //if(this.y > HEIGHT || this.y < 0) this.dy *= -1;
    }

    this.getX = function() { return this.x; }
    this.getY = function() { return this.y; }
}

for (var i = 0; i < MAX_PARTICLES; i++) {
    pixies.push(new Circle());
    pixies[i].reset();
}

function draw() {
    context.clearRect(0, 0, WIDTH, HEIGHT);
    for(var i = 0; i < pixies.length; i++) {
        pixies[i].fade();
        pixies[i].move();
        pixies[i].draw();
    }
}

// fire
    parts = [],
    partCount = 200,   
    partsFull = false,    
    hueRange = 10,
    globalTick = 0,
    rand = function(min, max){
        return Math.floor( (Math.random() * (max - min + 1) ) + min);
    };

var Part = function(){
  this.reset();
};

// fire position
Part.prototype.reset = function(){
  this.startRadius = rand(1, 10);
  this.radius = this.startRadius;
  this.x = WIDTH/2-49 + (rand(0, 6) - 3) + leftRight;
  this.y = HEIGHT/2+210 + upDown;      
  this.vx = 0;
  this.vy = 10;
  this.hue = rand(globalTick - hueRange, globalTick + hueRange);
  this.saturation = rand(50, 60);
  this.lightness = rand(2, 7);
  this.startAlpha = rand(1, 10) / 100;
  this.alpha = this.startAlpha;
  this.decayRate = .1;  
  this.startLife = 5;
  this.life = this.startLife;
  this.lineWidth = rand(1, 3);
}

function drawKorabl(){
    context.beginPath();
    context.drawImage(korabl, WIDTH/2-100 + leftRight, HEIGHT/2+100 + upDown, 100,100);
    //korabl.rotate(20*Math.PI/180);
    context.closePath();
}

Part.prototype.update = function(){  
  this.vx += (rand(0, 200) - 100) / 1500;
  this.vy -= this.life/50;  
  this.x += this.vx;
  this.y += this.vy;  
  this.alpha = 5;
  this.radius = this.startRadius * (this.life / this.startLife);
  this.life -= 1;  
  if(
    this.x > WIDTH + this.radius || 
    this.x < -this.radius ||
    this.y > HEIGHT + this.radius ||
    this.y < -this.radius ||
    this.life <= this.decayRate
  ){
    this.reset();  
  }  
};
  
Part.prototype.render = function(){
  context.beginPath();
  context.arc(this.x-33, this.y-22, this.radius, 0, Math.PI * 2, false);
  context.fillStyle = context.strokeStyle = 'hsla(10,70%, 10%, 100)';
  context.lineWidth = this.lineWidth;
  context.fill();
  context.stroke();

  context.beginPath();
  context.arc(this.x+33, this.y-22, this.radius, 0, Math.PI * 2, false);
  context.fillStyle = context.strokeStyle = 'hsla(10,70%, 10%, 100)';
  context.lineWidth = this.lineWidth;
  context.fill();
  context.stroke();
};

var createParts = function(){
  if(!partsFull){
    if(parts.length > partCount){
      partsFull = true;
    } else {
      parts.push(new Part()); 
    }
  }
};
  
var updateParts = function(){
  var i = parts.length;
  while(i--){
    parts[i].update();
  }
};

var renderParts = function(){
  var i = parts.length;
  while(i--){
    parts[i].render();
  }   
};
    
var clear = function(){
  context.globalCompositeOperation = 'destination-out';
  context.fillStyle = 'hsla(0, 0%, 0%, .3)';
  context.fillRect(0, 0, WIDTH, HEIGHT);
  context.globalCompositeOperation = 'lighter';
};

// text
function text(){
    var ctx = context;
    ctx.fillStyle = "#fff";
    ctx.font = "italic 30px Arial";
    ctx.fillText("Lorem ipsum dolor sit amet", WIDTH-900, HEIGHT-180); 
}

window.onkeydown = function(e){
	//37 38 39 40
	
	switch(e.keyCode){
		case 37:
			if(leftRight > -580) leftRight-=20;
		break;
			
		case 38:
			upDown-=20;
		break;

		case 39:
			if(leftRight < WIDTH-700) leftRight+=20;
		break;

		case 40:
			upDown+=20;
		break;
	}
}

// METEOR

function meteor(w, h){
	context.beginPath();
		context.fillStyle = context.strokeStyle = 'hsla(10,70%, 10%, 100)';
		context.arc(w,h,20,0,10);
		context.fill();
		context.stroke();
	context.closePath();
}

// Control Meteor

function controlMeteor(){
	
		
	if(h > HEIGHT){
		stage++;
		h = 0;
		w = Math.floor(Math.random()*WIDTH);
	}else{
		h+=10;
	}

	meteor(w, h);
}

function level(){

	if(stage > 2){
		upDown-=50;
	}
}

var loop = function(){
    
    draw();
    drawKorabl();
    controlMeteor();
    //level();
  window.requestAnimFrame(loop, canvas);
  clear();
  createParts();
  updateParts();
  renderParts();
  globalTick++;
};

window.requestAnimFrame=function(){
    return window.requestAnimationFrame||
    window.webkitRequestAnimationFrame||
    window.mozRequestAnimationFrame||
    window.oRequestAnimationFrame||
    window.msRequestAnimationFrame||
    function(a){
        window.setTimeout(a,1E3/60)
}}();

loop();