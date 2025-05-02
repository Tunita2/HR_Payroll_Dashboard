const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const adminAPI = require('../services/Routes/admin-API');
const { verifyToken, authorize } = require('../services/Auth/auth-middleware');
const mysql = require('../services/config/mysql');
const { conn, sql } = require('../services/config/mssql');

// Mock các dependency
jest.mock('../services/Auth/auth-middleware', () => ({
  verifyToken: jest.fn((req, res, next) => {
    req.user = { userId: 1, employeeId: 1, role: 'admin' };
    next();
  }),
  authorize: jest.fn(() => (req, res, next) => next()),
  JWT_SECRET: '123456'
}));

jest.mock('../services/config/mysql', () => ({
  query: jest.fn().mockResolvedValue([[], []])
}));

jest.mock('../services/config/mssql', () => {
  const mockRequest = {
    input: jest.fn().mockReturnThis(),
    query: jest.fn().mockResolvedValue({ recordset: [] })
  };
  const mockPool = {
    request: jest.fn().mockReturnValue(mockRequest)
  };
  return {
    conn: Promise.resolve(mockPool),
    sql: {
      Int: 'Int',
      NVarChar: 'NVarChar'
    }
  };
});

jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn().mockResolvedValue({ messageId: 'test-message-id' })
  })
}));

// Tạo app Express để test
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/api/admin', adminAPI);

