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

// API lấy danh sách nhân viên
app.get('/api/employees', async (req, res) => {
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

    const [rows] = await promisePool.query(query);
    res.json(rows);
  } catch (error) {
    console.error('Lỗi truy vấn:', error);
    res.status(500).json({ 
      message: 'Lỗi server', 
      error: error.message 
    });
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

// Khởi động server
app.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`);
});