const express = require("express");
const router = express.Router();
const promisePool = require("../config/mysql");

// Lấy danh sách attendance
router.get('/attendance',  async (req, res) => {
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
router.get('/salaries',  async (req, res) => {
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
});

router.put('/salaries/:id',  async (req, res) => {
  try {
    const salaryId = req.params.id;
    const { BaseSalary, Bonus, Deductions } = req.body;

    if (typeof BaseSalary !== 'number' || typeof Bonus !== 'number' || typeof Deductions !== 'number') {
      return res.status(400).json({ message: 'Invalid salary data' });
    }

    // Tính toán NetSalary
    const netSalary = parseFloat(BaseSalary) + parseFloat(Bonus) - parseFloat(Deductions);

    // Thực hiện cập nhật trong database
    const [result] = await promisePool.query(
      `UPDATE salaries 
       SET BaseSalary = ?, Bonus = ?, Deductions = ?, NetSalary = ? 
       WHERE SalaryID = ?`,
      [BaseSalary, Bonus, Deductions, netSalary, salaryId]
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
    console.error("Error updating salary records:", error);
    res.status(500).json({ error: "Error to fetch salary records" });
  }
});

router.get('/salary',  async (req, res) => {
  try {
    const { year, month } = req.query;

    let query = `
      SELECT 
          s.SalaryID, s.EmployeeID, e.FullName, s.SalaryMonth, s.BaseSalary, s.Bonus, 
          s.Deductions, s.NetSalary, s.CreatedAt, e.Status
      FROM salaries s
      JOIN employees e ON s.EmployeeID = e.EmployeeID
    `;

    // Add filtering by year and month if provided
    if (year && month) {
      query += ` WHERE YEAR(s.SalaryMonth) = ? AND MONTH(s.SalaryMonth) = ?`;
      const [rows] = await promisePool.query(query, [year, month]);
      res.json(rows);
    } else {
      // If no year/month specified, return all records
      query += ` ORDER BY s.SalaryMonth DESC, e.FullName ASC`;
      const [rows] = await promisePool.query(query);
      res.json(rows);
    }
  } catch (error) {
    console.error("Error fetching salary records: ", error);
    res.status(500).json({ error: "Failed to fetch salary record" });
  }
})

router.get('/employees',  async (req, res) => {
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
router.get('/employees/:id',  async (req, res) => {
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
router.get('/departments',  async (req, res) => {
  const [rows] = await promisePool.query('SELECT * FROM departments');
  res.json(rows);
});

// API GET - Lấy danh sách chức vụ
router.get('/positions',  async (req, res) => {
  const [rows] = await promisePool.query('SELECT * FROM positions');
  res.json(rows);
});

// API GET - Lấy lịch sử lương của nhân viên
router.get('/salaries/employee/:id',  async (req, res) => {
  const [rows] = await promisePool.query(
    'SELECT * FROM salaries WHERE EmployeeID = ? ORDER BY SalaryMonth DESC',
    [req.params.id]
  );
  res.json(rows);
});

// API GET - Lấy lịch sử lương của nhân viên theo năm
router.get('/salaries/employee/:id/year/:year',  async (req, res) => {
  const [rows] = await promisePool.query(
    'SELECT * FROM salaries WHERE EmployeeID = ? AND YEAR(SalaryMonth) = ? ORDER BY SalaryMonth DESC',
    [req.params.id, req.params.year]
  );
  res.json(rows);
});

// API GET - Lấy dữ liệu chấm công của nhân viên
router.get('/attendance/employee/:id',  async (req, res) => {
  const [rows] = await promisePool.query(
    'SELECT * FROM attendance WHERE EmployeeID = ? ORDER BY AttendanceMonth DESC',
    [req.params.id]
  );
  res.json(rows);
});

// API GET - Lấy dữ liệu chấm công của nhân viên theo năm
router.get('/attendance/employee/:id/year/:year',  async (req, res) => {
  const [rows] = await promisePool.query(
    'SELECT * FROM attendance WHERE EmployeeID = ? AND YEAR(AttendanceMonth) = ? ORDER BY AttendanceMonth DESC',
    [req.params.id, req.params.year]
  );
  res.json(rows);
});



module.exports = router;
