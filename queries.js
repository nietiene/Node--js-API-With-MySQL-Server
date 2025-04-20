const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

connection.connect((err) => {
    if (err) {
        throw err;
    } else {
        console.log("Connection Successfully");
    }
});

// const sql = `CREATE DATABASE \`${process.env.DB_NAME}\``;
// connection.query(sql, (err) => {
//     if (err) {
//         throw err;
//     } else {
//         console.log("Database created");
//     }
// });

// const tableSql = "CREATE TABLE user( id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(150), password VARCHAR(150))";

// connection.query(tableSql, (err) => {

//     if (err) {
//         throw err;
//     } else {
//         console.log("Table created");
//     }
// });

module.exports = connection;