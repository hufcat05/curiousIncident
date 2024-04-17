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

app.get("/shutdown", (req, res) => {
  functions.shutdown();

  res.json("Shutdown complete");
});
