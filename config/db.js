const mysql = require("mysql2");

const nativePool = mysql.createPool({
    connectionLimit: 10,
    host: "localhost",
    user: "root",
    password: "admin",
    database: "proyectoeys"
});

const pool = nativePool.promise();

module.exports = pool;