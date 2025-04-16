const sql = require("mssql/msnodesqlv8");

const config = {
  connectionString:
    "Driver={SQL Server};Server=TUAN\\SQL2022;Database=HUMAN;Uid=tuan;Pwd=123456;",
};

const conn = new sql.ConnectionPool(config).connect().then((pool) => {
  return pool;
});

module.exports = {
  conn: conn,
  sql: sql,
};
