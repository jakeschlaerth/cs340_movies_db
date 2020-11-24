var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'classmysql.engr.oregonstate.edu',
    user: 'cs340_dunnand',
    password: '7853',
    database: 'cs340_dunnand'
});

module.exports.pool = pool;
