// sketch.js - experiment 3 for cmpm 169 
// Author: Hasina Esteqlal and Celeste Herrera
// Date: 1/21/2025

/*
inspo: spiral, something to mimic Weather Systems
https://editor.p5js.org/generative-design/sketches/P_2_1_1_04
https://editor.p5js.org/generative-design/sketches/M_6_1_01 
https://openprocessing.org/sketch/999506 

*/

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file
const VALUE1 = 1;
const VALUE2 = 2;
// const spiralRaidus = 200; 
// const noiseScale = 0.02;
const numArms = 7; 
const maxRadius = 400; 
const arcLength = 3.14 / 6;
const spiralSpeed = 0.03;



// Globals
let myInstance;
let canvasContainer;
var centerHorz, centerVert;
let angles = [];
let noiseScale = 0.01;
let c;
let prev;

class MyClass {
    constructor(param1, param2) {
        this.property1 = param1;
        this.property2 = param2;
    }

    myMethod() {
        // code to run when method is called
    }
}

function resizeScreen() {
  centerHorz = canvasContainer.width() / 2; // Adjusted for drawing logic
  centerVert = canvasContainer.height() / 2; // Adjusted for drawing logic
  console.log("Resizing...");
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
  // redrawCanvas(); // Redraw everything based on new size
}

// setup() function is called once when the program starts
function setup() {
  // place our canvas, making it fit our container
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent("canvas-container");
  // resize canvas is the page is resized

  // create an instance of the class
  myInstance = new MyClass("VALUE1", "VALUE2");

  $(window).resize(function() {
    resizeScreen();
  });
  resizeScreen();
  // angles for each arm 
  for (let i = 0; i < numArms; i++) 
    {
      angles.push(random(TWO_PI));
    }
  
  }
  
  // draw() function is called repeatedly, it's the main animation loop
  function draw() 
  {
    background('#73c2fb');
  
        // // Weather map effect: Dynamic color blobs
        // noStroke();
  
        // // Generate "weather map" blobs using noise
        // for (let x = 0; x < width; x += 20) 
        //   {
        //     for (let y = 0; y < height; y += 20) 
        //       {
        //         // Generate noise value for smooth randomness
        //         let noiseValue = noise(x * 0.01, y * 0.01, frameCount * 0.01);
    
        //         // Map noise value to color ranges
        //         let c;
        //         if (noiseValue < 0.4) 
        //         {
        //             c = color(0, 0, 255, 150); // Blue for cold or rain
        //         } 
        //         else if (noiseValue < 0.6) 
        //         {
        //             c = color(255, 255, 0, 150); // Yellow for moderate areas
        //         } else {
        //             c = color(255, 0, 0, 150); // Red for hot or intense areas
        //         }
    
        //         // Draw rectangles to create a blocky, weather-map-like effect
        //         fill(c);
        //         ellipse(x, y, 20, 20);
        //     }
        // }
  
    noFill();
    stroke(255);
    strokeWeight(3);
  
    // find center of canvas
    let centerX = width / 2;
    let centerY = height / 2; 
  
    // draw spiral arms
    for (let i = 0; i < numArms; i++)
    {
      let angle = angles[i];
      let radius = maxRadius; 
          
      while (radius > 0)
      {
        let startAngle = angle; 
        let endAngle = angle + arcLength;
        const n = noise(radius * noiseScale, height * noiseScale, frameCount * 0.01)
        if (n < 0.33) 
        {
          c = lerpColor(color("red"), color("orange"), n); // Red-Orange for hot or intense areas
        } 
        else if (n < 0.66) 
        {
          c = lerpColor(color("yellow"), color("green"), n); // Yellow for moderate areas
        } else {
          c = lerpColor(color("blue"), color("purple"), n); // Blue for cold or rain
        }
        if(prev){
          c = lerpColor(c, prev, n);
        }
        if(radius > 300){
          c = color("white");
          c.setAlpha(50);
        }
        stroke(c);
        prev = c;
        arc(centerX, centerY, radius * 2, radius * 2, startAngle, endAngle);
        
        // reduce speed
        radius -= 10; 
        angle += arcLength * 0.5;
  
      }
      angles[i] += spiralSpeed;
  
    }
  }

// mousePressed() function is called once after every time a mouse button is pressed
function mousePressed() {
    // code to run when mouse is pressed
}