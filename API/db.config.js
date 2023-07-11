const mysql = require('mysql');
const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'pojet-api',
    password : 'motdepasse',
    database : 'db'
});

connection.connect(function(error){
    if(error) throw error; 
    console.log('database connection valid');
});
module.exports = connection;



