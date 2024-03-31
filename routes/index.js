var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'The Tech Booth!', serverMessage: 'Curious Incident Contoller Service is running' });
});

module.exports = router;
