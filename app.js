var express = require('express');
const NeoPixel = require('./NeoPixel');
const PixelFunctions = require('./PixelFunctions');
var app = express();

app.use(express.json());

var functions = new PixelFunctions();

app.listen(3000, () =>{
  console.log("server started");
});

app.post("/setSections", (req, res) => {
  console.log(req.body);
  var sections = [];
  req.body.sections.forEach((val) => {
    sections.push(val.split(""));
  });
  const reset = req.body.reset;
  const color = req.body.color;
  const fade = req.body.fade;

  if (fade && fade.doFade) {
    functions.fadeSections(sections, color, fade.fadeTo, fade.fadeTime, reset);
  } else {
    functions.lightSections(sections, color, reset);
  }

  res.json("Success");
});

app.post("/fullGrid", (req, res) => {
  console.log(req.body);
  var color = req.body.color;
  var fade = req.body.fade;

  if (fade && fade.doFade) {
    functions.fadeFill(color, fade.fadeTo, fade.fadeTime);
  } else {
    functions.fillSections(color);
  }

  res.json("Success");
});

app.get("/confetti", (req, res) => {
  functions.confetti();
  res.json("Confetti started");
});

app.post("/chaosFloor", (req, res) => {
  var time = req.body.time;

  functions.chaosFloor(time);
  
  res.json("Chaos floor started");
});

app.post("/stopChaosFloor", (req, res) => {
  functions.stopChaosFloor();
  res.json("Chaos floor stopped");
});

app.get("/spaceBallet", (req, res) => {
  functions.spaceBallet();
  res.json("Space Ballet Started");
});

app.get("/stopSpaceBallet", (req, res) => {
  functions.stopSpaceBallet();
  res.json("Space Ballet stopped");
});

app.get("/trainPath", (req, res) => {
  functions.trainPath();
  res.json("Town Center Path Started");
});

app.get("/startYellowPulseLine", (req, res) => {
  functions.startYellowPulseLine();
  res.json("Yellow pulse line started");
});

app.get("/stopYellowPulseLine", (req, res) => {
  functions.stopYellowPulseLine();
  res.json("Yello pulse line stopped");
});

app.post("/trainComing", (req, res) => {
  var trainStopE4 = req.body.trainStopE4;
  functions.runTrainComing(trainStopE4);
  res.json("train sequence started");
});

app.post("/trainLeaves", (req, res) => {
  var trainStopE4 = req.body.trainStopE4;
  functions.runTrainLeaves(trainStopE4);
  res.json("train leaving started");
});

app.get("/trainExitsE4", (req, res) => {
  functions.trainExits();
  res.json("train exiting");
});

app.get("/snakeFloor", (req, res) => {
  functions.startSnakeFloor();
  res.json("snake floor started");
});

app.get("/stopSnakeFloor", (req, res) => {
  functions.stopSnakeFloor();
  res.json("snake floor stopped");
});

app.get("/shutdown", (req, res) => {
  functions.shutdown();

  res.json("Shutdown complete");
});
