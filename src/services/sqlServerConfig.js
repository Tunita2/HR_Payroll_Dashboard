const sql = require("mssql/msnodesqlv8");

const config = {
  connectionString:
    "Driver={SQL Server};Server=AsusCuaHieu\\SQLSERVER;Database=HUMAN;Uid=sa;Pwd=1234567;",
};

const conn = new sql.ConnectionPool(config).connect().then((pool) => {
  return pool;
});

module.exports = {
  conn: conn,
  sql: sql,
};
