const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const payrollRoutes = require('../../services/Routes/payroll-API');
const mockData = require('./MockData-payroll'); // Import mock data

jest.mock('../../services/config/mysql', () => ({
  query: jest.fn()
}));
const promisePool = require('../../services/config/mysql');

// Mock verifyToken và verifyPayroll middleware
jest.mock('../../services/Auth/auth-middleware', () => ({
  verifyToken: (req, res, next) => {
    req.user = { role: 'payroll' }; // Giả lập user đã xác thực
    next();
  }
}));

const app = express();
app.use(bodyParser.json());
app.use('/api/payroll', payrollRoutes);

describe('Payroll API Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('GET /attendance returns all records', async () => {
    promisePool.query.mockResolvedValueOnce([mockData.mockAttendanceData]);

    const res = await request(app).get('/api/payroll/attendance');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockData.mockAttendanceData);
  });

  test('GET /attendance with filter', async () => {
    const filteredData = [{ AttendanceID: 2, FullName: 'Jane Doe' }];
    promisePool.query.mockResolvedValueOnce([filteredData]);

    const res = await request(app).get('/api/payroll/attendance?year=2024&month=4');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(filteredData);
  });

  test('GET /salaries returns all records', async () => {
    promisePool.query.mockResolvedValueOnce([mockData.mockSalaryData]);

    const res = await request(app).get('/api/payroll/salaries');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockData.mockSalaryData);
  });

  test('PUT /salaries/:id updates salary', async () => {
    promisePool.query
      .mockResolvedValueOnce([{ affectedRows: 1 }])
      .mockResolvedValueOnce([[{ SalaryID: 1, NetSalary: 12000000 }]]);

    const res = await request(app).put('/api/payroll/salaries/1').send({
      BaseSalary: 10000000,
      Bonus: 3000000,
      Deductions: 1000000
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data.NetSalary).toBe(12000000);
  });

  test('GET /attendance returns 404 when no records found', async () => {
    promisePool.query.mockResolvedValueOnce([[]]);

    const res = await request(app).get('/api/payroll/attendance');

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: 'No attendance records found' });
  });

  test('GET /salaries returns 404 when no records found', async () => {
    promisePool.query.mockResolvedValueOnce([[]]);

    const res = await request(app).get('/api/payroll/salaries');

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: 'No salary records found' });
  });

  test('PUT /salaries/:id returns 400 for invalid data', async () => {
    const res = await request(app).put('/api/payroll/salaries/1').send({
      BaseSalary: 'invalid',
      Bonus: 3000000,
      Deductions: 1000000
    });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ message: 'Invalid salary data' });
  });

  test('GET /employees/:id returns 404 if employee not found', async () => {
    promisePool.query.mockResolvedValueOnce([[]]);

    const res = await request(app).get('/api/payroll/employees/999');

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: 'Employee not found' });
  });
});
