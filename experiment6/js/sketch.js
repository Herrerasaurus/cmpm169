// sketch.js - purpose and description here
// Author: Your Name
// Date:

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file
// press up, down, and right arrow keys to switch data sets

// base code to get the stick figure taken from https://openprocessing.org/sketch/909325
// updated text positioning, and added keyboard input to animate walking
// duplicated Leg function to make an additional Arm function
// added text input

let input, button;
let stickmen = [];

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
    background(100);
    input = createInput("TEXT");
    input.position(10, height + 10);
    button = createButton("Add Stickman");
    button.position(input.x + input.width + 10, height + 10);
    button.mousePressed(addStickman);
}

function addStickman() {
    let message = input.value();
    stickmen.push(new Stickman(message));
}

function draw() {
    background(255);
  
    // drawing street
    fill(185, 247, 250);
    noStroke();
    quad(0,0,1300,0,1300,300,0,300);
    fill(37, 37, 37);

    quad(0,1800,1600,200,1800,300,0,300);


    stroke(0);
    fill(37, 37, 37);

    stroke(0);
    fill(1000, 1000, 1000);
    triangle(500,300,500,600,540,600);
    fill(21, 87, 24);
    triangle(0,300,350,300,0,435);
    triangle(1300,435,700,300,1300,300);
    fill(247, 255, 0);
    noStroke();
    quad(0,480,120,417,200,415,80,480);
    quad(200,480,310,415,400,410,290,477);
  
    quad(1000,480,880,417,800,415,920,480);
    quad(800,480,690,415,600,410,710,477);


    for (let i = 0; i < stickmen.length; i++) {
        fill(1000,100,100)
        stickmen[i].display();
    }
}

function Stickman(message) {
    this.message = message;
    this.xOffset = stickmen.length * 200;
    this.legs = [new Leg(0, this.xOffset), new Leg(1, this.xOffset)];
    this.arms = [new Arm(0, this.xOffset), new Arm(1, this.xOffset)];
    
    this.display = function () {
        for (let i = 0; i < this.legs.length; i++) {
            this.legs[i].display(this.message);
        }
        for (let i = 0; i < this.arms.length; i++) {
            this.arms[i].display(this.message);
        }
        
        // neck
        textLine(this.message, 20, 260 + this.xOffset, 120, 260 + this.xOffset, 200);
        textLine(this.message, 20, 260 + this.xOffset, 200, 260 + this.xOffset, 280);
        // face
        textLine(this.message, 20, 220 + this.xOffset, 100, 320 + this.xOffset, 100);
        textLine(this.message, 20, 220 + this.xOffset, 100, 220 + this.xOffset, 20);
        textLine(this.message, 20, 300 + this.xOffset, 20, 200 + this.xOffset, 20);
        textLine(this.message, 20, 300 + this.xOffset, 20, 300 + this.xOffset, 120);
    }
    
}

function Leg(ar, xOffset) {
    this.s = 1;
    this.x = 200 + xOffset;
    this.y = 450;
    this.f = 0;
    this.xOffset = xOffset;
    
    this.move = function () {
        if (keyIsDown(LEFT_ARROW) || keyIsDown(RIGHT_ARROW)) {
            if (ar == 1) {
                this.x -= this.s;
                if (this.s < 0) {
                    this.y -= sin(this.f / 15);
                } else {
                    this.f = 0;
                    this.y = 450;
                }
                if (this.x > 230 + this.xOffset || this.x < 150 + this.xOffset) {
                    this.s *= -1;
                }
                this.f++;
            } else {
                this.x += this.s;
                if (this.s > 0) {
                    this.y -= sin(this.f / 15);
                } else {
                    this.f = 0;
                    this.y = 450;
                }
                if (this.x > 230 + this.xOffset || this.x < 150 + this.xOffset) {
                    this.s *= -1;
                }
                this.f++;
            }
        }
    };
    
    this.display = function (message) {
        this.move();
        push();
        textLine(message, 20, 260 + this.xOffset, 275, this.x + 90, 350);
        textLine(message, 20, this.x + 90, 350, map(this.x, 230, 150, 230, 50) - this.xOffset, this.y);
        pop();
    };
}

function Arm(ar, xOffset) {
    this.s = 1;
    this.x = ar === 0 ? 190 + xOffset : 330 + xOffset;
    this.y = 200;
    this.f = 0;
    this.xOffset = xOffset;
    
    this.move = function () {
        if (keyIsDown(LEFT_ARROW) || keyIsDown(RIGHT_ARROW)) {
            if (ar == 1) {
                this.x -= this.s;
                if (this.x > 330 + this.xOffset || this.x < 250 + this.xOffset) {
                    this.s *= -1;
                }
            } else {
                this.x += this.s;
                if (this.x > 270 + this.xOffset || this.x < 190 + this.xOffset) {
                    this.s *= -1;
                }
            }
        }
    };
    
    this.display = function (message) {
        this.move();
        push();
        if (ar === 0) {
            textLine(message, 20, 260 + this.xOffset, 120, this.x, 200);
            textLine(message, 20, this.x, 200, this.x + 50, 260);
        } else {
            textLine(message, 20, 260 + this.xOffset, 120, this.x, 200);
            textLine(message, 20, this.x, 200, this.x + 50, 250);
        }
        pop();
    };
}

function textLine(text2, s, x1, y1, x2, y2) {
    push();
    textAlign(CENTER, CENTER);
    var message = text2;
    var letters = split(message, '');
    translate(x1, y1);
    for (let i = 0; i < letters.length; i++) {
        push();
        translate((i * (x2 / letters.length)) - (x1 * i / letters.length), i * (y2 / letters.length) - (y1 * i / letters.length));
        textSize(s);
        text(letters[i], 0, 0);
        pop();
    }
    pop();
}


function resizeScreen() {
  centerHorz = canvasContainer.width() / 2; // Adjusted for drawing logic
  centerVert = canvasContainer.height() / 2; // Adjusted for drawing logic
  console.log("Resizing...");
  resizeCanvas(1200, 600);
  // redrawCanvas(); // Redraw everything based on new size
}
