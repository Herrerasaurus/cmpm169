// sketch.js - Taking inspiration from the piece “Gallop in Motion”, this project animates the motion of the horse to follow your mouse.

// Author: Celeste Herrera
// Date: Jan 2025

// Utalizes code from P_2_1_1_04
//https://editor.p5js.org/generative-design/sketches/P_2_1_1_04
/**
 * s                   : save png
 */

'use strict';

var tileCountX = 16;
var tileCountY = 10;
var tileWidth;
var tileHeight;
let canvasContainer;
var centerHorz, centerVert;



var drawMode = 1;


// load in animation frames
var anim = [];

function preload (){
  for(var i = 0; i < 12; i++){
    anim[i] = loadImage('animation/image'+(i+1)+'.png');
  }

}
function resizeScreen() {
  centerHorz = canvasContainer.width() / 2; // Adjusted for drawing logic
  centerVert = canvasContainer.height() / 2; // Adjusted for drawing logic
  console.log("Resizing...");
  resizeCanvas(canvasContainer.width(), canvasContainer.height());

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
  tileCountX = canvasContainer.width() / 75;
  tileCountY = canvasContainer.height() / 55;
  tileWidth = width / tileCountX;
  tileHeight = height / tileCountY;
}


function draw() {
  clear();
  for (var gridY = 0; gridY < tileCountX; gridY++) {
    for (var gridX = 0; gridX < tileCountY; gridX++) {

      var posX = tileWidth * gridX + tileWidth / 2;
      var posY = tileHeight * gridY + tileWidth / 2;
      var frame = round((distance / 25) % 11);

      // calculate distance between the mouse and the image
      var distance = dist(mouseY, mouseX, posY, posX);
      var frame = round((distance / 25) % 11);
      var offset = round(distance / -5);
      
      push();
      translate(posX, posY);
      image(anim[frame], offset, 0);
      pop();
    }
  }
}

function keyReleased() {
  if (key == 's' || key == 'S') saveCanvas(gd.timestamp(), 'png');
}
