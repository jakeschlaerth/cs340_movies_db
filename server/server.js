var express = require('express');
var mysql = require('../dbcon.js');
var CORS = require('cors');

var app = express();
app.set('port', 19191);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(CORS());

const getMoviesQuery = `SELECT 
                    movie_id,
                    title, 
                    release_year, 
                    CONCAT(directors.first_name, ' ', directors.last_name) AS director, 
                    CONCAT(composers.first_name, ' ', composers.last_name) AS composer, 
                    movies.director_id,
                    movies.composer_id
                    FROM movies
                    INNER JOIN directors ON movies.director_id = directors.director_id
                    INNER JOIN composers ON movies.composer_id = composers.composer_id
                    ORDER BY release_year;`;

const getDirectorsQuery = 'SELECT director_id, first_name, last_name FROM directors ORDER BY last_name;';

const getComposersQuery = 'SELECT composer_id, first_name, last_name FROM composers ORDER BY last_name;';

const getActorsQuery = 'SELECT actor_id, first_name, last_name FROM actors ORDER BY last_name;';

const getPerformancesQuery =    `SELECT 
                                CONCAT(actors.first_name, ' ', actors.last_name) AS actor,
                                movies.title AS title

                                FROM performances
                                INNER JOIN actors ON performances.actor_id=actors.actor_id
                                INNER JOIN movies ON performances.movie_id=movies.movie_id`;

const getGenreInstancesQuery = `SELECT title, name 
                            FROM genre_instances
                            INNER JOIN genres on genre_instances.genre_id = genres.genre_id
                            INNER JOIN movies on genre_instances.movie_id = movies.movie_id`;

const insertMovieQuery = `INSERT INTO movies 
                            (title, release_year, director_id, composer_id) 
                            VALUES (?, ?, ?, ?)`;

const insertDirectorQuery = `INSERT INTO directors
                                (first_name, last_name)
                                VALUES (?, ?)`;

const insertComposerQuery = `INSERT INTO composers
                                (first_name, last_name)
                                VALUES (?, ?)`;

const insertActorQuery = "INSERT INTO actors (`first_name`, `last_name`) VALUES (?, ?)";

// const makeTableQuery = `CREATE TABLE movies(
//                         id INT PRIMARY KEY AUTO_INCREMENT, 
//                         title VARCHAR(255) NOT NULL,
//                         release_year INT,
//                         director_id INT,
//                         composer_id INT);`;

const getActorsByID = 'SELECT actor_id, first_name, last_name FROM actors ORDER BY actor_id;';

const updateMoviesQuery = 'UPDATE movies SET title=?, release_year=?, director_id=?, composer_id=? WHERE movie_id=?;';
const updateDirectorsQuery = 'UPDATE directors SET first_name=?, last_name=? WHERE director_id=?;';
const updateComposersQuery = 'UPDATE composers SET first_name=?, last_name=? WHERE composer_id=?;'
const updateActorsQuery = 'UPDATE actors SET first_name=?, last_name=? WHERE actor_id=?;';

const deleteMovieQuery = `DELETE FROM movies WHERE movie_id=?;`;
const deleteDirectorQuery = `DELETE FROM directors WHERE director_id=?;`;
const deleteComposerQuery = `DELETE FROM composers WHERE composer_id=?;`;
const deleteActorQuery = `DELETE FROM actors WHERE actor_id=?;`;

const getAllData = (current_query, res) => {
    mysql.pool.query(current_query, (err, rows, fields) => {
        if (err) {
            next(err);
            return;
        }
        res.json({ rows: rows });
    });
};

// read all data
app.get('/', function (req, res, next) {
    var currentQuery;
    // movies in get req header
    if (req.headers.table_name == 'movies') {
        currentQuery = getMoviesQuery;
    }

    // directors in req header
    if (req.headers.table_name == 'directors') {
        currentQuery = getDirectorsQuery;
    }

    // composers in req header
    if (req.headers.table_name == 'composers') {
        currentQuery = getComposersQuery;
    }

    // actors in get req header
    if (req.headers.table_name == 'actors') {
        currentQuery = getActorsQuery;
    }

    // performances in get req header
    if (req.headers.table_name == 'performances') {
        currentQuery = getPerformancesQuery;
    }

    // genreInstances in get req header
    if (req.headers.table_name == 'genre_instances') {
        currentQuery = getGenreInstancesQuery;
    }

    mysql.pool.query(currentQuery, (err, rows, fields) => {
        if (err) {
            next(err);
            return;
        }
        getAllData(currentQuery, res);
    });
});

