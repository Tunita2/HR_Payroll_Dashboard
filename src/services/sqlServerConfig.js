const sql = require("mssql/msnodesqlv8");

const config = {
  connectionString:
    "Driver={SQL Server};Server=DESKTOP-BE98DFG\\HRPAYROLLDB;Database=HUMAN;Uid=sa;Pwd=0147896325;"
};

const conn = new sql.ConnectionPool(config).connect().then((pool) => {
  return pool;
});

module.exports = {
  conn: conn,
  sql: sql,
};
