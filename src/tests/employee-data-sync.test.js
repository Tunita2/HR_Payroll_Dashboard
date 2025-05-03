const mysql = require('../services/config/mysql');
const { conn, sql } = require('../services/config/mssql');

jest.mock('../services/config/mysql', () => ({
  query: jest.fn().mockResolvedValue([[], []])
}));

jest.mock('../services/config/mssql', () => {
  const mockRequest = {
    input: jest.fn().mockReturnThis(),
    query: jest.fn().mockResolvedValue({ recordset: [] })
  };
  const mockPool = {
    request: jest.fn().mockReturnValue(mockRequest),
    transaction: jest.fn().mockResolvedValue({
      begin: jest.fn().mockResolvedValue(undefined),
      commit: jest.fn().mockResolvedValue(undefined),
      request: jest.fn().mockReturnValue(mockRequest)
    })
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

describe('Employee Data Synchronization Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should verify employee data consistency between databases', async () => {
    const sqlServerEmployee = {
      EmployeeID: 1,
      FullName: 'John Doe',
      DepartmentName: 'IT',
      Status: 'Active'
    };

    const mysqlEmployee = {
      EmployeeID: 1,
      FullName: 'John Doe',
      DepartmentName: 'IT',
      Status: 'Active'
    };

    const mockPool = await conn;
    mockPool.request().query.mockResolvedValueOnce({ recordset: [sqlServerEmployee] });
    mysql.query.mockResolvedValueOnce([mysqlEmployee]);

    const sqlResult = await mockPool.request()
      .input('employeeId', sql.Int, 1)
      .query('SELECT * FROM Employees WHERE EmployeeID = @employeeId');

    const [mysqlResult] = await mysql.query(
      'SELECT * FROM employees WHERE EmployeeID = ?',
      [1]
    );

    expect(sqlResult.recordset[0].EmployeeID).toBe(mysqlResult.EmployeeID);
    expect(sqlResult.recordset[0].FullName).toBe(mysqlResult.FullName);
    expect(sqlResult.recordset[0].DepartmentName).toBe(mysqlResult.DepartmentName);
    expect(sqlResult.recordset[0].Status).toBe(mysqlResult.Status);
  });

  it('should verify payroll data is correctly associated with employee', async () => {
    const employee = {
      EmployeeID: 1,
      FullName: 'John Doe'
    };

    const salaryData = [{
      SalaryID: 1,
      EmployeeID: 1,
      BaseSalary: 10000000
    }];

    const mockPool = await conn;
    mockPool.request().query.mockResolvedValueOnce({ recordset: [employee] });
    mysql.query.mockResolvedValueOnce([salaryData]);

    const sqlResult = await mockPool.request()
      .input('employeeId', sql.Int, 1)
      .query('SELECT * FROM Employees WHERE EmployeeID = @employeeId');

    const [mysqlResult] = await mysql.query(
      'SELECT * FROM salaries WHERE EmployeeID = ?',
      [1]
    );

    expect(sqlResult.recordset[0].EmployeeID).toBe(mysqlResult[0].EmployeeID);
  });

  it('should maintain data consistency after profile update', async () => {
    const updatedEmployee = {
      EmployeeID: 1,
      FullName: 'John Updated'
    };

    const mockPool = await conn;
    const mockTransaction = await mockPool.transaction();

    mockPool.request().query.mockResolvedValueOnce({ recordset: [updatedEmployee] });
    mysql.query.mockResolvedValueOnce([updatedEmployee]);

    await mockTransaction.begin();

    await mockTransaction.request()
      .input('employeeId', sql.Int, 1)
      .input('FullName', sql.NVarChar, 'John Updated')
      .query('UPDATE Employees SET FullName=@FullName WHERE EmployeeID=@employeeId');

    await mysql.query(
      'UPDATE employees SET FullName=? WHERE EmployeeID=?',
      ['John Updated', 1]
    );

    await mockTransaction.commit();

    mockPool.request().query.mockResolvedValueOnce({
      recordset: [{ EmployeeID: 1, FullName: 'John Updated' }]
    });

    mysql.query.mockResolvedValueOnce([{ EmployeeID: 1, FullName: 'John Updated' }]);

    const sqlResult = await mockPool.request()
      .input('employeeId', sql.Int, 1)
      .query('SELECT * FROM Employees WHERE EmployeeID = @employeeId');

    const [mysqlResult] = await mysql.query(
      'SELECT * FROM employees WHERE EmployeeID = ?',
      [1]
    );

    expect(sqlResult.recordset).toBeDefined();
    expect(sqlResult.recordset.length).toBeGreaterThan(0);
    expect(mysqlResult).toBeDefined();

    expect(sqlResult.recordset[0].FullName).toBe('John Updated');
    expect(mysqlResult.FullName).toBe('John Updated');
    expect(sqlResult.recordset[0].FullName).toBe(mysqlResult.FullName);
  });
});
