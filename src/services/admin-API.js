const express = require("express");
const router = express.Router();
const { mysqlPool } = require("./mysqlConfig");
const promisePool = mysqlPool.promise();
const { conn, sql } = require("./sqlServerConfig");
const nodemailer = require("nodemailer");

const fetchSQLServerData = async (query) => {
  const sqlPool = await conn;
  const result = await sqlPool.request().query(query);
  return result.recordset;
};

const fetchMySQLData = async (query, params = []) => {
  const [rows] = await promisePool.query(query, params);
  return rows;
};

const mergeData = (primaryData, secondaryData, key, mapFn) => {
  return primaryData
    .map((primaryItem) => {
      const match = secondaryData.find(
        (secondaryItem) => secondaryItem[key] === primaryItem[key]
      );
      return match ? mapFn(primaryItem, match) : null;
    })
    .filter(Boolean);
};

router.get("/departments", async (req, res) => {
  try {
    const sqlQuery = `
      SELECT d.DepartmentID, d.DepartmentName, COUNT(e.EmployeeID) AS employeeCount
      FROM Departments d
      JOIN Employees e ON d.DepartmentID = e.DepartmentID
      GROUP BY d.DepartmentID, d.DepartmentName
    `;
    const mysqlQuery = `
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
    `;

    const departmentsFromSQLServer = await fetchSQLServerData(sqlQuery);
    const departmentsFromMySQL = await fetchMySQLData(mysqlQuery);

    const mergedData = mergeData(
      departmentsFromSQLServer,
      departmentsFromMySQL,
      "DepartmentID",
      (sqlItem, mysqlItem) => ({
        name: sqlItem.DepartmentName,
        employees: sqlItem.employeeCount,
        budget: mysqlItem.totalBudget || 0,
        avgSalary: mysqlItem.avgSalary || 0,
      })
    );

    res.json(mergedData);
  } catch (error) {
    console.error("Error fetching department overview:", error);
    res.status(500).json({ error: "Failed to fetch department overview" });
  }
});

router.get("/positions", async (req, res) => {
  try {
    const sqlQuery = `
      SELECT p.PositionID, p.PositionName, COUNT(e.EmployeeID) AS employeeCount
      FROM Positions p
      JOIN Employees e ON p.PositionID = e.PositionID
      GROUP BY p.PositionID, p.PositionName
    `;
    const mysqlQuery = `
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
    `;

    const positionsFromSQLServer = await fetchSQLServerData(sqlQuery);
    const positionsFromMySQL = await fetchMySQLData(mysqlQuery);

    const mergedData = mergeData(
      positionsFromSQLServer,
      positionsFromMySQL,
      "PositionID",
      (sqlItem, mysqlItem) => ({
        name: sqlItem.PositionName,
        count: sqlItem.employeeCount,
        avgSalary: mysqlItem.avgSalary || 0,
      })
    );

    res.json(mergedData);
  } catch (error) {
    console.error("Error fetching position overview:", error);
    res.status(500).json({ error: "Failed to fetch position overview" });
  }
});

router.get("/attendances", async (req, res) => {
  try {
    const mysqlQuery = `
      SELECT 
        DATE_FORMAT(AttendanceMonth, '%b') AS month,
        SUM(WorkDays) AS workDays,
        SUM(AbsentDays) AS absentDays,
        SUM(LeaveDays) AS leaveDays
      FROM Attendance
      GROUP BY DATE_FORMAT(AttendanceMonth, '%b'), MONTH(AttendanceMonth)
      ORDER BY MONTH(AttendanceMonth);
    `;

    const mysqlAttendance = await fetchMySQLData(mysqlQuery);

    res.json(mysqlAttendance);
  } catch (error) {
    console.error("Error fetching attendance overview:", error);
    res.status(500).json({ error: "Failed to fetch attendance overview" });
  }
});

router.get("/salaries", async (req, res) => {
  try {
    const mysqlQuery = `
      SELECT 
        DATE_FORMAT(SalaryMonth, '%b') AS month,
        SUM(BaseSalary) AS baseSalary,
        SUM(Bonus) AS bonus,
        SUM(Deductions) AS deductions,
        SUM(NetSalary) AS netSalary
      FROM salaries
      GROUP BY DATE_FORMAT(SalaryMonth, '%b'), MONTH(SalaryMonth)
      ORDER BY MONTH(SalaryMonth);
    `;

    const rows = await fetchMySQLData(mysqlQuery);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching salary records:", error);
    res.status(500).json({ error: "Failed to fetch salary records" });
  }
});

router.get("/dividends", async (req, res) => {
  try {
    const sqlQuery = `
      SELECT 
        FORMAT(DividendDate, 'MMM') AS month,
        SUM(DividendAmount) AS amount
      FROM Dividends
      GROUP BY FORMAT(DividendDate, 'MMM'), MONTH(DividendDate)
      ORDER BY MONTH(DividendDate)
    `;

    const dividendData = await fetchSQLServerData(sqlQuery);
    res.json(dividendData);
  } catch (error) {
    console.error("Error fetching dividend records:", error);
    res.status(500).json({ error: "Failed to fetch dividend records" });
  }
});

router.get("/status", async (req, res) => {
  try {
    const sqlQuery = `
      SELECT 
        Status, 
        COUNT(*) AS count
      FROM Employees
      GROUP BY Status
    `;

    const statusData = await fetchSQLServerData(sqlQuery);
    res.json(statusData);
  } catch (error) {
    console.error("Error fetching status records:", error);
    res.status(500).json({ error: "Failed to fetch status records" });
  }
});

