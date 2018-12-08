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
    var genre = req.params.genre; 
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

module.exports = {
  getAllMoviesFromYear: getAllMoviesFromYear,
  getMoviesFromGenre: getMoviesFromGenre
};