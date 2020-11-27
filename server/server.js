var express = require('express');
var mysql = require('../dbcon.js');
var CORS = require('cors');

var app = express();
app.set('port', 22222);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(CORS());

const getMoviesQuery = `SELECT 
                    title, 
                    release_year, 
                    CONCAT(directors.first_name, ' ', directors.last_name) AS director, 
                    CONCAT(composers.first_name, ' ', composers.last_name) AS composer 
                    FROM movies
                    INNER JOIN directors ON movies.director_id = directors.director_id
                    INNER JOIN composers ON movies.composer_id = composers.composer_id
                    ORDER BY release_year;`;

const insertQuery = "INSERT INTO movies (`title`, `release_year`) VALUES (?, ?)";
const insertActorQuery = "INSERT INTO actors (`first_name`, `last_name`) VALUES (?, ?)";
const updateQuery = "UPDATE movies SET title=?, release_year=? WHERE id=?";
const deleteQuery = "DELETE FROM movies WHERE id=?";
const dropTableQuery = "DROP TABLE IF EXISTS movies";
const makeTableQuery = `CREATE TABLE movies(
                        id INT PRIMARY KEY AUTO_INCREMENT, 
                        title VARCHAR(255) NOT NULL,
                        release_year INT,
                        director_id INT,
                        composer_id INT);`;

const getDirectorsQuery = 'SELECT director_id, first_name, last_name FROM directors ORDER BY last_name;';

const getComposersQuery = 'SELECT composer_id, first_name, last_name FROM composers ORDER BY last_name;';

const getActorsQuery = 'SELECT actor_id, first_name, last_name FROM actors ORDER BY last_name;';


const getAllData = (current_query, res) => {
    mysql.pool.query(current_query, (err, rows, fields) => {
        if (err) {
            next(err);
            return;
        }
        res.json({ rows: rows });
    });
};



// get all data
app.get('/', function (req, res, next) {

    // movies in get req header
    if (req.headers.table_name == 'movies') {
        var current_query = getMoviesQuery;
        console.log("req header is equal to movies")
    }

    // directors in req header
    if (req.headers.table_name == 'directors') {
        var current_query = getDirectorsQuery;
        console.log("req header is equal to directors");
    }

    // composers in req header
    if (req.headers.table_name == 'composers') {
        var current_query = getComposersQuery;
        console.log("req header is equal to composers");
    }

    // actors in get req header
    if (req.headers.table_name == 'actors') {
        var current_query = getActorsQuery;
        console.log("req header is equal to actors")
    }

    mysql.pool.query(current_query, (err, rows, fields) => {
        if (err) {
            next(err);
            return;
        }
        getAllData(current_query, res);
    });
});

app.get('/actors', function (req, res, next) {
    var current_query = getActorsQuery;
    mysql.pool.query(current_query, (err, rows, fields) => {
        if (err) {
            next(err);
            return;
        }
        getAllData(current_query, res);
    });    
})

// insert row
app.post('/add_actor', function (req, res) {
    sql = mysql.pool.query(insertActorQuery, [req.body.first_name, req.body.last_name], (err, result) => {
        console.log("started");
        if (err) {
            res.write(JSON.stringify(error));
            res.end();
        }
        else{
            console.log("start redirect");
            res.redirect(308, '/actors');
            console.log('page reloaded');
        }
    });
});

// delete row
app.delete('/', function (req, res, next) {
    var context = {};
    // http://url:19191?id=1 deletes row with id 1
    mysql.pool.query(getAllQuery, (err, rows, fields) => {
        if (err) {
            next(err);
            return;
        }
        // context.results = JSON.stringify(rows);
    });

    mysql.pool.query(deleteQuery, [req.query.id], (err, result) => {
        if (err) {
            next(err);
            return;
        }
        // send all data back
        getAllData(res);
    });
});

// update existing row (replace)
app.put('/', function (req, res, next) {
    var context = {};
    mysql.pool.query(updateQuery, [req.body.name, req.body.reps, req.body.weight, req.body.unit, req.body.date, req.body.id],
        (err, result) => {
            if (err) {
                next(err);
                return;
            }
            // send all data
            getAllData(res);
        });
});

// reset and create
app.get('/reset-table', function (req, res, next) {
    var context = {};
    mysql.pool.query(dropTableQuery, function (err) {
        mysql.pool.query(makeTableQuery, function (err) {
            context.results = "Table reset";
            res.send(context);
        })
    });
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
