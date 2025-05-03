const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const employeeAPI = require('../services/Routes/employee-API');
const { verifyToken } = require('../services/Auth/auth-middleware');
const mysql = require('../services/config/mysql');
const { conn, sql } = require('../services/config/mssql');

jest.mock('../services/Auth/auth-middleware', () => ({
  verifyToken: jest.fn((req, res, next) => {
    req.user = { userId: 1, employeeId: 1, role: 'employee' };
    next();
  }),
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
      NVarChar: 'NVarChar',
      VarChar: 'VarChar'
    }
  };
});

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/api/employee', employeeAPI);

describe('Employee API Validation Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('API Response Structure', () => {
    it('should verify profile API returns correct data structure', async () => {
      const mockEmployeeData = {
        EmployeeID: 1,
        FullName: 'John Doe',
        Email: 'john.doe@example.com',
        DepartmentName: 'IT',
        PositionName: 'Developer'
      };

      const mockPool = await conn;
      mockPool.request().query.mockResolvedValueOnce({ recordset: [mockEmployeeData] });

      const response = await request(app).get('/api/employee/profile');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('EmployeeID');
      expect(response.body).toHaveProperty('FullName');
      expect(response.body).toHaveProperty('Email');
      expect(response.body).toHaveProperty('DepartmentName');
      expect(response.body).toHaveProperty('PositionName');
    });

    it('should verify payroll API returns correct data structure', async () => {
      const mockSalaryData = [{ SalaryID: 1, EmployeeID: 1, BaseSalary: 10000000 }];
      const mockAttendanceData = [{ AttendanceID: 1, EmployeeID: 1, WorkDays: 22 }];

      mysql.query.mockResolvedValueOnce([{ test: 1 }])
                 .mockResolvedValueOnce([mockSalaryData])
                 .mockResolvedValueOnce([mockAttendanceData]);

      const mockPool = await conn;
      mockPool.request().query.mockResolvedValueOnce({ recordset: [] });

      const response = await request(app).get('/api/employee/payroll');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('payrollHistory');
      expect(response.body).toHaveProperty('currentPayroll');
      expect(response.body).toHaveProperty('attendanceData');
      expect(Array.isArray(response.body.payrollHistory)).toBe(true);
      expect(Array.isArray(response.body.attendanceData)).toBe(true);
    });
  });

  describe('Input Validation', () => {
    it('should validate required fields for profile update', async () => {
      const invalidData = {
        PhoneNumber: '9876543210'
      };

      const response = await request(app)
        .put('/api/employee/profile')
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should validate email format for profile update', async () => {
      const invalidData = {
        FullName: 'John Doe',
        Gender: 'Male',
        Email: 'invalid-email',
        Status: 'Active'
      };

      const response = await request(app)
        .put('/api/employee/profile')
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('email');
    });
  });

  describe('Authentication', () => {
    it('should require authentication for API access', async () => {
      verifyToken.mockImplementationOnce((req, res, next) => {
        return res.status(401).json({ error: 'Unauthorized' });
      });

      const response = await request(app).get('/api/employee/profile');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Unauthorized');
    });
  });

  describe('Error Handling', () => {
    it('should handle database errors gracefully', async () => {
      const mockPool = await conn;
      mockPool.request().query.mockRejectedValueOnce(new Error('Database error'));

      const response = await request(app).get('/api/employee/profile');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
    });
  });
});
