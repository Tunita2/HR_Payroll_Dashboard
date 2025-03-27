const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
app.use(express.json());
app.use(cors());

// Kết nối MySQL (Giữ nguyên database của bạn)
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',  // Thay bằng mật khẩu của bạn
  database: 'payroll'
});

db.connect(err => {
  if (err) {
    console.error('❌ Lỗi kết nối MySQL:', err);
    return;
  }
  console.log('✅ Kết nối MySQL thành công!');
});

// API Login - Xác thực user
app.post('/api/login', (req, res) => {
  const { email, id, password } = req.body;

  const query = `
    SELECT e.*, d.department_name, d.manager_id
    FROM employees e
    LEFT JOIN departments d ON e.department_id = d.department_id
    WHERE e.email = ? AND e.employee_id = ?`;

  db.query(query, [email, id], async (err, results) => {
    if (err) return res.status(500).json({ error: "Lỗi hệ thống" });

    if (results.length > 0) {
      const user = results[0];

      // Kiểm tra mật khẩu (Giả sử đã mã hóa bcrypt trong DB)
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ error: "Sai mật khẩu" });

      // Xác định role
      let role = 'employee'; // Mặc định là nhân viên
      if (user.employee_id === 101) role = 'admin'; // Admin nếu có ID cố định là 1
      else if (user.manager_id === user.employee_id) role = 'hr_manager'; // Là quản lý phòng ban
      else if (user.department_name.toLowerCase() === 'payroll') role = 'payroll_manager'; // Thuộc phòng Payroll

      return res.json({ message: "Đăng nhập thành công!", role });
    } else {
      return res.status(401).json({ error: "Không tìm thấy tài khoản" });
    }
  });
});

// Chạy server
app.listen(5000, () => {
  console.log("🚀 Server chạy tại http://localhost:5000");
});
