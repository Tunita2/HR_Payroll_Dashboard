const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Cấu hình kết nối MySQL
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',     
  password: '123456',     
  database: 'payroll',
  connectionLimit: 10,
  waitForConnections: true,
});

// Chuyển sang sử dụng promise để hỗ trợ async/await
const promisePool = pool.promise();

// API lấy danh sách phòng ban
app.get('/api/departments', async (req, res) => {
  try {
    console.log('Đang lấy dữ liệu phòng ban...');
    const [rows] = await promisePool.query('SELECT * FROM departments');
    console.log('Dữ liệu phòng ban:', rows);
    res.json(rows);
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu phòng ban:', error);
    res.status(500).json({ 
      message: 'Lỗi server khi lấy dữ liệu phòng ban', 
      error: error.message 
    });
  }
});

// API lấy danh sách công việc
app.get('/api/jobs', async (req, res) => {
  try {
    console.log('Đang lấy dữ liệu công việc...');
    const [rows] = await promisePool.query('SELECT * FROM jobs');
    console.log('Dữ liệu công việc:', rows);
    res.json(rows);
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu công việc:', error);
    res.status(500).json({ 
      message: 'Lỗi server khi lấy dữ liệu công việc', 
      error: error.message 
    });
  }
});

// API thêm nhân viên mới
app.post('/api/employees', async (req, res) => {
  let connection;
  try {
    console.log('Dữ liệu nhận được:', req.body);
    
    connection = await promisePool.getConnection();
    await connection.beginTransaction();

    // Kiểm tra email đã tồn tại chưa
    const [existingEmails] = await connection.query(
      'SELECT email FROM employees WHERE email = ?',
      [req.body.email]
    );

    if (existingEmails.length > 0) {
      await connection.rollback();
      return res.status(400).json({ message: 'Email đã tồn tại' });
    }

    // Thêm nhân viên mới
    const [result] = await connection.query(
      `INSERT INTO employees 
       (first_name, last_name, email, phone, hire_date, department_id, job_id, salary, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.body.first_name,
        req.body.last_name,
        req.body.email,
        req.body.phone,
        req.body.hire_date,
        req.body.department_id,
        req.body.job_id,
        req.body.salary,
        req.body.status || 'active'
      ]
    );

    await connection.commit();
    
    res.status(201).json({ 
      message: 'Thêm nhân viên thành công',
      employee_id: result.insertId
    });
  } catch (error) {
    if (connection) await connection.rollback();
    console.error('Lỗi khi thêm nhân viên:', error);
    res.status(500).json({ 
      message: 'Không thể thêm nhân viên', 
      error: error.message 
    });
  } finally {
    if (connection) connection.release();
  }
});

// API lấy danh sách nhân viên
app.get('/api/employees', async (req, res) => { //endpoint
  try {
    const query = `
      SELECT 
        e.employee_id as id, 
        e.first_name as name, 
        DATE_FORMAT(e.hire_date, '%d/%m/%Y') as startDate, 
        d.department_name as department, 
        CASE 
          WHEN e.employee_id = d.manager_id THEN 'Quản lý'
          ELSE 'Nhân viên'
        END as position,
        e.email, 
        e.phone, 
        e.status 
      FROM employees e
      LEFT JOIN departments d ON e.department_id = d.department_id
    `;

    const [rows] = await promisePool.query(query);// gửi truy vấn đến mySQL 
    res.json(rows);// server trả về dữ liệu json

  } catch (error) {
    console.error('Lỗi truy vấn:', error);
    res.status(500).json({ 
      message: 'Lỗi server', 
      error: error.message 
    });
  }
});

app.get('/api/employee-payroll', async (req, res) => {
  try {
    const query = `
      SELECT 
        e.employee_id as id,
        CONCAT(e.first_name, ' ', e.last_name) as name,
        d.department_name as department,
        p.base_salary,
        p.bonus,
        p.deductions,
        (p.base_salary + p.bonus - p.deductions) as total,
        e.status
      FROM employees e
      LEFT JOIN payroll p ON e.employee_id = p.employee_id
      LEFT JOIN departments d ON e.department_id = d.department_id
    `;

    const [rows] = await promisePool.query(query);
    res.json(rows);
  } catch (error) {
    console.error('Lỗi truy vấn:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});
// lấy chấm công, điểm danh
app.get('/api/attendance', async (req, res) => {
  try {
    const { month } = req.query;
    
    if (!month) {
      return res.status(400).json({ message: 'Vui lòng chọn tháng hợp lệ!' });
    }
    // Lấy dữ liệu theo tháng
    const query = `
      SELECT 
        e.Employee_id AS id,
        e.FullName AS fullName,
        d.DepartmentName AS department,
        p.Position AS position,
        a.WorkDays AS workdays,
        a.AbsentDays AS absendays,
        a.LeaveDays AS leavedays,
        a.AttendanceMonth AS attendancemonth,
        a.CreatedAt AS createdat
        e.Status
      FROM employees e
      JOIN attendance a ON e.employeeID = a.employeeID
      JOIN departments d ON e.department_id = d.department_id
      WHERE DATE_FORMAT(a.CreatedAt, '%Y-%m') = ?
      ORDER BY a.C ASC;
    `;
    const [rows] = await promisePool.query(query, [month]);
    res.json(rows);
  } catch (error) {
    console.error('Lỗi truy vấn:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});


// API xóa nhân viên (Soft Delete)
app.delete('/api/employees/:id', async (req, res) => {
  const { id } = req.params;
  let connection;

  try {
    // Bắt đầu transaction
    connection = await promisePool.getConnection();
    await connection.beginTransaction();

    // Kiểm tra nhân viên tồn tại
    const [checkEmployee] = await connection.query(
      'SELECT * FROM employees WHERE employee_id = ?', 
      [id]
    );

    if (checkEmployee.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: 'Không tìm thấy nhân viên' });
    }

    // Soft delete: Cập nhật trạng thái thay vì xóa
    const [result] = await connection.query(
      'UPDATE employees SET status = "inactive" WHERE employee_id = ?', 
      [id]
    );

    // Commit transaction
    await connection.commit();

    res.json({ 
      message: 'Cập nhật trạng thái nhân viên thành công',
      updatedRows: result.affectedRows 
    });
  } catch (error) {
    // Rollback transaction nếu có lỗi
    if (connection) await connection.rollback();

    console.error('Lỗi cập nhật nhân viên:', error);
    res.status(500).json({ 
      message: 'Không thể cập nhật trạng thái nhân viên', 
      error: error.message 
    });
  } finally {
    // Luôn giải phóng kết nối
    if (connection) connection.release();
  }
});

// API để upload ảnh hồ sơ (nếu bạn cần)
// Bạn sẽ cần cài đặt thêm multer: npm install multer
// app.post('/api/employee/profile-image', upload.single('profile_image'), async (req, res) => {
//   // Code xử lý upload ảnh
// });

// Thêm endpoint để kiểm tra server hoạt động
app.get('/', (req, res) => {
  res.send('Server hoạt động bình thường');
});

// Kiểm tra kết nối database
app.get('/api/database-test', async (req, res) => {
  try {
    const [rows] = await promisePool.query('SELECT 1+1 as result');
    res.json({ 
      message: 'Kết nối database thành công', 
      test: rows[0].result 
    });
  } catch (error) {
    console.error('Lỗi kết nối database:', error);
    res.status(500).json({ 
      message: 'Lỗi kết nối database', 
      error: error.message 
    });
  }
});

// Khởi động server
app.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`);
});