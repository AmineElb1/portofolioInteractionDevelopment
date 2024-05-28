//origneel concept was een emotion detection model, maar dit werkte niet goed op mijn laptop
//daarom heb ik het aangepast naar een object detection model

let emotionModel;
let videoStream;
let detectedEmotion = "";
let detectedConfidence = "";
let lastDetectionTime = 0;
const detectionInterval = 2000; // Update every 2 seconds

function modelInitialized() {
  console.log("Emotion Detection Model is initialized!");
}

function emotionResults(error, results) {
  if (error) {
    console.error(error);
  } else {
    console.log(results);
    detectedEmotion = results[0].label;
    detectedConfidence = Math.round(results[0].confidence * 100) + "%";
  }
}

function setup() {
  createCanvas(640, 480);
  videoStream = createCapture(VIDEO);
  videoStream.hide();
  background(0);

  emotionModel = ml5.imageClassifier("MobileNet", videoStream, modelInitialized);
}

function draw() {
  if (millis() - lastDetectionTime > detectionInterval) {
    emotionModel.predict(videoStream, emotionResults);
    lastDetectionTime = millis();
  }

  image(videoStream, 0, 0, width, height);

  // Displaying results with animation
  if (detectedEmotion !== "" && detectedConfidence !== "") {
    // Text color
    fill(255);
    // Text background color with transparency
    let bgColor = color(0, 77, 64, 100); // Semi-transparent dark green background
    // Text background
    rectMode(CENTER);
    fill(bgColor);
    rect(width / 2, height - 60, 400, 80, 10); // Position and size of the background

    // Font
    textFont("Roboto");
    // Text size
    textSize(24);
    // Text alignment
    textAlign(CENTER, CENTER);
    // Text color
    fill("white");
    // Text
    text(detectedEmotion, width / 2, height - 60); // Detected emotion
    textSize(18);
    // Text
    text("Confidence: " + detectedConfidence, width / 2, height - 30); // Confidence level
  } else {
    // Displaying a waiting message during the prediction process
    // Text color
    fill(255);
    // Font
    textFont("Roboto");
    // Text size
    textSize(24);
    // Text alignment
    textAlign(CENTER, CENTER);
    // Text
    text("Detecting Emotion...", width / 2, height - 20); // Detecting message
  }
}
