const express = require("express");
const router = express.Router();
const { mysqlPool } = require("./mysqlConfig");
const promisePool = mysqlPool.promise();
const { conn, sql } = require("./sqlServerConfig");

router.get("/departments", async (req, res) => {
  try {
    // SQL Server - lấy employeeCount theo phòng ban
    const sqlPool = await conn;
    const sqlResult = await sqlPool.request().query(`
        SELECT d.DepartmentID, d.DepartmentName, COUNT(e.EmployeeID) AS employeeCount
        FROM Departments d
        JOIN Employees e ON d.DepartmentID = e.DepartmentID
        GROUP BY d.DepartmentID, d.DepartmentName
      `);

    const departmentsFromSQLServer = sqlResult.recordset;

    // MySQL - lấy budget và avgSalary theo phòng ban
    const [departmentsFromMySQL] = await promisePool.query(`
      SELECT 
        d.DepartmentID,
        SUM(s.BaseSalary + s.Bonus - s.Deductions) AS totalBudget,
        AVG(s.BaseSalary + s.Bonus - s.Deductions) AS avgSalary
      FROM 
        departments d
      JOIN 
        employees e ON d.DepartmentID = e.DepartmentID
      JOIN 
        salaries s ON e.EmployeeID = s.EmployeeID
      GROUP BY d.DepartmentID
    `);

    // Gộp dữ liệu theo DepartmentID
    const mergedData = departmentsFromSQLServer
      .map((departmentFromSQLServer, index) => {
        const match = departmentsFromMySQL.find(
          (departmentFromMySQL) =>
            departmentFromMySQL.DepartmentID ===
            departmentFromSQLServer.DepartmentID
        );
        if (!match) {
          return null;
        }
        return {
          name: departmentFromSQLServer.DepartmentName,
          employees: departmentFromSQLServer.employeeCount,
          budget: match.totalBudget || 0,
          avgSalary: match.avgSalary || 0,
        };
      })
      .filter(Boolean);

    res.json(mergedData);
  } catch (error) {
    console.error("Error fetching department overview:", error);
    res.status(500).json({ error: "Failed to fetch department overview" });
  }
});

router.get("/positions", async (req, res) => {
  try {
    // SQL Server - lấy số nhân viên theo vị trí
    const sqlPool = await conn;
    const sqlResult = await sqlPool.request().query(`
        SELECT p.PositionID, p.PositionName, COUNT(e.EmployeeID) AS employeeCount
        FROM Positions p
        JOIN Employees e ON p.PositionID = e.PositionID
        GROUP BY p.PositionID, p.PositionName
      `);

    const positionsFromSQLServer = sqlResult.recordset;

    // MySQL - lấy lương trung bình theo vị trí
    const [positionsFromMySQL] = await promisePool.query(`
      SELECT 
        p.PositionID,
        AVG(s.BaseSalary + s.Bonus - s.Deductions) AS avgSalary
      FROM 
        positions p
      JOIN 
        employees e ON p.PositionID = e.PositionID
      JOIN 
        salaries s ON e.EmployeeID = s.EmployeeID
      GROUP BY p.PositionID
    `);

    // Gộp dữ liệu theo PositionID
    const mergedPositionData = positionsFromSQLServer
      .map((positionFromSQLServer) => {
        const match = positionsFromMySQL.find(
          (positionFromMySQL) =>
            positionFromMySQL.PositionID === positionFromSQLServer.PositionID
        );
        if (!match) {
          return null;
        }
        return {
          name: positionFromSQLServer.PositionName,
          count: positionFromSQLServer.employeeCount,
          avgSalary: match.avgSalary || 0,
        };
      })
      .filter(Boolean);

    res.json(mergedPositionData);
  } catch (error) {
    console.error("Error fetching position overview:", error);
    res.status(500).json({ error: "Failed to fetch position overview" });
  }
});

