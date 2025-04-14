const express = require("express");
const router = express.Router();
const { mysqlPool } = require("./mysqlConfig");
const promisePool = mysqlPool.promise();
const { conn, sql } = require("./sqlServerConfig");

router.get("/test", async (req, res) => {
  const pool = await conn;
  const results = await pool.request().query("SELECT * FROM Employees");
  res.json(results);
});

router.get("/salaries", async (req, res) => {
  try {
    const [rows] = await promisePool.query(`
      SELECT 
        DATE_FORMAT(SalaryMonth, '%b') AS month,
        SUM(BaseSalary) AS baseSalary,
        SUM(Bonus) AS bonus,
        SUM(Deductions) AS deductions,
        SUM(NetSalary) AS netSalary
      FROM salaries
      GROUP BY DATE_FORMAT(SalaryMonth, '%b'), MONTH(SalaryMonth)
      ORDER BY MONTH(SalaryMonth);
    `);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching salary records:", error);
    res.status(500).json({ error: "Failed to fetch salary records" });
  }
});

module.exports = router;
