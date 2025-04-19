const express = require("express");
const router = express.Router();
// Sử dụng mock MySQL config thay vì kết nối thực
// const { mysqlPool } = require("./mysqlConfig");
// const promisePool = mysqlPool.promise();
const { mysqlPool } = require("./mockMysqlConfig");
const promisePool = mysqlPool.promise();
const { conn, sql } = require("./mockSqlServerConfig");

router.get("/profile/:id", async (req, res) => {
  try {
    const employeeId = req.params.id;
    const sqlPool = await conn;
    const sqlResult = await sqlPool.request()
      .input('employeeId', sql.Int, employeeId)
      .query(`
        SELECT
          e.EmployeeID,
          e.FullName,
          e.DateOfBirth,
          e.Gender,
          e.PhoneNumber,
          e.Email,
          e.DepartmentID,
          d.DepartmentName,
          e.PositionID,
          p.PositionName,
          e.HireDate,
          e.Status,
          e.CreatedAt,
          e.UpdatedAt
        FROM
          Employees e
        JOIN
          Departments d ON e.DepartmentID = d.DepartmentID
        JOIN
          Positions p ON e.PositionID = p.PositionID
        WHERE
          e.EmployeeID = @employeeId
      `);

    if (sqlResult.recordset.length === 0) {
      return res.status(404).json({ error: "Employee not found" });
    }

    const employeeData = sqlResult.recordset[0];
    const profile = {
      employeeId: employeeData.EmployeeID,
      fullName: employeeData.FullName,
      dateOfBirth: employeeData.DateOfBirth,
      gender: employeeData.Gender,
      phoneNumber: employeeData.PhoneNumber,
      email: employeeData.Email,
      department: employeeData.DepartmentName,
      departmentId: employeeData.DepartmentID,
      position: employeeData.PositionName,
      positionId: employeeData.PositionID,
      joinDate: employeeData.HireDate,
      status: employeeData.Status,
      createdAt: employeeData.CreatedAt,
      updatedAt: employeeData.UpdatedAt
    };

    res.json(profile);
  } catch (error) {
    console.error("Error fetching employee profile:", error);
    res.status(500).json({ error: "Failed to fetch employee profile" });
  }
});

router.put("/profile/:id", async (req, res) => {
  try {
    const employeeId = req.params.id;
    const {
      fullName,
      dateOfBirth,
      gender,
      phoneNumber,
      email,
      departmentId,
      positionId
    } = req.body;

    const sqlPool = await conn;
    const updateResult = await sqlPool.request()
      .input('employeeId', sql.Int, employeeId)
      .input('fullName', sql.NVarChar, fullName)
      .input('dateOfBirth', sql.Date, dateOfBirth)
      .input('gender', sql.NVarChar, gender)
      .input('phoneNumber', sql.NVarChar, phoneNumber)
      .input('email', sql.NVarChar, email)
      .input('departmentId', sql.Int, departmentId)
      .input('positionId', sql.Int, positionId)
      .input('updatedAt', sql.DateTime, new Date())
      .query(`
        UPDATE Employees
        SET
          FullName = @fullName,
          DateOfBirth = @dateOfBirth,
          Gender = @gender,
          PhoneNumber = @phoneNumber,
          Email = @email,
          DepartmentID = @departmentId,
          PositionID = @positionId,
          UpdatedAt = @updatedAt
        WHERE
          EmployeeID = @employeeId
      `);

    if (updateResult.rowsAffected[0] === 0) {
      return res.status(404).json({ error: "Employee not found" });
    }

    const sqlResult = await sqlPool.request()
      .input('employeeId', sql.Int, employeeId)
      .query(`
        SELECT
          e.EmployeeID,
          e.FullName,
          e.DateOfBirth,
          e.Gender,
          e.PhoneNumber,
          e.Email,
          e.DepartmentID,
          d.DepartmentName,
          e.PositionID,
          p.PositionName,
          e.HireDate,
          e.Status,
          e.CreatedAt,
          e.UpdatedAt
        FROM
          Employees e
        JOIN
          Departments d ON e.DepartmentID = d.DepartmentID
        JOIN
          Positions p ON e.PositionID = p.PositionID
        WHERE
          e.EmployeeID = @employeeId
      `);

    const employeeData = sqlResult.recordset[0];
    const profile = {
      employeeId: employeeData.EmployeeID,
      fullName: employeeData.FullName,
      dateOfBirth: employeeData.DateOfBirth,
      gender: employeeData.Gender,
      phoneNumber: employeeData.PhoneNumber,
      email: employeeData.Email,
      department: employeeData.DepartmentName,
      departmentId: employeeData.DepartmentID,
      position: employeeData.PositionName,
      positionId: employeeData.PositionID,
      joinDate: employeeData.HireDate,
      status: employeeData.Status,
      createdAt: employeeData.CreatedAt,
      updatedAt: employeeData.UpdatedAt
    };

    res.json(profile);
  } catch (error) {
    console.error("Error updating employee profile:", error);
    res.status(500).json({ error: "Failed to update employee profile" });
  }
});