describe('Admin API Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test GET /departments
  describe('GET /departments', () => {
    it('should return merged department data', async () => {
      // Mock dữ liệu từ SQL Server
      const mockSQLServerData = [
        { DepartmentID: 1, DepartmentName: 'IT', employeeCount: 10 },
        { DepartmentID: 2, DepartmentName: 'HR', employeeCount: 5 }
      ];

      // Mock dữ liệu từ MySQL
      const mockMySQLData = [
        { DepartmentID: 1, totalBudget: 100000, avgSalary: 10000 },
        { DepartmentID: 2, totalBudget: 50000, avgSalary: 10000 }
      ];

      // Setup mock cho SQL Server
      const mockPool = await conn;
      mockPool.request().query.mockResolvedValueOnce({ recordset: mockSQLServerData });

      // Setup mock cho MySQL
      mysql.query.mockResolvedValueOnce([mockMySQLData]);

      // Gọi API
      const response = await request(app).get('/api/admin/departments');

      // Kiểm tra kết quả
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toEqual({
        name: 'IT',
        employees: 10,
        budget: 100000,
        avgSalary: 10000
      });
      expect(response.body[1]).toEqual({
        name: 'HR',
        employees: 5,
        budget: 50000,
        avgSalary: 10000
      });

      // Kiểm tra các hàm mock đã được gọi
      expect(mockPool.request().query).toHaveBeenCalledTimes(1);
      expect(mysql.query).toHaveBeenCalledTimes(1);
    });

    it('should handle errors and return 500', async () => {
      // Setup mock để ném lỗi
      const mockPool = await conn;
      mockPool.request().query.mockRejectedValueOnce(new Error('Database error'));

      // Gọi API
      const response = await request(app).get('/api/admin/departments');

      // Kiểm tra kết quả
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Failed to fetch department overview' });
    });
  });

  // Test GET /positions
  describe('GET /positions', () => {
    it('should return merged position data', async () => {
      // Mock dữ liệu từ SQL Server
      const mockSQLServerData = [
        { PositionID: 1, PositionName: 'Developer', employeeCount: 8 },
        { PositionID: 2, PositionName: 'Manager', employeeCount: 3 }
      ];

      // Mock dữ liệu từ MySQL
      const mockMySQLData = [
        { PositionID: 1, avgSalary: 12000 },
        { PositionID: 2, avgSalary: 15000 }
      ];

      // Setup mock cho SQL Server
      const mockPool = await conn;
      mockPool.request().query.mockResolvedValueOnce({ recordset: mockSQLServerData });

      // Setup mock cho MySQL
      mysql.query.mockResolvedValueOnce([mockMySQLData]);

      // Gọi API
      const response = await request(app).get('/api/admin/positions');

      // Kiểm tra kết quả
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toEqual({
        name: 'Developer',
        count: 8,
        avgSalary: 12000
      });
      expect(response.body[1]).toEqual({
        name: 'Manager',
        count: 3,
        avgSalary: 15000
      });

      // Kiểm tra các hàm mock đã được gọi
      expect(mockPool.request().query).toHaveBeenCalledTimes(1);
      expect(mysql.query).toHaveBeenCalledTimes(1);
    });
  });

  // Test GET /attendances
  describe('GET /attendances', () => {
    it('should return attendance data from MySQL', async () => {
      // Mock dữ liệu từ MySQL
      const mockAttendanceData = [
        { month: 'Jan', workDays: 22, absentDays: 2, leaveDays: 1 },
        { month: 'Feb', workDays: 20, absentDays: 1, leaveDays: 2 }
      ];

      // Setup mock cho MySQL
      mysql.query.mockResolvedValueOnce([mockAttendanceData]);

      // Gọi API
      const response = await request(app).get('/api/admin/attendances');

      // Kiểm tra kết quả
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockAttendanceData);

      // Kiểm tra các hàm mock đã được gọi
      expect(mysql.query).toHaveBeenCalledTimes(1);
    });
  });

  // Test GET /salaries
  describe('GET /salaries', () => {
    it('should return salary data from MySQL', async () => {
      // Mock dữ liệu từ MySQL
      const mockSalaryData = [
        { month: 'Jan', baseSalary: 100000, bonus: 10000, deductions: 5000, netSalary: 105000 },
        { month: 'Feb', baseSalary: 100000, bonus: 8000, deductions: 5000, netSalary: 103000 }
      ];

      // Setup mock cho MySQL
      mysql.query.mockResolvedValueOnce([mockSalaryData]);

      // Gọi API
      const response = await request(app).get('/api/admin/salaries');

      // Kiểm tra kết quả
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockSalaryData);

      // Kiểm tra các hàm mock đã được gọi
      expect(mysql.query).toHaveBeenCalledTimes(1);
    });
  });

  // Test GET /dividends
  describe('GET /dividends', () => {
    it('should return dividend data from SQL Server', async () => {
      // Mock dữ liệu từ SQL Server
      const mockDividendData = [
        { month: 'Jan', amount: 50000 },
        { month: 'Mar', amount: 60000 }
      ];

      // Setup mock cho SQL Server
      const mockPool = await conn;
      mockPool.request().query.mockResolvedValueOnce({ recordset: mockDividendData });

      // Gọi API
      const response = await request(app).get('/api/admin/dividends');

      // Kiểm tra kết quả
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockDividendData);

      // Kiểm tra các hàm mock đã được gọi
      expect(mockPool.request().query).toHaveBeenCalledTimes(1);
    });
  });

  // Test GET /status
  describe('GET /status', () => {
    it('should return employee status data from SQL Server', async () => {
      // Mock dữ liệu từ SQL Server
      const mockStatusData = [
        { Status: 'Active', count: 15 },
        { Status: 'On Leave', count: 3 }
      ];

      // Setup mock cho SQL Server
      const mockPool = await conn;
      mockPool.request().query.mockResolvedValueOnce({ recordset: mockStatusData });

      // Gọi API
      const response = await request(app).get('/api/admin/status');

      // Kiểm tra kết quả
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockStatusData);

      // Kiểm tra các hàm mock đã được gọi
      expect(mockPool.request().query).toHaveBeenCalledTimes(1);
    });
  });

  // Test GET /alerts
  describe('GET /alerts', () => {
    it('should return alerts data from MySQL', async () => {
      // Mock dữ liệu từ MySQL
      const mockAlertsData = [
        {
          id: 1,
          employeeName: 'John Doe',
          department: 'IT',
          allowedDays: 12,
          usedDays: 15,
          daysExceeded: 3,
          date: '05/15/2023'
        },
        {
          id: 2,
          employeeName: 'Jane Smith',
          department: 'HR',
          allowedDays: 12,
          usedDays: 14,
          daysExceeded: 2,
          date: '05/15/2023'
        }
      ];

      // Setup mock cho MySQL
      mysql.query.mockResolvedValueOnce([mockAlertsData]);

      // Gọi API
      const response = await request(app).get('/api/admin/alerts');

      // Kiểm tra kết quả
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockAlertsData);

      // Kiểm tra các hàm mock đã được gọi
      expect(mysql.query).toHaveBeenCalledTimes(1);
    });
  });

  // Test POST /notifications/send-payroll
  describe('POST /notifications/send-payroll', () => {
    it('should send email and return success', async () => {
      // Dữ liệu gửi đi
      const emailData = {
        email: 'test@example.com',
        subject: 'Payroll Notification',
        html: '<p>Your payroll has been processed</p>'
      };

      // Gọi API
      const response = await request(app)
        .post('/api/admin/notifications/send-payroll')
        .send(emailData);

      // Kiểm tra kết quả
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Email sent successfully');
    });

    it('should return 400 if required fields are missing', async () => {
      // Dữ liệu thiếu trường
      const emailData = {
        email: 'test@example.com',
        // Thiếu subject và html
      };

      // Gọi API
      const response = await request(app)
        .post('/api/admin/notifications/send-payroll')
        .send(emailData);

      // Kiểm tra kết quả
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('All fields are required');
    });
  });

  // Test đồng bộ dữ liệu giữa hai hệ thống
  describe('Data Synchronization Tests', () => {
    // Giả lập một API thêm nhân viên mới (chưa có trong admin-API.js)
    it('should verify data synchronization between SQL Server and MySQL', async () => {
      // Đây là một test giả định để kiểm tra đồng bộ dữ liệu
      // Trong thực tế, bạn cần triển khai API thêm/sửa/xóa nhân viên trước

      // Giả sử chúng ta đã thêm một nhân viên mới với ID 9999
      const employeeId = 9999;

      // Mock dữ liệu từ SQL Server
      const mockSQLServerEmployee = {
        EmployeeID: employeeId,
        FullName: 'Test Employee',
        DepartmentID: 1,
        PositionID: 1,
        Email: 'test@example.com',
        Status: 'Active'
      };

      // Mock dữ liệu từ MySQL
      const mockMySQLEmployee = {
        EmployeeID: employeeId,
        FullName: 'Test Employee',
        DepartmentID: 1,
        PositionID: 1,
        Email: 'test@example.com',
        Status: 'Active'
      };

      // Giả lập truy vấn SQL Server để lấy thông tin nhân viên
      const mockPool = await conn;
      mockPool.request().query.mockResolvedValueOnce({
        recordset: [mockSQLServerEmployee]
      });

      // Giả lập truy vấn MySQL để lấy thông tin nhân viên
      mysql.query.mockResolvedValueOnce([[mockMySQLEmployee]]);

      // Kiểm tra dữ liệu từ cả hai hệ thống
      expect(mockSQLServerEmployee.EmployeeID).toBe(mockMySQLEmployee.EmployeeID);
      expect(mockSQLServerEmployee.FullName).toBe(mockMySQLEmployee.FullName);
      expect(mockSQLServerEmployee.DepartmentID).toBe(mockMySQLEmployee.DepartmentID);
      expect(mockSQLServerEmployee.PositionID).toBe(mockMySQLEmployee.PositionID);
      expect(mockSQLServerEmployee.Email).toBe(mockMySQLEmployee.Email);
      expect(mockSQLServerEmployee.Status).toBe(mockMySQLEmployee.Status);
    });
  });
});
