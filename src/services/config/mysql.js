const mysql = require("mysql2/promise");
require("dotenv").config();

// Log MySQL configuration for debugging
console.log('MySQL Configuration:');
console.log('Host:', process.env.MYSQL_HOST || 'localhost');
console.log('Database:', process.env.MYSQL_DATABASE || 'payroll');
console.log('User:', process.env.MYSQL_USER || 'root');

// Create connection pool
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'payroll',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test the connection
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('MySQL Connection established successfully!');
    connection.release();
  } catch (err) {
    console.error('MySQL Connection Error:', err);
    if (err.code === 'ECONNREFUSED') {
      console.error('MySQL connection refused. Make sure MySQL server is running.');
    }
  }
})();

module.exports = pool;
