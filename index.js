// declare global variable
let video = null; // video element
let detector = null; // detector object
let detections = []; // store detection result
let videoVisibility = true;
let detecting = false;
var msg = new SpeechSynthesisUtterance();
// speechSynthesis.speak(new SpeechSynthesisUtterance('Hello World'));

// global HTML element
const toggleVideoEl = document.getElementById("toggleVideoEl");
const toggleDetectingEl = document.getElementById("toggleDetectingEl");

// set cursor to wait until video elment is loaded
document.body.style.cursor = "wait";

// The preload() function if existed is called before the setup() function
function preload() {
  // create detector object from "cocossd" model
  detector = ml5.objectDetector("cocossd");
  console.log("detector object is loaded");
}

// let front = false;
// document.getElementById("flip-button").onclick = () => {
//   front = !front;
// };

function getWidth() {
  return Math.max(
    document.body.scrollWidth,
    document.documentElement.scrollWidth,
    document.body.offsetWidth,
    document.documentElement.offsetWidth,
    document.documentElement.clientWidth
  );
}

const constraints = {
  video: {
    facingMode: { facingMode: getWidth() < 700 ? "user" : "environment" },
  },
};
// The setup() function is called once when the program starts.
function setup() {
  // create canvas element with 640 width and 480 height in pixel
  createCanvas(640, 480);
  // Creates a new HTML5 <video> element that contains the audio/video feed from a webcam.
  // The element is separate from the canvas and is displayed by default.
  video = createCapture(constraints);
  video.size(640, 480);
  console.log("video element is created");
  video.elt.addEventListener("loadeddata", function () {
    // set cursor back to default
    if (video.elt.readyState >= 2) {
      document.body.style.cursor = "default";
      console.log(
        'video element is ready! Click "Start Detecting" to see the magic!'
      );
    }
  });
}

// the draw() function continuously executes until the noLoop() function is called
function draw() {
  if (!video || !detecting) return;
  // draw video frame to canvas and place it at the top-left corner
  image(video, 0, 0);
  // draw all detected objects to the canvas
  for (let i = 0; i < detections.length; i++) {
    drawResult(detections[i]);
  }
}

function drawResult(object) {
  drawBoundingBox(object);
  drawLabel(object);
  console.log(object.label);
}

// draw bounding box around the detected object
function drawBoundingBox(object) {
  // Sets the color used to draw lines.
  stroke("blue");
  // width of the stroke
  strokeWeight(2);
  // Disables filling geometry
  noFill();
  // draw an rectangle
  // x and y are the coordinates of upper-left corner, followed by width and height
  rect(object.x, object.y, object.width, object.height);
  msg.text = `${object.label}`;
  window.speechSynthesis.speak(msg);
  console.log(object.label);
}

// draw label of the detected object (inside the box)
function drawLabel(object) {
  // Disables drawing the stroke
  noStroke();
  // sets the color used to fill shapes
  fill("white");
  // set font size
  textSize(24);
  // draw string to canvas
  text(object.label, object.x + 10, object.y + 24);
  text(object.confidence.toFixed(2), object.x + 10, object.y + 50);
  // console.log(object.confidence);
}

// callback function. it is called when object is detected
function onDetected(error, results) {
  if (error) {
    console.error(error);
  }
  detections = results;
  // keep detecting object
  if (detecting) {
    detect();
  }
}

function detect() {
  // instruct "detector" object to start detect object from video element
  // and "onDetected" function is called when object is detected
  detector.detect(video, onDetected);
}
function toggleVideo() {
  if (!video) return;
  if (videoVisibility) {
    video.hide();
    toggleVideoEl.innerText = "Show Video";
  } else {
    video.show();
    toggleVideoEl.innerText = "Hide Video";
  }
  videoVisibility = !videoVisibility;
}

function toggleDetecting() {
  if (!video || !detector) return;
  if (!detecting) {
    detect();
    toggleDetectingEl.innerText = "Stop Detecting";
  } else {
    toggleDetectingEl.innerText = "Start Detecting";
  }
  detecting = !detecting;
}
