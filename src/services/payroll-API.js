// const express = require("express");
// const router = express.Router();
// const pool = require("./database");

// const promisePool = pool.promise();

// // Lấy danh sách attendance
// router.get("/attendance", async (req, res) => {
//   try {
//     const [rows] = await promisePool.query(`
//             SELECT
//                 a.EmployeeID, e.FullName, d.DepartmentName,
//                 p.PositionName, a.WorkDays, a.AbsentDays, a.LeaveDays,
//                 a.AttendanceMonth, a.CreatedAt, e.Status
//             FROM attendance a
//             JOIN employees e ON a.EmployeeID = e.EmployeeID
//             JOIN departments d ON e.DepartmentID = d.DepartmentID
//             JOIN positions p ON e.PositionID = p.PositionID
//             ORDER BY a.AttendanceMonth DESC, e.FullName ASC`);
//     res.json(rows);
//   } catch (error) {
//     console.error("Error fetching attendance records: ", error);
//     res.status(500).json({ error: "Failed to fetching attendance records" });
//   }
// });

// // Lấy danh sách salaries
// router.get("/salaries", async (req, res) => {
//   try {
//     const [rows] = await promisePool.query(`
//             SELECT
//                 s.EmployeeID, e.FullName, d.DepartmentName,
//                 p.PositionName, s.SalaryMonth, s.BaseSalary, s.Bonus,
//                 s.Deductions, s.NetSalary, s.CreatedAt, e.Status
//             FROM salaries s
//             JOIN employees e ON s.EmployeeID = e.EmployeeID
//             JOIN departments d ON e.DepartmentID = d.DepartmentID
//             JOIN positions p ON e.PositionID = p.PositionID
//             ORDER BY s.SalaryMonth DESC, e.FullName ASC
//             `);
//     res.json(rows);
//   } catch (error) {
//     console.error("Error fetching salaries records: ", error);
//     res.status(500).json({ error: "Failed to fetching salaries records" });
//   }
// });

// module.exports = router;