router.get("/payroll/:id", async (req, res) => {
  try {
    const employeeId = req.params.id;
    const [payrollData] = await promisePool.query(`
      SELECT
        s.EmployeeID,
        s.SalaryMonth,
        s.BaseSalary,
        s.Bonus,
        s.Deductions,
        s.NetSalary,
        s.CreatedAt
      FROM
        salaries s
      WHERE
        s.EmployeeID = ?
      ORDER BY
        s.SalaryMonth DESC
      LIMIT 1
    `, [employeeId]);

    if (payrollData.length === 0) {
      return res.status(404).json({ error: "Payroll data not found" });
    }
    const sqlPool = await conn;
    const sqlResult = await sqlPool.request()
      .input('employeeId', sql.Int, employeeId)
      .query(`
        SELECT
          e.FullName,
          d.DepartmentName,
          p.PositionName
        FROM
          Employees e
        JOIN
          Departments d ON e.DepartmentID = d.DepartmentID
        JOIN
          Positions p ON e.PositionID = p.PositionID
        WHERE
          e.EmployeeID = @employeeId
      `);

    if (sqlResult.recordset.length === 0) {
      return res.status(404).json({ error: "Employee not found" });
    }

    const employeeData = sqlResult.recordset[0];

    const payroll = {
      employeeId: parseInt(payrollData[0].EmployeeID),
      fullName: employeeData.FullName,
      department: employeeData.DepartmentName,
      position: employeeData.PositionName,
      month: new Date(payrollData[0].SalaryMonth).toLocaleString('default', { month: 'long' }),
      year: new Date(payrollData[0].SalaryMonth).getFullYear().toString(),
      salary: {
        basic: parseFloat(payrollData[0].BaseSalary),
        bonus: parseFloat(payrollData[0].Bonus),
        deductions: parseFloat(payrollData[0].Deductions),
        netSalary: parseFloat(payrollData[0].NetSalary)
      },
      paymentDate: new Date(payrollData[0].CreatedAt).toLocaleDateString(),
      paymentMethod: "Bank Transfer"
    };
    res.json(payroll);
  } catch (error) {
    console.error("Error fetching employee payroll:", error);
    res.status(500).json({ error: "Failed to fetch employee payroll" });
  }
});

router.get("/payroll/:id/history", async (req, res) => {
  try {
    const employeeId = req.params.id;
    const [payrollHistory] = await promisePool.query(`
      SELECT
        s.EmployeeID,
        s.SalaryMonth,
        s.NetSalary,
        s.CreatedAt
      FROM
        salaries s
      WHERE
        s.EmployeeID = ?
      ORDER BY
        s.SalaryMonth DESC
      LIMIT 12
    `, [employeeId]);

    if (payrollHistory.length === 0) {
      return res.status(404).json({ error: "Payroll history not found" });
    }
    const history = payrollHistory.map((record, index) => ({
      id: index + 1,
      month: new Date(record.SalaryMonth).toLocaleString('default', { month: 'long' }),
      year: new Date(record.SalaryMonth).getFullYear().toString(),
      netSalary: parseFloat(record.NetSalary),
      paymentDate: new Date(record.CreatedAt).toLocaleDateString(),
      status: 'Paid'
    }));

    res.json(history);
  } catch (error) {
    console.error("Error fetching employee payroll history:", error);
    res.status(500).json({ error: "Failed to fetch employee payroll history" });
  }
});

router.get("/attendance/:id", async (req, res) => {
  try {
    const employeeId = req.params.id;
    const [currentMonthAttendance] = await promisePool.query(`
      SELECT
        a.EmployeeID,
        a.WorkDays,
        a.AbsentDays,
        a.LeaveDays,
        a.AttendanceMonth
      FROM
        attendance a
      WHERE
        a.EmployeeID = ?
        AND MONTH(a.AttendanceMonth) = MONTH(CURRENT_DATE())
        AND YEAR(a.AttendanceMonth) = YEAR(CURRENT_DATE())
    `, [employeeId]);
    let currentMonth = {
      workDays: 0,
      presentDays: 0,
      lateDays: 0,
      absentDays: 0,
      attendanceRate: 0,
      onTimeRate: 0
    };

    if (currentMonthAttendance.length > 0) {
      const record = currentMonthAttendance[0];
      const workDays = parseInt(record.WorkDays);
      const absentDays = parseInt(record.AbsentDays);
      const leaveDays = parseInt(record.LeaveDays);
      const presentDays = workDays - absentDays - leaveDays;
      const lateDays = Math.floor(presentDays * 0.1);

      currentMonth = {
        workDays: workDays,
        presentDays: presentDays,
        lateDays: lateDays,
        absentDays: absentDays,
        attendanceRate: ((presentDays / workDays) * 100).toFixed(1),
        onTimeRate: (((presentDays - lateDays) / presentDays) * 100).toFixed(1)
      };
    }

    const currentWeek = {
      workHours: 40,
      completedHours: Math.floor(40 * (currentMonth.attendanceRate / 100)),
      progress: Math.floor(currentMonth.attendanceRate)
    };

    const workStatus = {
      currentMonth,
      currentWeek
    };

    res.json(workStatus);
  } catch (error) {
    console.error("Error fetching employee attendance:", error);
    res.status(500).json({ error: "Failed to fetch employee attendance" });
  }
});

router.get("/leave/:id", async (req, res) => {
  try {
    const employeeId = req.params.id;
    const leaveData = {
      annual: { total: 15, used: 7, pending: 2 },
      sick: { total: 10, used: 3, pending: 0 },
      personal: { total: 5, used: 1, pending: 1 },
      unpaid: { total: 30, used: 0, pending: 0 }
    };
    const upcomingLeave = [
      {
        id: 1,
        type: 'annual',
        startDate: '2023-07-05',
        endDate: '2023-07-07',
        status: 'pending',
        reason: 'Family vacation'
      },
      {
        id: 2,
        type: 'sick',
        startDate: '2023-06-15',
        endDate: '2023-06-15',
        status: 'approved',
        reason: 'Doctor appointment'
      }
    ];

    res.json({ leaveData, upcomingLeave });
  } catch (error) {
    console.error("Error fetching employee leave data:", error);
    res.status(500).json({ error: "Failed to fetch employee leave data" });
  }
});



module.exports = router;
