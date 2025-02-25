// sketch.js - purpose and description here
// Author: Your Name
// Date:

let particles = [];
let cylinderRadius = 150;
let cylinderHeight = 300;
let gravity;
let selectedColor;
let colors = ['#00FF00', '#FF0000', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'];
let cam;
let bounceFactor = 0; // Set bounce factor to 0 to turn off bounce
let maxVelocity = 1.2; // Limit the maximum velocity

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
    gravity = createVector(0, 0.1, 0);
    selectedColor = color(255, 0, 0); // Default red
    cam = createCamera();
}

function resizeScreen() {
  centerHorz = canvasContainer.width() / 2; // Adjusted for drawing logic
  centerVert = canvasContainer.height() / 2; // Adjusted for drawing logic
  console.log("Resizing...");
  resizeCanvas(1200, 600);
  // redrawCanvas(); // Redraw everything based on new size
}

function draw() {
    background(0);
    lights();
  
    // Draw the open cylinder
    push();
    noFill();
    stroke(255);
    cylinder(cylinderRadius, cylinderHeight, 24, 1, false);
    pop();
  
    // Update and display particles
    for (let p of particles) {
      p.update();
      p.checkBounds(); // Ensure particles stay inside the cylinder
      p.checkCollisions(particles); // Check for collisions with other particles
      p.display();
    }
  
    // Draw the fixed 2D sidebar with labels
    drawUI();
  }
  
  // Draw color selection sidebar in a fixed 2D overlay
  function drawUI() {
    push();
    resetMatrix(); // Reset transformations
    ortho(); // Switch to orthographic view for UI elements
    noLights();
    
    // Sidebar background
    fill(50);
    rect(-width / 2 + 10, -height / 2 + 10, 50, colors.length * 40 + 20);
  
    // Color buttons with labels
    for (let i = 0; i < colors.length; i++) {
      fill(colors[i]);
      stroke(255);
      rect(-width / 2 + 20, -height / 2 + 20 + i * 40, 30, 30);
    }
    pop();
  }
  
  
  function mousePressed() {
    let screenX = mouseX - width / 2;
    let screenY = mouseY - height / 2;
  
    // Check if clicking on color selection boxes
    if (screenX > -width / 2 + 20 && screenX < -width / 2 + 50) {
      let index = Math.floor((screenY + height / 2 - 20) / 40);
      if (index >= 0 && index < colors.length) {
        selectedColor = color(colors[index]);
        return;
      }
    }
  
    // Convert 2D mouse position to world coordinates for dropping spheres
    let x = map(mouseX - width / 2, -width / 2, width / 2, -cylinderRadius, cylinderRadius);
    let z = map(mouseY - height / 2, -height / 2, height / 2, -cylinderRadius, cylinderRadius);
  
    if (x ** 2 + z ** 2 <= cylinderRadius ** 2) {
      particles.push(new Particle(x, -cylinderHeight / 2, z, selectedColor));
    }
  }
  
  class Particle {
    constructor(x, y, z, c) {
      this.position = createVector(x, y, z);
      this.velocity = createVector(0, 0, 0);
      this.acceleration = createVector(0, 0, 0);
      this.radius = 20; // Bigger spheres
      this.color = c;
    }
  
    applyForce(force) {
      this.acceleration.add(force);
    }
  
    update() {
      this.applyForce(gravity);
      this.velocity.add(this.acceleration);
      this.position.add(this.velocity);
      this.acceleration.mult(0);
  
      // Clamp the velocity to the max value to prevent runaway speeds
      if (this.velocity.mag() > maxVelocity) {
        this.velocity.normalize().mult(maxVelocity);
      }
    }
  
    checkBounds() {
      // Prevent particle from going below the cylinder's bottom
      if (this.position.y + this.radius > cylinderHeight / 2) {
        this.position.y = cylinderHeight / 2 - this.radius;
        this.velocity.y = 0; // No bounce, stop vertical motion
      }
  
      // Prevent particle from going above the cylinder's top
      if (this.position.y - this.radius < -cylinderHeight / 2) {
        this.position.y = -cylinderHeight / 2 + this.radius;
        this.velocity.y = 0; // No bounce, stop vertical motion
      }
  
      // Prevent particle from going outside the cylinder's radius (on the X/Z plane)
      let distFromCenter = sqrt(this.position.x ** 2 + this.position.z ** 2);
      if (distFromCenter + this.radius > cylinderRadius) {
        let normal = createVector(this.position.x, 0, this.position.z).normalize();
        
        // Ensure that the normal vector is finite
        if (isFinite(normal.x) && isFinite(normal.y) && isFinite(normal.z)) {
          let distanceToBoundary = distFromCenter + this.radius - cylinderRadius;
          
          // Apply a correction to push the particle back inside
          this.position.sub(normal.mult(distanceToBoundary));
          
          // Stop velocity in the direction of the boundary to prevent the particle from escaping
          let velocityAlongNormal = this.velocity.dot(normal);
          if (isFinite(velocityAlongNormal)) {
            this.velocity.sub(normal.mult(velocityAlongNormal)); // Zero out motion in the direction of escape
          }
        }
      }
  
      // Ensure position values stay finite (prevents NaN or Infinity)
      if (!isFinite(this.position.x) || !isFinite(this.position.y) || !isFinite(this.position.z)) {
        this.position.set(0, 0, 0); // Reset to a safe position
        this.velocity.set(0, 0, 0); // Reset velocity as well
      }
    }
  
    // Check and resolve collisions with other particles
    checkCollisions(particles) {
      for (let other of particles) {
        if (other !== this) {
          let distance = dist(this.position.x, this.position.y, this.position.z, other.position.x, other.position.y, other.position.z);
          let minDist = this.radius + other.radius;
          if (distance < minDist) {
            let normal = p5.Vector.sub(this.position, other.position).normalize();
            let relativeVelocity = p5.Vector.sub(this.velocity, other.velocity);
            let speed = relativeVelocity.dot(normal);
            
            // Only resolve if particles are moving towards each other
            if (speed < 0) {
              let impulse = normal.mult(-2 * speed);
              this.velocity.add(impulse);
              other.velocity.sub(impulse);
              
              // Prevent overlap
              let overlap = minDist - distance;
              let correction = normal.mult(overlap / 2);
              this.position.add(correction);
              other.position.sub(correction);
  
              // Optionally, limit the velocity change after the collision to prevent runaway speeds
              this.velocity.limit(maxVelocity);
              other.velocity.limit(maxVelocity);
            }
          }
        }
      }
    }
  
    display() {
      push();
      translate(this.position.x, this.position.y, this.position.z);
      fill(this.color);
      noStroke();
      sphere(this.radius);
      pop();
    }
  }
  