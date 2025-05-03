const sql = require("mssql/msnodesqlv8");

const config = {
  connectionString:
    `Driver={SQL Server};Server=${process.env.SQL_SERVER_HOST};Database=${process.env.SQL_SERVER_DATABASE};Uid=${process.env.SQL_SERVER_USER};Pwd=${process.env.SQL_SERVER_PASSWORD};`,
};

const conn = new sql.ConnectionPool(config).connect().then((pool) => {
  return pool;
});

module.exports = {
  conn: conn,
  sql: sql,
};

