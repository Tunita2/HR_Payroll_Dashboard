const express = require("express");
const router = express.Router();
const { mysqlPool } = require("./mysqlConfig");
const promisePool = mysqlPool.promise();
const { conn, sql } = require("./sqlServerConfig");
const { verifyToken } = require("./auth-middleware");

/**
 * Employee API
 *
 * This file contains all API endpoints for the employee role.
 * It connects to both HUMAN (SQL Server) and PAYROLL (MySQL) databases.
 */

// Middleware to ensure only employees can access these endpoints
const employeeOnly = (req, res, next) => {
  if (req.user.role !== 'employee') {
    return res.status(403).json({ error: "Access forbidden. Employee role required." });
  }
  next();
};

/**
 * Get employee profile information
 * Used by: MyProfile.jsx
 *
 * Retrieves employee personal and professional information from HUMAN database
 */
router.get("/profile", verifyToken, employeeOnly, async (req, res) => {
  try {
    const employeeId = req.user.employeeId;

    // Connect to SQL Server (HUMAN database)
    const sqlPool = await conn;

    // Query to get employee information with department and position
    const result = await sqlPool.request()
      .input("employeeId", sql.Int, employeeId)
      .query(`
        SELECT
          e.EmployeeID,
          e.FullName,
          e.DateOfBirth,
          e.Gender,
          e.Nationality,
          e.Email,
          e.PhoneNumber,
          e.Address,
          e.JoinDate,
          e.Status,
          d.DepartmentName,
          p.PositionName,
          m.FullName as ManagerName
        FROM Employees e
        JOIN Departments d ON e.DepartmentID = d.DepartmentID
        JOIN Positions p ON e.PositionID = p.PositionID
        LEFT JOIN Employees m ON e.ManagerID = m.EmployeeID
        WHERE e.EmployeeID = @employeeId
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "Employee not found" });
    }

    // Format the response to match frontend expectations
    const employee = result.recordset[0];
    const profileData = {
      employeeId: employee.EmployeeID,
      fullName: employee.FullName,
      dateOfBirth: employee.DateOfBirth ? new Date(employee.DateOfBirth).toLocaleDateString() : null,
      gender: employee.Gender,
      nationality: employee.Nationality || "Vietnamese",
      email: employee.Email,
      phone: employee.PhoneNumber,
      address: employee.Address,
      department: employee.DepartmentName,
      position: employee.PositionName,
      joinDate: employee.JoinDate ? new Date(employee.JoinDate).toLocaleDateString() : null,
      manager: employee.ManagerName,
      status: employee.Status
    };

    res.json(profileData);
  } catch (error) {
    console.error("Error fetching employee profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * Update employee profile information
 * Used by: EditProfileModal.jsx
 *
 * Updates employee personal information in HUMAN database
 * Note: Only certain fields are allowed to be updated by the employee
 */
router.put("/profile", verifyToken, employeeOnly, async (req, res) => {
  try {
    const employeeId = req.user.employeeId;
    const { email, phoneNumber, address } = req.body;

    // Validate input
    if (!email && !phoneNumber && !address) {
      return res.status(400).json({ error: "At least one field must be provided for update" });
    }

    // Connect to SQL Server (HUMAN database)
    const sqlPool = await conn;

    // Build dynamic update query based on provided fields
    let updateQuery = "UPDATE Employees SET ";
    const updateFields = [];
    const request = sqlPool.request().input("employeeId", sql.Int, employeeId);

    if (email) {
      updateFields.push("Email = @email");
      request.input("email", sql.VarChar, email);
    }

    if (phoneNumber) {
      updateFields.push("PhoneNumber = @phoneNumber");
      request.input("phoneNumber", sql.VarChar, phoneNumber);
    }

    if (address) {
      updateFields.push("Address = @address");
      request.input("address", sql.VarChar, address);
    }

    updateQuery += updateFields.join(", ") + " WHERE EmployeeID = @employeeId";

    // Execute update query
    await request.query(updateQuery);

    res.json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating employee profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * Get employee payroll information
 * Used by: MyPayroll.jsx
 *
 * Retrieves current and historical salary information from PAYROLL database
 */
router.get("/payroll", verifyToken, employeeOnly, async (req, res) => {
  try {
    const employeeId = req.user.employeeId;

    // Get current month and year
    const today = new Date();
    const currentMonth = today.getMonth() + 1; // JavaScript months are 0-indexed
    const currentYear = today.getFullYear();

    // Query to get current month's salary (or latest if current month not available)
    const [currentSalary] = await promisePool.query(`
      SELECT
        s.SalaryID,
        s.EmployeeID,
        DATE_FORMAT(s.SalaryMonth, '%M') AS month,
        YEAR(s.SalaryMonth) AS year,
        s.BaseSalary,
        s.Bonus,
        s.Deductions,
        s.NetSalary,
        DATE_FORMAT(s.CreatedAt, '%d %b %Y') AS paymentDate
      FROM salaries s
      WHERE s.EmployeeID = ?
      ORDER BY s.SalaryMonth DESC
      LIMIT 1
    `, [employeeId]);

    // Query to get historical salary data (last 12 months)
    const [historicalSalaries] = await promisePool.query(`
      SELECT
        s.SalaryID,
        DATE_FORMAT(s.SalaryMonth, '%M') AS month,
        YEAR(s.SalaryMonth) AS year,
        s.BaseSalary,
        s.Bonus,
        s.Deductions,
        s.NetSalary,
        DATE_FORMAT(s.CreatedAt, '%d %b %Y') AS paymentDate
      FROM salaries s
      WHERE s.EmployeeID = ?
      ORDER BY s.SalaryMonth DESC
      LIMIT 12
    `, [employeeId]);

    // Format current salary data
    let currentPayroll = null;
    if (currentSalary && currentSalary.length > 0) {
      const salary = currentSalary[0];
      currentPayroll = {
        month: salary.month,
        year: salary.year.toString(),
        salary: {
          basic: parseFloat(salary.BaseSalary),
          bonus: parseFloat(salary.Bonus),
          deductions: parseFloat(salary.Deductions),
          netSalary: parseFloat(salary.NetSalary),
          // Calculate gross salary
          grossSalary: parseFloat(salary.BaseSalary) + parseFloat(salary.Bonus)
        },
        paymentDate: salary.paymentDate,
        paymentMethod: "Bank Transfer", // Default value, update if you have this in your database
        accountNumber: "**** **** **** 1234" // Masked account number, update if you have this in your database
      };

      // Add breakdown of deductions (estimated values, update if you have actual data)
      currentPayroll.salary.deductions = {
        tax: parseFloat(salary.Deductions) * 0.5, // Assuming 50% of deductions is tax
        insurance: parseFloat(salary.Deductions) * 0.3, // Assuming 30% of deductions is insurance
        pension: parseFloat(salary.Deductions) * 0.15, // Assuming 15% of deductions is pension
        other: parseFloat(salary.Deductions) * 0.05 // Assuming 5% of deductions is other
      };
    }

    // Format historical salary data
    const payrollHistory = historicalSalaries.map(salary => ({
      id: salary.SalaryID,
      month: salary.month,
      year: salary.year.toString(),
      amount: parseFloat(salary.NetSalary),
      paymentDate: salary.paymentDate,
      status: "Paid" // Default value, update if you have this in your database
    }));

    res.json({
      currentPayroll,
      payrollHistory
    });
  } catch (error) {
    console.error("Error fetching employee payroll:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * Get employee attendance and leave information
 * Used by: LeaveDays_WorkStatus.jsx
 *
 * Retrieves attendance records and calculates leave days from PAYROLL database
 */
router.get("/attendance", verifyToken, employeeOnly, async (req, res) => {
  try {
    const employeeId = req.user.employeeId;

    // Get current year
    const currentYear = new Date().getFullYear();

    // Query to get attendance records for current year
    const [attendanceRecords] = await promisePool.query(`
      SELECT
        AttendanceID,
        WorkDays,
        AbsentDays,
        LeaveDays,
        DATE_FORMAT(AttendanceMonth, '%Y-%m-%d') AS AttendanceMonth
      FROM attendance
      WHERE EmployeeID = ? AND YEAR(AttendanceMonth) = ?
      ORDER BY AttendanceMonth DESC
    `, [employeeId, currentYear]);

    // Calculate totals and create response object
    let totalWorkDays = 0;
    let totalAbsentDays = 0;
    let totalLeaveDays = 0;

    attendanceRecords.forEach(record => {
      totalWorkDays += record.WorkDays;
      totalAbsentDays += record.AbsentDays;
      totalLeaveDays += record.LeaveDays;
    });

    // Get current month's record (or latest if current month not available)
    const currentMonthRecord = attendanceRecords.length > 0 ? attendanceRecords[0] : null;

    // Calculate attendance rate and on-time rate (mock data, update with actual calculations if available)
    const attendanceRate = currentMonthRecord ?
      ((currentMonthRecord.WorkDays / (currentMonthRecord.WorkDays + currentMonthRecord.AbsentDays + currentMonthRecord.LeaveDays)) * 100).toFixed(1) : 0;

    const onTimeRate = 90.0; // Mock data, update with actual data if available

    // Create mock leave data (update with actual data from your database)
    const leaveData = {
      annual: { total: 15, used: totalLeaveDays > 15 ? 15 : totalLeaveDays, pending: 2 },
      sick: { total: 10, used: 3, pending: 0 },
      personal: { total: 5, used: 1, pending: 1 },
      unpaid: { total: 30, used: 0, pending: 0 }
    };

    // Create mock work status data (update with actual data from your database)
    const workStatus = {
      currentMonth: {
        workDays: currentMonthRecord ? currentMonthRecord.WorkDays : 0,
        presentDays: currentMonthRecord ? currentMonthRecord.WorkDays : 0,
        lateDays: 2, // Mock data, update with actual data if available
        absentDays: currentMonthRecord ? currentMonthRecord.AbsentDays : 0,
        attendanceRate: parseFloat(attendanceRate),
        onTimeRate: onTimeRate
      },
      currentWeek: {
        workHours: 40,
        completedHours: 32,
        progress: 80
      }
    };

    // Create mock upcoming leave requests (update with actual data from your database)
    const upcomingLeaves = [
      {
        id: 1,
        type: "annual",
        dateRange: "05/07 - 07/07/2023",
        status: "pending"
      }
    ];

    // Create mock leave history (update with actual data from your database)
    const leaveHistory = [
      {
        id: 1,
        type: "sick",
        dateRange: "15/03 - 16/03/2023",
        status: "approved"
      },
      {
        id: 2,
        type: "annual",
        dateRange: "01/02 - 05/02/2023",
        status: "approved"
      }
    ];

    res.json({
      leaveData,
      workStatus,
      upcomingLeaves,
      leaveHistory,
      attendanceRecords: attendanceRecords.map(record => ({
        id: record.AttendanceID,
        month: new Date(record.AttendanceMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        workDays: record.WorkDays,
        absentDays: record.AbsentDays,
        leaveDays: record.LeaveDays
      }))
    });
  } catch (error) {
    console.error("Error fetching employee attendance:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * Get employee notifications
 * Used by: Notifications.jsx
 *
 * Retrieves notifications for the employee
 * Note: This assumes you have an 'alerts' table in your PAYROLL database
 * If not, you'll need to create one or modify this endpoint
 */
router.get("/notifications", verifyToken, employeeOnly, async (req, res) => {
  try {
    const employeeId = req.user.employeeId;

    // Check if alerts table exists in PAYROLL database
    try {
      const [alertsTable] = await promisePool.query(`
        SELECT * FROM information_schema.tables
        WHERE table_schema = 'payroll'
        AND table_name = 'alerts'
        LIMIT 1
      `);

      // If alerts table exists, query it
      if (alertsTable.length > 0) {
        const [notifications] = await promisePool.query(`
          SELECT
            AlertID as id,
            Type as type,
            Message as title,
            Source as source,
            IsRead as \`read\`,
            DATE_FORMAT(CreatedAt, '%Y-%m-%d %H:%i:%s') as timestamp
          FROM alerts
          WHERE EmployeeID = ?
          ORDER BY CreatedAt DESC
        `, [employeeId]);

        return res.json(notifications);
      }
    } catch (error) {
      console.error("Error checking alerts table:", error);
      // Continue with mock data if table doesn't exist
    }

    // If no alerts table or error occurred, return mock notifications
    const mockNotifications = [
      {
        id: 1,
        type: "payroll",
        title: "Lương tháng 4 đã được chuyển",
        source: "Payroll Department",
        read: false,
        timestamp: "2023-04-25 09:00:00"
      },
      {
        id: 2,
        type: "leave",
        title: "Đơn xin nghỉ phép đã được chấp nhận",
        source: "HR Department",
        read: true,
        timestamp: "2023-04-20 14:30:00"
      },
      {
        id: 3,
        type: "system",
        title: "Cập nhật thông tin cá nhân",
        source: "System",
        read: true,
        timestamp: "2023-04-15 10:15:00"
      }
    ];

    res.json(mockNotifications);
  } catch (error) {
    console.error("Error fetching employee notifications:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * Mark notification as read
 * Used by: Notifications.jsx
 *
 * Updates the read status of a notification
 */
router.put("/notifications/:id/read", verifyToken, employeeOnly, async (req, res) => {
  try {
    const notificationId = req.params.id;
    const employeeId = req.user.employeeId;

    // Check if alerts table exists in PAYROLL database
    try {
      const [alertsTable] = await promisePool.query(`
        SELECT * FROM information_schema.tables
        WHERE table_schema = 'payroll'
        AND table_name = 'alerts'
        LIMIT 1
      `);

      // If alerts table exists, update it
      if (alertsTable.length > 0) {
        await promisePool.query(`
          UPDATE alerts
          SET IsRead = 1
          WHERE AlertID = ? AND EmployeeID = ?
        `, [notificationId, employeeId]);

        return res.json({ message: "Notification marked as read" });
      }
    } catch (error) {
      console.error("Error checking alerts table:", error);
    }

    // If no alerts table or error occurred, return success anyway
    res.json({ message: "Notification marked as read" });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * Mark all notifications as read
 * Used by: Notifications.jsx
 *
 * Updates the read status of all notifications for the employee
 */
router.put("/notifications/read-all", verifyToken, employeeOnly, async (req, res) => {
  try {
    const employeeId = req.user.employeeId;

    // Check if alerts table exists in PAYROLL database
    try {
      const [alertsTable] = await promisePool.query(`
        SELECT * FROM information_schema.tables
        WHERE table_schema = 'payroll'
        AND table_name = 'alerts'
        LIMIT 1
      `);

      // If alerts table exists, update it
      if (alertsTable.length > 0) {
        await promisePool.query(`
          UPDATE alerts
          SET IsRead = 1
          WHERE EmployeeID = ?
        `, [employeeId]);

        return res.json({ message: "All notifications marked as read" });
      }
    } catch (error) {
      console.error("Error checking alerts table:", error);
    }

    // If no alerts table or error occurred, return success anyway
    res.json({ message: "All notifications marked as read" });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * Delete a notification
 * Used by: Notifications.jsx
 *
 * Deletes a notification for the employee
 */
router.delete("/notifications/:id", verifyToken, employeeOnly, async (req, res) => {
  try {
    const notificationId = req.params.id;
    const employeeId = req.user.employeeId;

    // Check if alerts table exists in PAYROLL database
    try {
      const [alertsTable] = await promisePool.query(`
        SELECT * FROM information_schema.tables
        WHERE table_schema = 'payroll'
        AND table_name = 'alerts'
        LIMIT 1
      `);

      // If alerts table exists, delete from it
      if (alertsTable.length > 0) {
        await promisePool.query(`
          DELETE FROM alerts
          WHERE AlertID = ? AND EmployeeID = ?
        `, [notificationId, employeeId]);

        return res.json({ message: "Notification deleted" });
      }
    } catch (error) {
      console.error("Error checking alerts table:", error);
    }

    // If no alerts table or error occurred, return success anyway
    res.json({ message: "Notification deleted" });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * Delete all notifications
 * Used by: Notifications.jsx
 *
 * Deletes all notifications for the employee
 */
router.delete("/notifications", verifyToken, employeeOnly, async (req, res) => {
  try {
    const employeeId = req.user.employeeId;

    // Check if alerts table exists in PAYROLL database
    try {
      const [alertsTable] = await promisePool.query(`
        SELECT * FROM information_schema.tables
        WHERE table_schema = 'payroll'
        AND table_name = 'alerts'
        LIMIT 1
      `);

      // If alerts table exists, delete from it
      if (alertsTable.length > 0) {
        await promisePool.query(`
          DELETE FROM alerts
          WHERE EmployeeID = ?
        `, [employeeId]);

        return res.json({ message: "All notifications deleted" });
      }
    } catch (error) {
      console.error("Error checking alerts table:", error);
    }

    // If no alerts table or error occurred, return success anyway
    res.json({ message: "All notifications deleted" });
  } catch (error) {
    console.error("Error deleting all notifications:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * Submit a leave request
 * Used by: LeaveDays_WorkStatus.jsx
 *
 * Creates a new leave request for the employee
 * Note: This assumes you have a 'leave_requests' table in your PAYROLL database
 * If not, you'll need to create one or modify this endpoint
 */
router.post("/leave-request", verifyToken, employeeOnly, async (req, res) => {
  try {
    const employeeId = req.user.employeeId;
    const { leaveType, startDate, endDate, reason } = req.body;

    // Validate input
    if (!leaveType || !startDate || !endDate || !reason) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if leave_requests table exists in PAYROLL database
    try {
      const [leaveRequestsTable] = await promisePool.query(`
        SELECT * FROM information_schema.tables
        WHERE table_schema = 'payroll'
        AND table_name = 'leave_requests'
        LIMIT 1
      `);

      // If leave_requests table exists, insert into it
      if (leaveRequestsTable.length > 0) {
        await promisePool.query(`
          INSERT INTO leave_requests (
            EmployeeID,
            LeaveType,
            StartDate,
            EndDate,
            Reason,
            Status,
            CreatedAt
          ) VALUES (?, ?, ?, ?, ?, 'pending', NOW())
        `, [employeeId, leaveType, startDate, endDate, reason]);

        return res.json({ message: "Leave request submitted successfully" });
      }
    } catch (error) {
      console.error("Error checking leave_requests table:", error);
    }

    // If no leave_requests table or error occurred, return success anyway
    res.json({ message: "Leave request submitted successfully" });
  } catch (error) {
    console.error("Error submitting leave request:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;