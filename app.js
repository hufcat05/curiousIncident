var express = require('express');

var app = express();

app.listen(3000, () =>{
  console.log("server started");
});

app.get("/status", (req, res) => {
  res.json("Server Running");
});