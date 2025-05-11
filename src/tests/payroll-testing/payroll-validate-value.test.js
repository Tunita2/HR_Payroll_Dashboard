const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const payrollRoutes = require('../../services/Routes/payroll-API');

jest.mock('../../services/config/mysql', () => ({
  query: jest.fn()
}));
const promisePool = require('../../services/config/mysql');

jest.mock('../../services/Auth/auth-middleware', () => ({
  verifyToken: (req, res, next) => {
    req.user = { role: 'payroll' };
    next();
  }
}));

const app = express();
app.use(bodyParser.json());
app.use('/api/payroll', payrollRoutes);

describe('Payroll API Validation Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('PUT /salaries/:id returns 400 if BaseSalary is missing', async () => {
    const res = await request(app).put('/api/payroll/salaries/1').send({
      Bonus: 3000000,
      Deductions: 1000000
    });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ message: 'Invalid salary data' });
  });

  test('PUT /salaries/:id returns 400 if Bonus is a string', async () => {
    const res = await request(app).put('/api/payroll/salaries/1').send({
      BaseSalary: 10000000,
      Bonus: 'three million',
      Deductions: 1000000
    });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ message: 'Invalid salary data' });
  });

  test('PUT /salaries/:id returns 400 if Deductions is negative', async () => {
    const res = await request(app).put('/api/payroll/salaries/1').send({
      BaseSalary: 10000000,
      Bonus: 2000000,
      Deductions: -500000
    });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ message: 'Invalid salary data' });
  });

  test('PUT /salaries/:id returns 400 if all fields are missing', async () => {
    const res = await request(app).put('/api/payroll/salaries/1').send({});

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ message: 'Invalid salary data' });
  });

  test('PUT /salaries/:id returns 200 for valid data', async () => {
    promisePool.query
      .mockResolvedValueOnce([{ affectedRows: 1 }])
      .mockResolvedValueOnce([[{ SalaryID: 1, NetSalary: 12000000 }]]);

    const res = await request(app).put('/api/payroll/salaries/1').send({
      BaseSalary: 10000000,
      Bonus: 3000000,
      Deductions: 1000000
    });

    expect(res.status).toBe(200);
    expect(res.body.data.NetSalary).toBe(12000000);
  });
});
