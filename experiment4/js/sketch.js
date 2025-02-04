// sketch.js - purpose and description here
// Author: Your Name
// Date:

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file
let capture;
let screenshot;
let shapesX = [];
let shapesY = [];
let reds = [];
let blues = [];
let yellows = [];
let screenshots = [];
let temp;
let count = 0;
let snap;
let row = 0;

function resizeScreen() {
  centerHorz = canvasContainer.width() / 2; // Adjusted for drawing logic
  centerVert = canvasContainer.height() / 2; // Adjusted for drawing logic
  console.log("Resizing...");
  resizeCanvas(1200, 600);
  // redrawCanvas(); // Redraw everything based on new size
}

function setup() {
  // place our canvas, making it fit our container
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent("canvas-container");
  // resize canvas is the page is resized
  // ... some other stuff
  $(window).resize(function() {
    resizeScreen();
  });
  resizeScreen();
  createCanvas(width, height);
  capture = createCapture(VIDEO);
  capture.size(150, 100);
  capture.hide();
  frameRate(10);
}

function draw() {
  rect(0, 0, 80, 600)
  rect(260, 0, 120, 600)
  rect(560, 0, 120, 600)
  rect(860, 0, 120, 600)
  for(let x = 0; x < 4; x++){
    let y = 0;
    if(row > x){
      temp = screenshots[y];
      image(temp, 150, 100)
      temp = screenshots[y+1];
      image(temp, 150, 100)
      temp = screenshots[y+2]
      image(temp, 150, 100)
      y += 3;
    }else{
      image(capture, 95, 25 + (125*x), 150, 100);
      image(capture, 395, 25 + (125*x), 150, 100);
      image(capture, 695, 25 + (125*x), 150, 100);

    }
  }
  for(let x = 0; x < shapesX.length; x++){
    star(shapesX[x], shapesY[x]);    fill(random(255),random(255),random(255),100);
  }
  if (mouseIsPressed) {
	append(shapesX, mouseX);
    append(shapesY, mouseY);
    append(reds, random(255));
    append(yellows, random(255));
    append(blues, random(255));
    //rect(0,0,1000,700);
    fill(1000);
    snap = capture.get(95, 25 + (125*(count/3)), 150, 100);
    append(screenshots, snap);
    snap = capture.get(395, 25 + (125*(count/3)), 150, 100);
    append(screenshots, snap);
    snap = capture.get(695, 25 + (125*(count/3)), 150, 100);
    append(screenshots, snap);
    count +=3;
    row+=1;
    
	}
}

function star(x, y){
  fill(255,255,0);
  stroke(255, 255, 0);
  let orientation=random(TWO_PI);
  beginShape();
  for (let a=0; a<5; a++) {
    vertex(x+cos(orientation)*10, y+sin(orientation)*10);
    orientation+=TWO_PI/5*2;
  }
  endShape(CLOSE);
}