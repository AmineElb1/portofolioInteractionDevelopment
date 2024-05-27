let video;
let poseNet;
let handpose;
let poses = [];
let hands = [];
let objects = [];
let interactionRadius = 50;

function setup() {
  createCanvas(640, 480).parent('canvasContainer');
  
  // Video capture
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();
  
  // Initialize PoseNet
  poseNet = ml5.poseNet(video, modelReady('PoseNet'));
  poseNet.on('pose', function(results) {
    poses = results;
  });
  
  // Initialize Handpose
  handpose = ml5.handpose(video, modelReady('Handpose'));
  handpose.on('predict', results => {
    hands = results;
  });
  
  // Create some objects to interact with
  for (let i = 0; i < 5; i++) {
    objects.push(new InteractiveObject(random(width), random(height)));
  }
}

function modelReady(modelName) {
  return function() {
    console.log(`${modelName} Model Loaded!`);
  }
}

class InteractiveObject {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 50;
    this.color = color(random(255), random(255), random(255));
    this.isPicked = false;
  }
  
  display() {
    fill(this.color);
    ellipse(this.x, this.y, this.size);
  }
  
  checkInteraction(hands) {
    for (let hand of hands) {
      let handX = hand.landmarks[8][0];
      let handY = hand.landmarks[8][1];
      let d = dist(handX, handY, this.x, this.y);
      
      // Object prikken/slaan
      if (d < interactionRadius) {
        this.color = color(random(255), random(255), random(255));
      } else {
        // Reset de kleur als de hand niet in de buurt is
        this.color = this.defaultColor;
      }
      
      // Object oppakken
      if (d < this.size / 2) {
        this.isPicked = true;
      } else {
        // Als de hand niet in de buurt is, stop met oppakken
        this.isPicked = false;
      }
    }
  }
  
  
  move() {
    if (this.isPicked) {
      if (hands.length > 0) {
        this.x = hands[0].landmarks[8][0];
        this.y = hands[0].landmarks[8][1];
      } else {
        this.isPicked = false;
      }
    }
  }
}

function draw() {
  background(220);
  
  // Draw video
  image(video, 0, 0, width, height);
  
  // Update and display objects
  for (let obj of objects) {
    obj.move();
    obj.checkInteraction(hands);
    obj.display();
  }
  
  // Draw detected hand landmarks
  drawHands();
}

function drawHands() {
  for (let hand of hands) {
    for (let j = 0; j < hand.landmarks.length; j++) {
      let [x, y, z] = hand.landmarks[j];
      fill(0, 255, 0);
      noStroke();
      ellipse(x, y, 10, 10);
    }
  }
}
