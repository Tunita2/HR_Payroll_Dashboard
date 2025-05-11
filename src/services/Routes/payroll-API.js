const express = require("express");
const router = express.Router();
const promisePool = require("../config/mysql");
const { verifyToken } = require("../Auth/auth-middleware");

// Middleware kiểm tra quyền payroll hoặc admin
function verifyPayroll(req, res, next) {
  if (req.user?.role !== "payroll" && req.user?.role !== "admin") {
    return res.status(403).json({ error: "Access denied: Payroll staff or Admin only" });
  }
  next();
}

// Lấy danh sách attendance
router.get('/attendance', verifyToken, verifyPayroll, async (req, res) => {
  try {
    const { year, month } = req.query;

    let query = `
      SELECT
          a.AttendanceID, a.EmployeeID, e.FullName, d.DepartmentName,
          p.PositionName, a.WorkDays, a.AbsentDays, a.LeaveDays,
          a.AttendanceMonth, a.CreatedAt, e.Status
      FROM attendance a
      JOIN employees e ON a.EmployeeID = e.EmployeeID
      JOIN departments d ON e.DepartmentID = d.DepartmentID
      JOIN positions p ON e.PositionID = p.PositionID
    `;

    // Add filtering by year and month if provided
    if (year && month) {
      query += ` WHERE YEAR(a.AttendanceMonth) = ? AND MONTH(a.AttendanceMonth) = ?`;
      const [rows] = await promisePool.query(query, [year, month]);

      if (rows.length === 0) {
        return res.status(404).json({ message: 'No attendance records found' });
      }

      return res.json(rows);
    } else {
      // If no year/month specified, return all records
      query += ` ORDER BY a.AttendanceMonth DESC, e.FullName ASC`;
      const [rows] = await promisePool.query(query);

      if (rows.length === 0) {
        return res.status(404).json({ message: 'No attendance records found' });
      }

      return res.json(rows);
    }
  } catch (error) {
    console.error("Error fetching attendance records: ", error);
    res.status(500).json({ error: "Failed to fetch attendance records" });
  }
});