router.get("/attendances", async (req, res) => {
  try {
    // SQL Server - Lấy dữ liệu chấm công theo tháng
    // const sqlPool = await conn;
    // const sqlResult = await sqlPool.request().query(`
    //   SELECT
    //     FORMAT(AttendanceMonth, 'MMM') AS Month,
    //     SUM(WorkDays) AS totalWorkDays,
    //     SUM(AbsentDays) AS totalAbsentDays,
    //     SUM(LeaveDays) AS totalLeaveDays
    //   FROM Attendance
    //   GROUP BY FORMAT(AttendanceMonth, 'MMM')
    //   ORDER BY MIN(AttendanceMonth)
    // `);

    // const sqlAttendance = sqlResult.recordset;

    // MySQL - lấy tổng số ngày làm việc theo tháng
    const [mysqlAttendance] = await promisePool.query(`
      SELECT 
        DATE_FORMAT(AttendanceMonth, '%b') AS month,
        SUM(WorkDays) AS workDays,
        SUM(AbsentDays) AS absentDays,
        SUM(LeaveDays) AS leaveDays
      FROM Attendance
      GROUP BY DATE_FORMAT(AttendanceMonth, '%b'), MONTH(AttendanceMonth)
      ORDER BY MONTH(AttendanceMonth);
    `);

    // Gộp dữ liệu theo Month
    // const mergedAttendanceData = sqlAttendance.map((item) => {
    //   const match = mysqlAttendance.find(
    //     (m) => m.Month.slice(0, 3).toLowerCase() === item.Month.toLowerCase()
    //   );
    //   return {
    //     month: item.Month,
    //     workDaysSQL: item.totalWorkDays,
    //     absentDays: item.totalAbsentDays,
    //     leaveDays: item.totalLeaveDays,
    //     workDaysMySQL: match?.totalWorkDaysMySQL || 0,
    //   };
    // });

    res.json(mysqlAttendance);
  } catch (error) {
    console.error("Error fetching attendance overview:", error);
    res.status(500).json({ error: "Failed to fetch attendance overview" });
  }
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

router.get("/dividends", async (req, res) => {
  try {
    const sqlPool = await conn;
    const result = await sqlPool.request().query(`
    SELECT 
      FORMAT(DividendDate, 'MMM') AS month,
      SUM(DividendAmount) AS amount
    FROM Dividends
    GROUP BY FORMAT(DividendDate, 'MMM'), MONTH(DividendDate)
    ORDER BY MONTH(DividendDate)
  `);
    const dividendData = result.recordset;
    res.json(dividendData);
  } catch (error) {
    console.error("Error fetching dividend records:", error);
    res.status(500).json({ error: "Failed to fetch dividend records" });
  }
});

router.get("/status", async (req, res) => {
  try {
    const sqlPool = await conn;
    const result = await sqlPool.request().query(`
      SELECT 
        Status, 
        COUNT(*) AS count
      FROM Employees
      GROUP BY Status
    `);
    const statusData = result.recordset;
    res.json(statusData);
  } catch (error) {
    console.error("Error fetching status records:", error);
    res.status(500).json({ error: "Failed to fetch status records" });
  }
});

router.get("/alerts", async (req, res) => {
  try {
    const [rows] = await promisePool.query(`
      SELECT AlertID as alertId, 
        Type as type, 
        EmployeeID as employeeId, 
        EmployeeName as employeeName, 
        Message as message, 
        Source as source, 
        CreatedAt as createdAt 
      FROM alerts ORDER BY CreatedAt DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching salary records:", error);
    res.status(500).json({ error: "Failed to fetch salary records" });
  }
});

// Create a new alert
router.post("/add-alerts", async (req, res) => {
  try {
    const { type, employeeId, employeeName, message, source } = req.body;

    if (!type || !employeeId || !employeeName || !message || !source) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const query =
      "INSERT INTO alerts (Type, EmployeeID, EmployeeName, Message, Source) VALUES (?, ?, ?, ?, ?)";

    const [result] = await promisePool.query(query, [
      type,
      employeeId,
      employeeName,
      message,
      source,
    ]);

    const [rows] = await promisePool.query(
      "SELECT AlertID as alertId, Type as type, EmployeeID as employeeId, EmployeeName as employeeName, Message as message, Source as source, CreatedAt as createdAt FROM alerts WHERE AlertID = ?",
      [result.insertId]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error("Error creating alert:", err);
    res.status(500).json({ error: "Failed to create alert" });
  }
});

// Update an existing alert
router.put("/update-alerts/:id", async (req, res) => {
  try {
    const alertId = req.params.id;
    const { type, employeeId, employeeName, message, source } = req.body;

    if (!type || !employeeId || !employeeName || !message || !source) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const query =
      "UPDATE alerts SET Type = ?, EmployeeID = ?, EmployeeName = ?, Message = ?, Source = ? WHERE AlertID = ?";

    const [result] = await promisePool.query(query, [
      type,
      employeeId,
      employeeName,
      message,
      source,
      alertId,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Alert not found" });
    }

    const [rows] = await promisePool.query(
      "SELECT AlertID as alertId, Type as type, EmployeeID as employeeId, EmployeeName as employeeName, Message as message, Source as source, CreatedAt as createdAt FROM alerts WHERE AlertID = ?",
      [alertId]
    );

    res.json(rows[0]);
  } catch (err) {
    console.error("Error updating alert:", err);
    res.status(500).json({ error: "Failed to update alert" });
  }
});

// Delete an alert
router.delete("/delete-alerts/:id", async (req, res) => {
  try {
    const alertId = req.params.id;
    const query = "DELETE FROM alerts WHERE AlertID = ?";

    const [result] = await promisePool.query(query, [alertId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Alert not found" });
    }

    res.json({ message: "Alert deleted successfully" });
  } catch (err) {
    console.error("Error deleting alert:", err);
    res.status(500).json({ error: "Failed to delete alert" });
  }
});

// router.get("/test", async (req, res) => {
//   const pool = await conn;
//   const results = await pool.request().query("SELECT * FROM Employees");
//   res.json(results);
// });

module.exports = router;
