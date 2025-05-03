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

describe('Employee API Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /profile', () => {
    it('should return employee profile data from SQL Server', async () => {
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
      expect(response.body).toEqual(mockEmployeeData);
    });

    it('should handle employee not found', async () => {
      const mockPool = await conn;
      mockPool.request().query.mockResolvedValueOnce({ recordset: [] });

      const response = await request(app).get('/api/employee/profile');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Employee not found' });
    });
  });

  describe('PUT /profile', () => {
    it('should update employee profile', async () => {
      const updateData = {
        FullName: 'John Updated',
        Gender: 'Male',
        Email: 'john.updated@example.com',
        Status: 'Active'
      };

      const mockPool = await conn;
      mockPool.request().query.mockResolvedValueOnce({ rowsAffected: [1] });

      const response = await request(app)
        .put('/api/employee/profile')
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Profile updated successfully');
    });
  });

  describe('GET /payroll', () => {
    it('should return payroll data', async () => {
      const mockSalaryData = [
        {
          SalaryID: 1,
          EmployeeID: 1,
          BaseSalary: 10000000,
          NetSalary: 10500000
        }
      ];

      const mockAttendanceData = [
        {
          AttendanceID: 1,
          EmployeeID: 1,
          WorkDays: 22
        }
      ];

      mysql.query.mockResolvedValueOnce([{ test: 1 }])
                 .mockResolvedValueOnce([mockSalaryData])
                 .mockResolvedValueOnce([mockAttendanceData]);

      const mockPool = await conn;
      mockPool.request().query.mockResolvedValueOnce({ recordset: [] });

      const response = await request(app).get('/api/employee/payroll');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('payrollHistory', mockSalaryData);
      expect(response.body).toHaveProperty('attendanceData', mockAttendanceData);
    });
  });

  describe('Data Synchronization', () => {
    it('should verify profile data consistency between databases', async () => {
      const mockSQLServerData = {
        EmployeeID: 1,
        FullName: 'John Doe',
        DepartmentName: 'IT'
      };

      const mockMySQLData = {
        EmployeeID: 1,
        FullName: 'John Doe',
        DepartmentName: 'IT'
      };

      const mockPool = await conn;
      mockPool.request().query.mockResolvedValueOnce({ recordset: [mockSQLServerData] });

      mysql.query.mockImplementationOnce((_, __, callback) => {
        callback(null, [mockMySQLData]);
      });

      const sqlServerResponse = await request(app).get('/api/employee/profile');

      verifyToken.mockImplementationOnce((req, _, next) => {
        req.user = { userId: 1, employeeId: 1, role: 'mysql' };
        next();
      });
      const mysqlResponse = await request(app).get('/api/employee/profile?db=mysql');

      expect(sqlServerResponse.status).toBe(200);
      expect(mysqlResponse.status).toBe(200);

      expect(sqlServerResponse.body.EmployeeID).toBe(mysqlResponse.body.EmployeeID);
      expect(sqlServerResponse.body.FullName).toBe(mysqlResponse.body.FullName);
      expect(sqlServerResponse.body.DepartmentName).toBe(mysqlResponse.body.DepartmentName);
    });
  });
});
