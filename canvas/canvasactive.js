var canvas = document.querySelector('canvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var c = canvas.getContext('2d');

// c.fillRect(x, y, width, height);
// c.fillStyle = 'rgba(255, 0, 0, 0.5)'
// c.fillRect(100, 100, 100, 100);
// c.fillStyle = 'rgba(55, 50, 0, 0.5)'
// c.fillRect(300, 100, 100, 100);
// c.fillRect(500, 100, 100, 100);
// console.log(canvas);

// Line
// c.beginPath();
// c.moveTo(300, 100);
// c.lineTo(400, 200);
// c.strokeStyle = "#fa34a3";
// c.stroke();

// Arc / circle
// c.arc(x:int, y:int, r: int,
//   startAngle: float, endAanle: float,
//   drawCounterClockwise: Boll (false));
// c.beginPath();
// c.arc(200, 300, 50,
//   0, Math.PI * 2,(false));
// c.stroke();

// for (var i = 0; i < 3; i++) {
//   console.log(this);
//   var x = Math.random() * window.innerWidth;
//   var y = Math.random() * window.innerHeight;
//   c.beginPath();
//   c.arc(x, y, 30, 0, Math.PI * 2, false);
//   c.strokeStyle = 'blue';
//   c.stroke();
// }


// 인터렉션

var mouse = {
  x: undefined,
  y: undefined
}
var maxRadius = 40;
var minRadius = 2;

var colorArray = [
  '#75d9d1',
  '#5d5df6',
  '#df4a6a',
  '#ff4425',
  '#48b781'
]

window.addEventListener('mousemove',
  function (event) {
  mouse.x = event.x
  mouse.y = event.y
})

window.addEventListener('resize', function () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
})

function Circle(x, y, dx, dy, radius) {
  this.x = x;
  this.y = y;
  this.dx = dx;
  this.dy = dy;
  this.radius = radius;
  this.minRadius = radius;
  this.color = colorArray[Math.floor(Math.random() * colorArray.length)];

  this.draw = function () {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.strokeStyle = 'blue';
    // c.stroke();
    c.fillStyle = this.color
    c.fill();
  }
  this.update = function () {
    if (this.x + this.radius > innerWidth || this.x - this.radius < 0) {
      this.dx = -this.dx;
    }
    if (this.y + this.radius > innerHeight || this.y - this.radius < 0) {
      this.dy = -this.dy;
    }

    this.x += this.dx;
    this.y += this.dy;

    // interactivity
    if (mouse.x - this.x < 50 && mouse.x - this.x > -50
        &&mouse.y -this.y < 50 && mouse.y - this.y > -50) {
      this.radius += 1;
      if(this.radius < maxRadius){
        this.radius += 1;
      }
    } else if(this.radius > this.minRadius) {
      this.radius -= 1;
    }

    this.draw();
  }
}
var circleArray = [];

function init() {
  circleArray = [];

  for (var i = 0; i < 600; i++) {
    var radius = Math.random() * 3 + 1;
    var x = Math.random() * (innerWidth - radius *2) + radius;
    var y = Math.random() * (innerHeight - radius *2) + radius;
    // dx, dy는 속도를 조절함
    var dx = (Math.random() - 0.5)*3;
    var dy = (Math.random() - 0.5)*3;
    circleArray.push(new Circle(x, y, dx, dy, radius));
  }
}

function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, innerWidth, innerHeight);
  
  for (var i = 0; i < circleArray.length; i++) {
    circleArray[i].update();
  }

    // c.beginPath();
    // c.arc(x, y, radius, 0, Math.PI * 2, false);
    // c.strokeStyle = 'blue';
    // c.stroke();
    
    // if (x + radius > innerWidth || x - radius < 0) {
    //   dx = -dx;
    // }
    // if (y + radius > innerHeight || y - radius < 0) {
    //   dy = -dy;
    // }

    // x += dx;
    // y += dy;
  }

  init();
  animate();