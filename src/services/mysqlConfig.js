const mysql = require("mysql2");

const mysqlPool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "123456",
  database: "payroll",
  connectionLimit: "10",
});

module.exports = { mysqlPool };
