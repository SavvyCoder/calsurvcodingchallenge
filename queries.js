var promise = require('bluebird');

var options = {
  // Initialization Options
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
const cn = {
    host: 'db.calsurv.org',
    port: 5432,
    database: 'coding_challenge',
    schema: 'userland',
    ssl: true,
    user: 'nicolas_cage',
    password: 'The Declaration of Independence'
};
var db = pgp(cn);

// add query functions
function getAllMoviesFromYear(req, res, next) {
    var year = parseInt(req.params.year);
    db.any('SELECT * FROM titles WHERE startYear = $1', year)
    .then( data => {
        res.status(200)
        .json({
            status: 'success',
            data: data,
            message: "Retrieved movies at specified year"
        });
    })
    .catch(err => {
        return next(err); 
    });
}

function getMoviesFromGenre(req, res, next) {
    var genre = req.params.genre ? req.params.genre.charAt(0).toUpperCase() : ""; 
    var year = parseInt(req.query.year);
    var sort = req.query.sort;
    var stringQuery = "SELECT * FROM titles";
    stringQuery += req.query.sort ? " JOIN ratings ON titles.tconst = ratings.tconst" : "";
    stringQuery += req.query.year ? " WHERE genres LIKE \'%$1#%\' AND startYear = $2" : " WHERE genres LIKE \'%$1#%\'";
    stringQuery += req.query.sort ? " ORDER BY averageRating DESC" : "";
    
    db.any(stringQuery, [genre, year])
    .then( data => {
        res.status(200)
        .json({
            status: 'success',
            data: data,
            message: "Retrieved movies at specified genre filtered via query"
        });
    })
    .catch(err => {
        return next(err); 
    });
}

function getBestFromLastFiveYears(req, res, next) {
    var five_years_ago = (new Date()).getFullYear() - 5; 
    db.any('SELECT * FROM titles JOIN ratings ON titles.tconst = ratings.tconst WHERE startYear >= $1 AND numVotes > 200 ORDER BY averageRating DESC LIMIT 100', five_years_ago)
    .then( data => {
        res.status(200)
        .json({
            status: 'success',
            data: data,
            message: "Retrieved (top 100) best titles from last 5 years"
        });
    })
    .catch(err => {
        return next(err); 
    });
}

function getBest90sComedy(req, res, next) {
    var decade = parseInt(req.params.year); 
    var decade_end = decade + 10;
    var genre = req.params.genre.charAt(0).toUpperCase();
    db.any('SELECT * FROM titles JOIN ratings ON titles.tconst = ratings.tconst WHERE startYear >= $1 AND startYear <= $2 AND genres LIKE \'%$3#%\' AND numVotes > 200 ORDER BY averageRating DESC LIMIT 100', [decade, decade_end, genre])
    .then( data => {
        res.status(200)
        .json({
            status: 'success',
            data: data,
            message: "Retrieved (top 100) best titles from specified decade"
        });
    })
    .catch(err => {
        return next(err); 
    });
}

module.exports = {
  getAllMoviesFromYear: getAllMoviesFromYear,
  getMoviesFromGenre: getMoviesFromGenre,
  getBestFromLastFiveYears: getBestFromLastFiveYears,
  getBest90sComedy: getBest90sComedy
};