router.get("/notifications/employees", async (req, res) => {
  try {
    const sqlQuery = `
      SELECT 
        EmployeeID AS id,
        Fullname AS name,
        HireDate AS startDate,
        Email AS email
      FROM Employees
    `;

    const statusData = await fetchSQLServerData(sqlQuery);
    res.json(statusData);
  } catch (error) {
    console.error("Error fetching status records:", error);
    res.status(500).json({ error: "Failed to fetch status records" });
  }
});

router.get("/notifications/payrolls", async (req, res) => {
  try {
    const mysqlQuery = `
      SELECT 
        s1.SalaryID AS id,
        e.EmployeeID AS employeeId,
        e.FullName AS employeeName,
        DATE_FORMAT(s1.SalaryMonth, '%M %Y') AS period,
        s1.NetSalary AS amount,
        IFNULL(s2.NetSalary, 0) AS previousAmount,
        s1.NetSalary - IFNULL(s2.NetSalary, 0) AS discrepancy
      FROM employees e
      JOIN salaries s1 ON e.EmployeeID = s1.EmployeeID
      LEFT JOIN salaries s2 
        ON e.EmployeeID = s2.EmployeeID
        AND DATE_FORMAT(s2.SalaryMonth, '%Y-%m') = DATE_FORMAT(DATE_SUB(s1.SalaryMonth, INTERVAL 1 MONTH), '%Y-%m')
      ORDER BY s1.SalaryMonth DESC, e.EmployeeID;
    `;

    const rows = await fetchMySQLData(mysqlQuery);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching salary records:", error);
    res.status(500).json({ error: "Failed to fetch salary records" });
  }
});

router.get("/alerts", async (req, res) => {
  try {
    const mysqlQuery = `
      SELECT 
        e.EmployeeID AS id,
        e.FullName AS employeeName,
        d.DepartmentName AS department,
        12 AS allowedDays,
        IFNULL(a.LeaveDays, 0) AS usedDays,
        IFNULL(a.LeaveDays, 0) - 12 AS daysExceeded,
        DATE_FORMAT(NOW(), '%m/%d/%Y') AS date
      FROM employees e
      JOIN departments d ON e.DepartmentID = d.DepartmentID
      JOIN attendance a ON e.EmployeeID = a.EmployeeID
      WHERE IFNULL(a.LeaveDays, 0) > 12
      ORDER BY daysExceeded DESC
    `;

    const rows = await fetchMySQLData(mysqlQuery);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching salary records:", error);
    res.status(500).json({ error: "Failed to fetch salary records" });
  }
});

const sendEmail = async ({ email, subject, html }) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    auth: {
      user: "hieugrth13@gmail.com",
      pass: "czdy dqmr gikv stzr",
    },
  });

  const message = {
    from: "ADMIN",
    to: email,
    subject,
    html,
  };

  return transporter.sendMail(message);
};

router.post("/notifications/send-payroll", async (req, res) => {
  try {
    const { email, subject, html } = req.body;

    if (!email || !subject || !html) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const result = await sendEmail({ email, subject, html });
    res.status(200).json({ message: "Email sent successfully", result });
  } catch (err) {
    console.error("Error sending email:", err);
    res.status(500).json({ error: "Failed to send email" });
  }
});

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

// Mock data for alerts
const alertsData = [
  {
    id: 1,
    employeeName: "John Smith",
    employeeId: "EMP001",
    department: "IT",
    allowedDays: 12,
    usedDays: 15,
    daysExceeded: 3,
    date: "04/15/2025",
  },
  {
    id: 2,
    employeeName: "Sarah Johnson",
    employeeId: "EMP002",
    department: "HR",
    allowedDays: 12,
    usedDays: 18,
    daysExceeded: 6,
    date: "04/16/2025",
  },
  {
    id: 3,
    employeeName: "Michael Lee",
    employeeId: "EMP003",
    department: "Finance",
    allowedDays: 15,
    usedDays: 16,
    daysExceeded: 1,
    date: "04/14/2025",
  },
  {
    id: 4,
    employeeName: "Emily Davis",
    employeeId: "EMP004",
    department: "Marketing",
    allowedDays: 12,
    usedDays: 17,
    daysExceeded: 5,
    date: "04/17/2025",
  },
  {
    id: 5,
    employeeName: "Robert Wilson",
    employeeId: "EMP005",
    department: "Sales",
    allowedDays: 12,
    usedDays: 16,
    daysExceeded: 4,
    date: "04/16/2025",
  },
];

// Get all alerts
router.get("/alerts", (req, res) => {
  try {
    res.json(alertsData);
  } catch (error) {
    console.error("Error fetching alerts:", error);
    res.status(500).json({ error: "Failed to fetch alerts" });
  }
});

// Delete an alert
router.delete("/alerts/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const index = alertsData.findIndex((alert) => alert.id === id);

    if (index === -1) {
      return res.status(404).json({ error: "Alert not found" });
    }

    alertsData.splice(index, 1);
    res.json({ message: "Alert dismissed successfully" });
  } catch (error) {
    console.error("Error dismissing alert:", error);
    res.status(500).json({ error: "Failed to dismiss alert" });
  }
});

module.exports = router;
