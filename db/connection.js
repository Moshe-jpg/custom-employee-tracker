const mysql = require("mysql2");

const db = mysql.createConnection(
    {
      host: "localhost",
      user: "root",
      password: process.env.SECRET_KEY,
      database: "employee_tracker",
    },
    console.log("Connected to the employee database.")
);

module.exports = db;