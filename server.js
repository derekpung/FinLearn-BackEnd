// open another terminal and execute "npm run devStart" at the directory containing server.js
const mysql = require("mysql");
const dotenv = require("dotenv").config();

const db = mysql.createPool({
    host: `${process.env.DBHOST}`,
    port: process.env.DBPORT,
    user: `${process.env.DBUSER}`,
    password: `${process.env.DBPASSWD}`,
    database: `${process.env.DBNAME}`,
}); 

module.exports = {
  db,
};