// Lấy danh sách salary
router.get('/salaries', verifyToken, verifyPayroll, async (req, res) => {
  try {
    const { year, month } = req.query;

    let query = `
      SELECT
          s.SalaryID, s.EmployeeID, e.FullName, d.DepartmentName,
          p.PositionName, s.SalaryMonth, s.BaseSalary, s.Bonus,
          s.Deductions, s.NetSalary, s.CreatedAt, e.Status
      FROM salaries s
      JOIN employees e ON s.EmployeeID = e.EmployeeID
      JOIN departments d ON e.DepartmentID = d.DepartmentID
      JOIN positions p ON e.PositionID = p.PositionID
    `;

    // Add filtering by year and month if provided
    if (year && month) {
      query += ` WHERE YEAR(s.SalaryMonth) = ? AND MONTH(s.SalaryMonth) = ?`;
      const [rows] = await promisePool.query(query, [year, month]);

      if (rows.length === 0) {
        return res.status(404).json({ message: 'No salary records found' });
      }

      return res.json(rows);
    } else {
      // If no year/month specified, return all records
      query += ` ORDER BY s.SalaryMonth DESC, e.FullName ASC`;
      const [rows] = await promisePool.query(query);

      if (rows.length === 0) {
        return res.status(404).json({ message: 'No salary records found' });
      }

      return res.json(rows);
    }
  } catch (error) {
    console.error("Error fetching salary records: ", error);
    res.status(500).json({ error: "Failed to fetch salary record" });
  }
})
// thêm bản ghi cho điểm danh
router.post('/salaries/adding', verifyToken, verifyPayroll, async (req, res) => {
  try {
    const {
      EmployeeID,
      SalaryMonth,
      BaseSalary,
      Bonus,
      Deductions,
      NetSalary
    } = req.body;

    // Validate required fields
    if (!EmployeeID || !SalaryMonth || isNaN(BaseSalary) || isNaN(Bonus) || isNaN(Deductions) || BaseSalary < 0 || Bonus < 0 || Deductions < 0) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if employee exists
    const [employee] = await promisePool.query('SELECT * FROM employees WHERE EmployeeID = ?', [EmployeeID]);
    if (employee.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    // Check if there's already a salary record for this employee in this month
    const [existingSalary] = await promisePool.query(
      'SELECT * FROM salaries WHERE EmployeeID = ? AND DATE_FORMAT(SalaryMonth, "%Y-%m") = DATE_FORMAT(?, "%Y-%m")',
      [EmployeeID, SalaryMonth]
    );

    if (existingSalary.length > 0) {
      return res.status(409).json({ error: 'A salary record already exists for this employee in the selected month' });
    }

    // Insert new salary record
    const [result] = await promisePool.query(
      'INSERT INTO salaries (EmployeeID, SalaryMonth, BaseSalary, Bonus, Deductions, NetSalary, CreatedAt) VALUES (?, ?, ?, ?, ?, ?, NOW())',
      [EmployeeID, SalaryMonth, BaseSalary, Bonus, Deductions, NetSalary]
    );

    // Return success response
    res.status(201).json({
      message: 'Salary record added successfully',
      SalaryID: result.insertId
    });
  } catch (error) {
    console.error('Error adding salary record:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Dựa vào id nhân viên để cập nhật bản ghi
router.put('/salaries/:id', verifyToken, verifyPayroll, async (req, res) => {
  try {
    const salaryId = req.params.id;
    const { BaseSalary, Bonus, Deductions } = req.body;

    const base = parseFloat(BaseSalary);
    const bonus = parseFloat(Bonus);
    const deductions = parseFloat(Deductions);

    if (isNaN(base) || isNaN(bonus) || isNaN(deductions) || base < 0 || bonus < 0 || deductions < 0) {
      return res.status(400).json({ message: 'Invalid salary data' });
    }

    // Tính toán NetSalary
    const netSalary = base + bonus - deductions;

    const [result] = await promisePool.query(
      `UPDATE salaries
      SET BaseSalary = ?, Bonus = ?, Deductions = ?, NetSalary = ?
      WHERE SalaryID = ?`,
      [base, bonus, deductions, netSalary, salaryId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'ID not found' });
    }

    // Lấy dữ liệu đã cập nhật để trả về
    const [updatedSalary] = await promisePool.query(
      'SELECT * FROM salaries WHERE SalaryID = ?',
      [salaryId]
    );

    res.json({
      message: 'Completed updating!',
      data: updatedSalary[0]
    });
  } catch (error) {
    console.error("Error updating salary records:", error.response?.data || error.message);
    res.status(500).json({ error: "Error to fetch salary records" });
  }
});

// router.post('/attendance/adding', verifyToken, verifyPayroll, async (req, res) => {
//   try {
//     const {
//       EmployeeID,
//       WorkDays,
//       AbsentDays,
//       LeaveDays,
//       AttendanceMonth,
//       CreatedAt
//     } = req.body;

//     // Validate required fields
//     if (!EmployeeID || !AttendanceMonth || isNaN(WorkDays) || isNaN(AbsentDays) || isNaN(LeaveDays) || WorkDays < 0 || AbsentDays < 0 || LeaveDays < 0) {
//       return res.status(400).json({ error: 'All fields are required' });
//     }

//     // Check if employee exists
//     const [employee] = await promisePool.query('SELECT * FROM employees WHERE EmployeeID = ?', [EmployeeID]);
//     if (employee.length === 0) {
//       return res.status(404).json({ error: 'Employee not found' });
//     }

//     // Check if there's already a salary record for this employee in this month
//     const [existingSalary] = await promisePool.query(
//       'SELECT * FROM salaries WHERE EmployeeID = ? AND DATE_FORMAT(SalaryMonth, "%Y-%m") = DATE_FORMAT(?, "%Y-%m")',
//       [EmployeeID, SalaryMonth]
//     );

//     if (existingSalary.length > 0) {
//       return res.status(409).json({ error: 'A salary record already exists for this employee in the selected month' });
//     }

//     // Insert new salary record
//     const [result] = await promisePool.query(
//       'INSERT INTO salaries (EmployeeID, SalaryMonth, BaseSalary, Bonus, Deductions, NetSalary, CreatedAt) VALUES (?, ?, ?, ?, ?, ?, NOW())',
//       [EmployeeID, SalaryMonth, BaseSalary, Bonus, Deductions, NetSalary]
//     );

//     // Return success response
//     res.status(201).json({
//       message: 'Salary record added successfully',
//       SalaryID: result.insertId
//     });
//   } catch (error) {
//     console.error('Error adding salary record:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });


// // Dựa vào id nhân viên để cập nhật bản ghi
// router.put('/attendance/:id', verifyToken, verifyPayroll, async (req, res) => {
//   try {
//     const salaryId = req.params.id;
//     const { BaseSalary, Bonus, Deductions } = req.body;

//     const base = parseFloat(BaseSalary);
//     const bonus = parseFloat(Bonus);
//     const deductions = parseFloat(Deductions);

//     if (isNaN(base) || isNaN(bonus) || isNaN(deductions) || base < 0 || bonus < 0 || deductions < 0) {
//       return res.status(400).json({ message: 'Invalid salary data' });
//     }

//     // Tính toán NetSalary
//     const netSalary = base + bonus - deductions;

//     const [result] = await promisePool.query(
//       `UPDATE salaries
//       SET BaseSalary = ?, Bonus = ?, Deductions = ?, NetSalary = ?
//       WHERE SalaryID = ?`,
//       [base, bonus, deductions, netSalary, salaryId]
//     );

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: 'ID not found' });
//     }

//     // Lấy dữ liệu đã cập nhật để trả về
//     const [updatedSalary] = await promisePool.query(
//       'SELECT * FROM salaries WHERE SalaryID = ?',
//       [salaryId]
//     );

//     res.json({
//       message: 'Completed updating!',
//       data: updatedSalary[0]
//     });
//   } catch (error) {
//     console.error("Error updating salary records:", error.response?.data || error.message);
//     res.status(500).json({ error: "Error to fetch salary records" });
//   }
// });

router.get('/employees', verifyToken, verifyPayroll, async (req, res) => {
  try {
    const [rows] = await promisePool.query(`
      SELECT e.*, d.DepartmentName, p.PositionName
      FROM employees e
      LEFT JOIN departments d ON e.DepartmentID = d.DepartmentID
      LEFT JOIN positions p ON e.PositionID = p.PositionID
    `);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching salary records: ", error);
    res.status(500).json({ error: "Failed to fetch salary record" });
  }
});

// API GET - Lấy thông tin nhân viên theo ID
router.get('/employees/:id', verifyToken, verifyPayroll, async (req, res) => {
  const [rows] = await promisePool.query(
    'SELECT * FROM employees WHERE EmployeeID = ?',
    [req.params.id]
  );

  if (rows.length === 0) {
    return res.status(404).json({ message: 'Employee not found' });
  }

  res.json(rows[0]);
});

// API GET - Lấy danh sách phòng ban
router.get('/departments', verifyToken, verifyPayroll, async (req, res) => {
  const [rows] = await promisePool.query('SELECT * FROM departments');
  res.json(rows);
});

// API GET - Lấy danh sách chức vụ
router.get('/positions', verifyToken, verifyPayroll, async (req, res) => {
  const [rows] = await promisePool.query('SELECT * FROM positions');
  res.json(rows);
});

// API GET - Lấy lịch sử lương của nhân viên
router.get('/salaries/employee/:id', verifyToken, verifyPayroll, async (req, res) => {
  const [rows] = await promisePool.query(
    'SELECT * FROM salaries WHERE EmployeeID = ? ORDER BY SalaryMonth DESC',
    [req.params.id]
  );
  res.json(rows);
});

// API GET - Lấy lịch sử lương của nhân viên theo năm
router.get('/salaries/employee/:id/year/:year', verifyToken, verifyPayroll, async (req, res) => {
  const [rows] = await promisePool.query(
    'SELECT * FROM salaries WHERE EmployeeID = ? AND YEAR(SalaryMonth) = ? ORDER BY SalaryMonth DESC',
    [req.params.id, req.params.year]
  );
  res.json(rows);
});

// API GET - Lấy dữ liệu chấm công của nhân viên
router.get('/attendance/employee/:id', verifyToken, verifyPayroll, async (req, res) => {
  const [rows] = await promisePool.query(
    'SELECT * FROM attendance WHERE EmployeeID = ? ORDER BY AttendanceMonth DESC',
    [req.params.id]
  );
  res.json(rows);
});

// API GET - Lấy dữ liệu chấm công của nhân viên theo năm
router.get('/attendance/employee/:id/year/:year', verifyToken, verifyPayroll, async (req, res) => {
  const [rows] = await promisePool.query(
    'SELECT * FROM attendance WHERE EmployeeID = ? AND YEAR(AttendanceMonth) = ? ORDER BY AttendanceMonth DESC',
    [req.params.id, req.params.year]
  );
  res.json(rows);
});



module.exports = router;