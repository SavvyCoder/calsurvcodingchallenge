var express = require('express');
var router = express.Router();

var db = require('../queries');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'CalSurvCodingChallenge' });
});

//Can use query strings to reduce redundancy to one or two routes
//Decided to seperate routes for better readability and seperation
router.get('/movies/year/:year', db.getAllMoviesFromYear);
router.get('/movies/genre/:genre', db.getMoviesFromGenre);
router.get('/movies/recent/top100', db.getBestFromLastFiveYears);
router.get('/movies/genre/:genre/:year/top100', db.getBest90sComedy);

module.exports = router;
