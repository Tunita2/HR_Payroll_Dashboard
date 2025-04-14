const sql = require("mssql/msnodesqlv8");

const config = {
  connectionString:
    "Driver={SQL Server};Server=DESKTOP-R84OL9S\\SQL_SERVER;Database=HUMAN;Uid=sa;Pwd=123456;",
};

const conn = new sql.ConnectionPool(config).connect().then((pool) => {
  return pool;
});

module.exports = {
  conn: conn,
  sql: sql,
};