// app.get('/actors', function (req, res, next) {
//     // Select actors by ID here, easier to grab the most recent actor and update the table. Probably an easier way to do this.
//     var current_query = getActorsByID;
//     mysql.pool.query(current_query, (err, rows, fields) => {
//         if (err) {
//             next(err);
//             return;
//         }
//         getAllData(current_query, res);
//     });    
// })

// insert
app.post('/', function (req, res, next) {
    //insert movie
    if (req.body.table_name == 'movies') {
        mysql.pool.query(insertMovieQuery,
            [
                req.body.title,
                req.body.release_year,
                req.body.director_id,
                req.body.composer_id
            ],
            (err, result) => {
                if (err) {
                    next(err);
                    return;
                }
                // send all data
                getAllData(getMoviesQuery, res);
            });
    }

    // insert director
    if (req.body.table_name == 'directors') {
        mysql.pool.query(insertDirectorQuery,
            [
                req.body.first_name,
                req.body.last_name,
            ],
            (err, result) => {
                if (err) {
                    next(err);
                    return;
                }
                // send all data
                getAllData(getDirectorsQuery, res);
            });
    }

    // insert composer
    if (req.body.table_name == 'composers') {
        mysql.pool.query(insertComposerQuery,
            [
                req.body.first_name,
                req.body.last_name,
            ],
            (err, result) => {
                if (err) {
                    next(err);
                    return;
                }
                // send all data
                getAllData(getComposersQuery, res);
            });
    }

    // insert actor
    if (req.body.table_name == 'actors') {
        mysql.pool.query(insertActorQuery,
            [
                req.body.first_name,
                req.body.last_name,
            ],
            (err, result) => {
                if (err) {
                    next(err);
                    return;
                }
                // send all data
                getAllData(getActorsQuery, res);
            });
    }
});

// update
app.put('/', function (req, res, next) {
    var current_update_query;

    // update movie
    if (req.body.table_name == 'movies') {
        mysql.pool.query(
            updateMoviesQuery,
            [
                req.body.title,
                req.body.release_year,
                req.body.director_id,
                req.body.composer_id,
                req.body.movie_id
            ],
            (err, result) => {
                if (err) {
                    next(err);
                    return;
                }
                // send all data
                getAllData(getMoviesQuery, res);
            });
    }

    // update director
    if (req.body.table_name == 'directors') {
        mysql.pool.query(
            updateDirectorsQuery,
            [req.body.first_name, req.body.last_name, req.body.director_id],
            (err, result) => {
                if (err) {
                    next(err);
                    return;
                }
                // send all data
                getAllData(getDirectorsQuery, res);
            });
    }

    // update composers
    if (req.body.table_name == 'composers') {
        //  var current_query = getComposersQuery;
        mysql.pool.query(
            updateComposersQuery,
            [req.body.first_name, req.body.last_name, req.body.composer_id],
            (err, result) => {
                if (err) {
                    next(err);
                    return;
                }
                // send all data
                getAllData(getComposersQuery, res);
            });
    }

    // update actor
    if (req.body.table_name == 'actors') {
        // var current_query = getActorsQuery;
        mysql.pool.query(
            updateActorsQuery,
            [req.body.first_name, req.body.last_name, req.body.actor_id],
            (err, result) => {
                if (err) {
                    next(err);
                    return;
                }
                // send all data
                getAllData(getActorsQuery, res);
            });
    }
});

// delete
app.delete('/', function (req, res, next) {
    // console.log(req.body);
    // delete movie
    // we can freely delete movies
    if (req.body.table_name == "movies") {
        mysql.pool.query(deleteMovieQuery, [req.body.movie_id], (err, rows, fields) => {
            if (err) {
                next(err);
                return;
            }
            getAllData(getMoviesQuery, res)
        });
    }

    // delete director
    if (req.body.table_name == "directors") {
        mysql.pool.query(deleteDirectorQuery, [req.body.director_id], (err, rows, fields) => {
            if (err) {
                next(err);
                return;
            }
            getAllData(getDirectorsQuery, res)
        });
    }

    // delete composer
    if (req.body.table_name == "composers") {
        mysql.pool.query(deleteComposerQuery, [req.body.composer_id], (err, rows, fields) => {
            if (err) {
                next(err);
                return;
            }
            getAllData(getComposersQuery, res)
        });
    }

    // delete actor
    if (req.body.table_name == "actors") {
        mysql.pool.query(deleteActorQuery, [req.body.actor_id], (err, rows, fields) => {
            if (err) {
                next(err);
                return;
            }
            getAllData(getActorsQuery, res)
        });
    }

});

app.use(function (req, res) {
    res.status(404);
    res.send('404');
});

app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500);
    res.send('500');
});

app.listen(app.get('port'), function () {
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
