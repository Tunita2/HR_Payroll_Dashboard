const express = require("express");
const router = express.Router();
const { conn: sqlConn, sql } = require("./sqlServerConfig");
const { mysqlPool } = require("../mysqlConfig");
const { verifyToken } = require("../Auth/auth-middleware");

// Helper: chọn DB theo role hoặc query param
function getDB(req) {
    // Ưu tiên query param db, sau đó đến role
    const db = req.query.db || req.user?.role || 'sqlserver';
    if (db === 'mysql' || db === 'payroll') return 'mysql';
    return 'sqlserver';
}

// GET /profile - lấy thông tin profile employee
router.get("/profile", verifyToken, async (req, res) => {
    try {
        const db = getDB(req);
        if (db === 'mysql') {
            mysqlPool.query(
                `SELECT e.EmployeeID, e.FullName, e.DateOfBirth, e.Gender, e.HireDate, e.Email, e.DepartmentID, e.PositionID, e.Status, d.DepartmentName, p.PositionName
                 FROM employees e
                 LEFT JOIN departments d ON e.DepartmentID = d.DepartmentID
                 LEFT JOIN positions p ON e.PositionID = p.PositionID
                 WHERE e.EmployeeID = ?`,
                [req.user.employeeId],
                (err, results) => {
                    if (err) return res.status(500).json({ error: "MySQL error" });
                    if (!results.length) return res.status(404).json({ error: "Employee not found" });
                    res.json(results[0]);
                }
            );
        } else {
            const pool = await sqlConn;
            const result = await pool.request()
                .input("employeeId", sql.Int, req.user.employeeId)
                .query(`SELECT e.EmployeeID, e.FullName, e.DateOfBirth, e.Gender, e.HireDate, e.Email, e.PhoneNumber, d.DepartmentName, p.PositionName, e.Status
                        FROM Employees e
                        JOIN Departments d ON e.DepartmentID = d.DepartmentID
                        JOIN Positions p ON e.PositionID = p.PositionID
                        WHERE e.EmployeeID = @employeeId`);
            if (!result.recordset.length) return res.status(404).json({ error: "Employee not found" });
            res.json(result.recordset[0]);
        }
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

// PUT /profile - cập nhật thông tin profile employee
router.put("/profile", verifyToken, async (req, res) => {
    try {
        const db = getDB(req);
        const data = req.body;
        if (db === 'mysql') {
            mysqlPool.query(
                `UPDATE employees SET FullName=?, Email=?, DepartmentID=?, PositionID=?, Status=? WHERE EmployeeID=?`,
                [data.FullName, data.Email, data.DepartmentID, data.PositionID, data.Status, req.user.employeeId],
                (err, result) => {
                    if (err) return res.status(500).json({ error: "MySQL error" });
                    res.json({ message: "Profile updated" });
                }
            );
        } else {
            const pool = await sqlConn;
            await pool.request()
                .input("employeeId", sql.Int, req.user.employeeId)
                .input("FullName", sql.NVarChar, data.FullName)
                .input("Email", sql.NVarChar, data.Email)
                .input("PhoneNumber", sql.NVarChar, data.PhoneNumber || '')
                .input("Status", sql.NVarChar, data.Status)
                .query(`UPDATE Employees SET FullName=@FullName, Email=@Email, PhoneNumber=@PhoneNumber, Status=@Status WHERE EmployeeID=@employeeId`);
            res.json({ message: "Profile updated" });
        }
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

// GET /notifications - lấy thông báo
router.get("/notifications", verifyToken, async (req, res) => {
    try {
        const db = getDB(req);
        if (db === 'mysql') {
            mysqlPool.query(
                `SELECT n.NotificationID as id, n.Type, n.Title, n.Message, n.Timestamp, n.Read
                 FROM notifications n WHERE n.EmployeeID = ? ORDER BY n.Timestamp DESC`,
                [req.user.employeeId],
                (err, results) => {
                    if (err) return res.status(500).json({ error: "MySQL error" });
                    res.json(results);
                }
            );
        } else {
            const pool = await sqlConn;
            const result = await pool.request()
                .input("employeeId", sql.Int, req.user.employeeId)
                .query(`SELECT n.DividendID as id, 'payroll' as Type, 'Lương/Thưởng' as Title, CONCAT('Bạn nhận được ', n.DividendAmount, ' vào ', FORMAT(n.DividendDate, 'dd/MM/yyyy')) as Message, n.DividendDate as Timestamp, 1 as Read
                        FROM Dividends n WHERE n.EmployeeID = @employeeId ORDER BY n.DividendDate DESC`);
            res.json(result.recordset);
        }
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

// GET /payroll - lấy lương hiện tại và lịch sử lương
router.get("/payroll", verifyToken, async (req, res) => {
    try {
        const db = getDB(req);
        if (db === 'mysql') {
            mysqlPool.query(
                `SELECT * FROM salaries WHERE EmployeeID = ? ORDER BY SalaryMonth DESC`,
                [req.user.employeeId],
                (err, results) => {
                    if (err) return res.status(500).json({ error: "MySQL error" });
                    res.json({ payrollHistory: results, currentPayroll: results[0] || null });
                }
            );
        } else {
            const pool = await sqlConn;
            const result = await pool.request()
                .input("employeeId", sql.Int, req.user.employeeId)
                .query(`SELECT DividendID as id, DividendAmount as NetSalary, DividendDate as PaymentDate, 'Paid' as Status
                        FROM Dividends WHERE EmployeeID = @employeeId ORDER BY DividendDate DESC`);
            res.json({ payrollHistory: result.recordset, currentPayroll: result.recordset[0] || null });
        }
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

// GET /leave-work-status - lấy trạng thái nghỉ phép, chấm công
router.get("/leave-work-status", verifyToken, async (req, res) => {
    try {
        const db = getDB(req);
        if (db === 'mysql') {
            // Lấy tổng hợp nghỉ phép và chấm công từ payroll
            mysqlPool.query(
                `SELECT * FROM attendance WHERE EmployeeID = ? ORDER BY AttendanceMonth DESC LIMIT 1`,
                [req.user.employeeId],
                (err, results) => {
                    if (err) return res.status(500).json({ error: "MySQL error" });
                    // Lấy tổng hợp nghỉ phép (giả lập)
                    const leaveData = {
                        annual: { total: 12, used: 5, pending: 1 },
                        sick: { total: 8, used: 2, pending: 0 },
                        personal: { total: 4, used: 1, pending: 0 },
                        unpaid: { total: 10, used: 0, pending: 0 }
                    };
                    res.json({
                        leaveData,
                        workStatus: results[0] || {},
                        attendanceHistory: results
                    });
                }
            );
        } else {
            // SQL Server chưa có bảng attendance, trả về dữ liệu mẫu
            res.json({
                leaveData: {
                    annual: { total: 12, used: 5, pending: 1 },
                    sick: { total: 8, used: 2, pending: 0 },
                    personal: { total: 4, used: 1, pending: 0 },
                    unpaid: { total: 10, used: 0, pending: 0 }
                },
                workStatus: {
                    currentMonth: { workDays: 22, presentDays: 18, lateDays: 2, absentDays: 2, attendanceRate: 81.8, onTimeRate: 90.0 },
                    currentWeek: { workHours: 40, completedHours: 32, progress: 80 }
                },
                attendanceHistory: []
            });
        }
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
