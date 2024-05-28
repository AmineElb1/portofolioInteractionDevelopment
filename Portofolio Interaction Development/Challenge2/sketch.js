let videoStream;
let handModel;
let predictions = [];
let rocket = null;
let rocketImage;
let score = 0;
let lastRocketChangeTime = 0;
const rocketVisibleTime = 5000;
const rocketChangeInterval = 2000;
let rocketDeflected = false;

function preload() {
  rocketImage = loadImage("raket.png");
}

function setup() {
  createCanvas(640, 480);
  videoStream = createCapture(VIDEO);
  videoStream.hide();
  handModel = ml5.handpose(videoStream, modelLoaded);
  handModel.on("predict", predictionsReceived);
}

function modelLoaded() {
  console.log("Model Loaded!");
}

function predictionsReceived(results) {
  predictions = results;
}

function newRocket() {
  rocket = {
    x: random(width),
    y: random(height * 0.5, height * 0.8),
    size: random(80, 100),
    deflected: false,
    spawnTime: millis(),
  };
  rocketDeflected = false;
}

function draw() {
  image(videoStream, 0, 0, width, height);

  for (let i = 0; i < predictions.length; i++) {
    let hand = predictions[i];
    for (let j = 0; j < hand.annotations.indexFinger.length; j++) {
      let fingertip = hand.annotations.indexFinger[j];
      let x = fingertip[0];
      let y = fingertip[1];
      fill(0, 255, 0);
      ellipse(x, y, 20, 20);
    }
    if (rocket && !rocketDeflected) {
      for (let j = 0; j < hand.annotations.indexFinger.length; j++) {
        let fingertip = hand.annotations.indexFinger[j];
        let x = fingertip[0];
        let y = fingertip[1];
        let d = dist(x, y, rocket.x, rocket.y);
        if (d < rocket.size / 2) {
          rocketDeflected = true;
          if (!rocket.deflected) {
            rocket.deflected = true;
            score++;
          }
        }
      }
    }
  }

  if (rocket) {
    if (!rocket.deflected) {
      let aspectRatio = rocketImage.width / rocketImage.height;
      let rocketHeight = rocket.size;
      let rocketWidth = rocketHeight * aspectRatio;
      image(
        rocketImage,
        rocket.x - rocketWidth / 2,
        rocket.y - rocketHeight / 2,
        rocketWidth,
        rocketHeight
      );
    }
  }

  if (rocket && millis() - rocket.spawnTime > rocketVisibleTime) {
    rocket = null;
    lastRocketChangeTime = millis();
  }

  textSize(24);
  fill(0);
  textAlign(LEFT, TOP);
  text("Score: " + score, 10, 10);

  if (
    millis() - lastRocketChangeTime > rocketChangeInterval &&
    !rocket
  ) {
    newRocket();
  }
}
