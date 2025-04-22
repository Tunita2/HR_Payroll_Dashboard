const mysql = require("mysql2");

const mysqlPool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "0147896325",
  database: "payroll",
});

module.exports = { mysqlPool };
