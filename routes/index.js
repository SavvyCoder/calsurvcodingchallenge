var express = require('express');
var router = express.Router();

var db = require('../queries');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/movies/year/:year', db.getAllMoviesFromYear);
router.get('/movies/genre/:genre', db.getMoviesFromGenre);

module.exports = router;
