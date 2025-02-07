// sketch.js - purpose and description here
// Author: Your Name
// Date:

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file
// press up, down, and right arrow keys to switch data sets

let table;
let table1;
let table2;
let table3;
let data = [];
let numCubes = 100; // Number of cubes
let radius = 500; // Circle radius
let angleStep;
let rotationAngle = 0; // Shared rotation
let pointX = [];
let pointZ = [];
let pointH = [];
let count = 0;
let temp = 0;

function preload() {
  table1 = loadTable("data/data1.csv", "csv", "header"); // Load CSV file
  table2 = loadTable("data/data2.csv", "csv", "header"); // Load CSV file
  table3 = loadTable("data/data3.csv", "csv", "header"); // Load CSV file
  table = table1;
}

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
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height(), WEBGL);
  canvas.parent("canvas-container");
  // resize canvas is the page is resized
  // ... some other stuff
  $(window).resize(function() {
    resizeScreen();
  });
  resizeScreen();
  angleStep = TWO_PI / numCubes; // Angle between each cube
  data = getData(); // Process stock data
  let cam = camera(-2500,-2000,0, 0, 0, 0, 0, 10000, -100)
}

function draw() {
  background(100);
  orbitControl(); // Enable mouse interaction
  rotationAngle += 0.01; // Rotate for better viewing
  push();

  //rotateY(rotationAngle); // Rotate the entire circle of cubes

  for (let i = 0; i < numCubes; i++) {
    let angle = i * angleStep;
    let x = cos(angle) * radius;
    let z = sin(angle) * radius;
    let h = data[i] || 100; // Get height or default value
    pointX.push(x);
    pointZ.push(z);
    pointH.push(h);
    push();
    fill(1000,1000,1000)
    translate(x, -h / 2, z); // Adjust position so cubes grow upward
    box(10, h, 10); // Cube size with height from stock data
    fill(100,200,0);
    translate(0, -h*.5,0);
    //rotateX(90);
    rotateY(90);
    box(30, 10, 20)
    pop();
      //drawing cube that travels along the top of the cubes
  }
  push();
  fill(200,100,100);
  translate(pointX[count], -pointH[count] - 10, pointZ[count]);
  box(30, 10, 30);
  translate(0, -5, 0)
  fill(210, 140, 180)
  box(20, 20, 20);

  pop();
  pop();
  temp++;
  if(temp == 5){
    temp = 0;
    count += 1;
    if(count >= pointX.length){
      count = 0;
    }
  }
}

function getData() {
  let stockValues = [];
  
  for (let i = 0; i < table.getRowCount() && i < numCubes; i++) {
    let value = table.getNum(i, "Close"); // Get closing price
    stockValues.push(value);
  }

  // Normalize data for visualization
  let minPrice = Math.min(...stockValues);
  let maxPrice = Math.max(...stockValues);
  return stockValues.map(price => map(price, minPrice, maxPrice, 20, 150));
}

function keyPressed() {
	if(keyCode == UP_ARROW){
      table = table1;
      data = getData();
      pointX = [];
      pointY = [];
      pointH = [];
    } 
    if(keyCode == DOWN_ARROW){
      table = table2;
      data = getData();
      pointX = [];
      pointY = [];
      pointH = [];

    }
    if(keyCode == RIGHT_ARROW){
      table = table3;
      data = getData();
      pointX = [];
      pointY = [];
      pointH = [];

    }
}
