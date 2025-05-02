const express = require("express");
const router = express.Router();
const { conn: sqlConn, sql } = require("../config/mssql");
const mysqlPool = require("../config/mysql");
const { verifyToken } = require("../Auth/auth-middleware");

function getDB(req) {
    // Ưu tiên query param db, sau đó đến role
    const db = req.query.db || req.user?.role || 'sqlserver';
    if (db === 'mysql' || db === 'payroll') return 'mysql';
    return 'sqlserver';
}

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

router.put("/profile", verifyToken, async (req, res) => {
    try {
        const db = getDB(req);
        const data = req.body;

        console.log("Received data for update:", data);
        
        let dateOfBirth = null;
        let hasValidDate = false;

        if (data.DateOfBirth) {
            try {
                if (typeof data.DateOfBirth === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(data.DateOfBirth)) {
                    // Sử dụng chuỗi ngày tháng trực tiếp
                    dateOfBirth = data.DateOfBirth;
                    hasValidDate = true;
                    console.log("Using date string directly:", dateOfBirth);
                } else {
                    const date = new Date(data.DateOfBirth);
                    if (!isNaN(date.getTime())) {
                        // Format lại thành YYYY-MM-DD
                        const year = date.getFullYear();
                        const month = String(date.getMonth() + 1).padStart(2, '0');
                        const day = String(date.getDate()).padStart(2, '0');
                        dateOfBirth = `${year}-${month}-${day}`;
                        hasValidDate = true;
                        console.log("Formatted date string:", dateOfBirth);
                    } else {
                        console.log("Invalid date detected, setting to null");
                        dateOfBirth = null;
                        hasValidDate = false;
                    }
                }
            } catch (err) {
                console.error("Error parsing date:", err);
                dateOfBirth = null;
                hasValidDate = false;
            }
        }

        const pool = await sqlConn;

        let query = `UPDATE Employees SET
                    FullName=@FullName,
                    Gender=@Gender,
                    Email=@Email,
                    PhoneNumber=@PhoneNumber,
                    Status=@Status`;

        if (hasValidDate && dateOfBirth) {
            // Sử dụng CONVERT để chuyển đổi chuỗi thành DATE trong SQL
            query += `, DateOfBirth=CONVERT(DATE, @DateOfBirth)`;
        }

        query += ` WHERE EmployeeID=@employeeId`;

        const request = pool.request()
            .input("employeeId", sql.Int, req.user.employeeId)
            .input("FullName", sql.NVarChar, data.FullName)
            .input("Gender", sql.NVarChar, data.Gender)
            .input("Email", sql.NVarChar, data.Email)
            .input("PhoneNumber", sql.NVarChar, data.PhoneNumber || '')
            .input("Status", sql.NVarChar, data.Status);

        // Thêm tham số DateOfBirth nếu có giá trị
        if (hasValidDate && dateOfBirth) {
            // Sử dụng VarChar thay vì Date để tránh lỗi chuyển đổi
            request.input("DateOfBirth", sql.VarChar, dateOfBirth);
            console.log("Adding DateOfBirth parameter:", dateOfBirth);
        } else {
            console.log("DateOfBirth not included in query. hasValidDate:", hasValidDate, "dateOfBirth:", dateOfBirth);
        }

        console.log("Executing SQL query:", query);

        try {
            await request.query(query);
            console.log("Profile updated successfully");
        } catch (error) {
            console.error("SQL Error:", error);
            throw error;
        }

        res.json({ message: "Profile updated" });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/payroll", verifyToken, async (req, res) => {
    try {
        console.log(`Fetching payroll data for employee ID: ${req.user.employeeId}`);

        try {
            const [checkResult] = await mysqlPool.query('SELECT 1 as test');
            console.log('MySQL connection is working:', checkResult);
        } catch (connErr) {
            console.error('MySQL connection error:', connErr);
            return res.status(500).json({
                error: "Database connection error",
                details: "Could not connect to the payroll database"
            });
        }

        try {
            console.log('Truy vấn dữ liệu lương từ bảng salaries');

            // Truy vấn dữ liệu lương
            const [results] = await mysqlPool.query(
                `SELECT * FROM salaries WHERE EmployeeID = ? ORDER BY SalaryMonth DESC`,
                [req.user.employeeId]
            );

            console.log(`Found ${results.length} payroll records`);

            let attendanceData = [];
            try {
                const [attendanceResults] = await mysqlPool.query(
                    `SELECT AttendanceID, EmployeeID, WorkDays, AbsentDays, LeaveDays, AttendanceMonth, CreatedAt
                     FROM attendance
                     WHERE EmployeeID = ?
                     ORDER BY AttendanceMonth DESC`,
                    [req.user.employeeId]
                );

                if (attendanceResults.length > 0) {
                    attendanceData = attendanceResults;
                    console.log(`Found ${attendanceData.length} attendance records for employee ID: ${req.user.employeeId}`);
                }
            } catch (attendanceErr) {
                console.error('Error fetching attendance data:', attendanceErr);
            }

            let dividendData = [];
            try {
                const pool = await sqlConn;
                const dividendResult = await pool.request()
                    .input("employeeId", sql.Int, req.user.employeeId)
                    .query(`SELECT DividendID, EmployeeID, DividendAmount, DividendDate, CreatedAt
                            FROM Dividends
                            WHERE EmployeeID = @employeeId
                            ORDER BY DividendDate DESC`);

                if (dividendResult.recordset.length > 0) {
                    dividendData = dividendResult.recordset;
                    console.log(`Found ${dividendData.length} dividend records for employee ID: ${req.user.employeeId}`);
                }
            } catch (dividendErr) {
                console.error('Error fetching dividend data:', dividendErr);
            }

            res.json({
                payrollHistory: results || [],
                currentPayroll: results && results.length > 0 ? results[0] : null,
                dividendData: dividendData || [],
                attendanceData: attendanceData || []
            });
        } catch (queryErr) {
            console.error('MySQL query error:', queryErr);
            return res.status(500).json({
                error: "Database query error",
                details: queryErr.message
            });
        }
    } catch (error) {
        console.error('Unexpected error in payroll endpoint:', error);
        res.status(500).json({
            error: "Internal server error",
            details: error.message
        });
    }
});

module.exports = router;
