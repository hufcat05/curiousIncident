var express = require('express');
const NeoPixel = require('./NeoPixel');
const PixelMap = require('./PixelMap');
const PixelFunctions = require('./PixelFunctions');
var app = express();

app.use(express.json());

var pixelMap = new PixelMap();

app.listen(3000, () =>{
  console.log("server started");
});

app.post("/setSection", (req, res) => {
  console.log(req.body);
  const section = req.body.section;
  const color = req.body.color;
  var functions = new PixelFunctions();
  var map = pixelMap.getPixelMap();
  functions.lightSection(map[section[0]][section[1]][section[2]], color);
  res.json("Server Running");
});
