var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'classmysql.engr.oregonstate.edu',
    user: 'cs340_schlaerj',
    password: '0307',
    database: 'cs340_schlaerj'
});

module.exports.pool = pool;
