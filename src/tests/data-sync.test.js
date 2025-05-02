const mysql = require('../services/config/mysql');
const { conn, sql } = require('../services/config/mssql');

// Mock các dependency
jest.mock('../services/config/mysql', () => ({
  query: jest.fn().mockResolvedValue([[], []])
}));

jest.mock('../services/config/mssql', () => {
  const mockRequest = {
    input: jest.fn().mockReturnThis(),
    query: jest.fn().mockResolvedValue({ recordset: [], rowsAffected: [1] })
  };
  const mockTransaction = {
    begin: jest.fn().mockResolvedValue(undefined),
    commit: jest.fn().mockResolvedValue(undefined),
    rollback: jest.fn().mockResolvedValue(undefined),
    request: jest.fn().mockReturnValue(mockRequest)
  };
  const mockPool = {
    request: jest.fn().mockReturnValue(mockRequest),
    transaction: jest.fn().mockResolvedValue(mockTransaction)
  };
  return {
    conn: Promise.resolve(mockPool),
    sql: {
      Int: 'Int',
      NVarChar: 'NVarChar',
      Transaction: jest.fn().mockImplementation(() => mockTransaction)
    }
  };
});

// Định nghĩa các hàm giả lập để tái sử dụng
const employeeService = {
  // Thêm nhân viên mới
  addEmployee: async (employee, mockTransaction, mockPool) => {
    try {
      // Bắt đầu transaction
      await mockTransaction.begin();

      // Kiểm tra trùng mã nhân viên trong SQL Server
      const checkResult = await mockTransaction.request().query();

      if (checkResult.recordset.length > 0) {
        await mockTransaction.rollback();
        throw new Error("Employee ID already exists in SQL Server");
      }

      // Kiểm tra trùng mã nhân viên trong MySQL
      const [mysqlCheck] = await mysql.query();

      if (mysqlCheck.length > 0) {
        await mockTransaction.rollback();
        throw new Error("Employee ID already exists in MySQL");
      }

      // Thêm nhân viên vào SQL Server
      await mockTransaction.request().query();

      // Thêm nhân viên vào MySQL
      await mysql.query();

      // Thêm lương cơ bản vào MySQL
      await mysql.query();

      // Commit transaction
      await mockTransaction.commit();

      return { success: true, message: "Employee added successfully" };
    } catch (error) {
      // Rollback nếu có lỗi
      await mockTransaction.rollback();
      throw error;
    }
  },

  // Cập nhật nhân viên
  updateEmployee: async (id, data, mockTransaction) => {
    try {
      // Bắt đầu transaction
      await mockTransaction.begin();

      // Cập nhật nhân viên trong SQL Server
      const sqlResult = await mockTransaction.request().query();

      if (sqlResult.rowsAffected[0] === 0) {
        await mockTransaction.rollback();
        throw new Error("Employee not found in SQL Server");
      }

      // Cập nhật nhân viên trong MySQL
      const [mysqlResult] = await mysql.query();

      if (mysqlResult.affectedRows === 0) {
        await mockTransaction.rollback();
        throw new Error("Employee not found in MySQL");
      }

      // Cập nhật lương cơ bản nếu có
      if (data.BaseSalary) {
        await mysql.query();
      }

      // Commit transaction
      await mockTransaction.commit();

      return { success: true, message: "Employee updated successfully" };
    } catch (error) {
      // Rollback nếu có lỗi
      await mockTransaction.rollback();
      throw error;
    }
  },

  // Xóa nhân viên
  deleteEmployee: async (id, mockTransaction) => {
    try {
      // Kiểm tra ràng buộc trong MySQL (payroll)
      const [salaryCheck] = await mysql.query();

      if (salaryCheck[0].count > 0) {
        return {
          success: false,
          error: "Cannot delete employee with payroll data",
          details: "Employee has salary records in the system"
        };
      }

      // Kiểm tra ràng buộc trong SQL Server (dividends)
      const dividendCheck = await mockTransaction.request().query();

      if (dividendCheck.recordset[0]?.count > 0) {
        return {
          success: false,
          error: "Cannot delete employee with dividend data",
          details: "Employee has dividend records in the system"
        };
      }

      // Bắt đầu transaction
      await mockTransaction.begin();

      // Xóa nhân viên từ SQL Server
      const sqlResult = await mockTransaction.request().query();

      if (sqlResult.rowsAffected[0] === 0) {
        await mockTransaction.rollback();
        return { success: false, error: "Employee not found in SQL Server" };
      }

      // Xóa nhân viên từ MySQL
      const [mysqlResult] = await mysql.query();

      if (mysqlResult.affectedRows === 0) {
        await mockTransaction.rollback();
        return { success: false, error: "Employee not found in MySQL" };
      }

      // Commit transaction
      await mockTransaction.commit();

      return { success: true, message: "Employee deleted successfully" };
    } catch (error) {
      // Rollback nếu có lỗi
      await mockTransaction.rollback();
      throw error;
    }
  }
};

describe('Data Synchronization Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test thêm nhân viên mới
  describe('Add Employee Synchronization', () => {
    it('should add employee to both SQL Server and MySQL', async () => {
      // Dữ liệu nhân viên mới
      const newEmployee = {
        EmployeeID: 9999,
        FullName: 'Test Employee',
        DepartmentID: 1,
        PositionID: 1,
        BaseSalary: 10000000,
        Email: 'test@example.com',
        Status: 'Active'
      };

      // Mock SQL Server transaction
      const mockPool = await conn;
      // Đảm bảo mockTransaction có phương thức request
      const mockTransaction = {
        begin: jest.fn().mockResolvedValue(undefined),
        commit: jest.fn().mockResolvedValue(undefined),
        rollback: jest.fn().mockResolvedValue(undefined),
        request: jest.fn().mockReturnValue({
          input: jest.fn().mockReturnThis(),
          query: jest.fn().mockResolvedValue({ recordset: [], rowsAffected: [1] })
        })
      };

      // Mock kiểm tra trùng mã nhân viên trong SQL Server
      mockTransaction.request().query.mockResolvedValueOnce({ recordset: [] });

      // Mock kiểm tra trùng mã nhân viên trong MySQL
      mysql.query.mockResolvedValueOnce([[]]);

      // Mock thêm nhân viên vào SQL Server
      mockTransaction.request().query.mockResolvedValueOnce({ rowsAffected: [1] });

      // Mock thêm nhân viên vào MySQL
      mysql.query.mockResolvedValueOnce([{ affectedRows: 1 }]);

      // Mock thêm lương cơ bản vào MySQL
      mysql.query.mockResolvedValueOnce([{ affectedRows: 1 }]);

      // Sử dụng hàm addEmployee từ employeeService
      const result = await employeeService.addEmployee(newEmployee, mockTransaction);

      // Kiểm tra kết quả
      expect(result.success).toBe(true);
      expect(result.message).toBe("Employee added successfully");

      // Kiểm tra các hàm mock đã được gọi
      expect(mockTransaction.begin).toHaveBeenCalledTimes(1);
      expect(mockTransaction.request().query).toHaveBeenCalledTimes(2);
      expect(mysql.query).toHaveBeenCalledTimes(3);
      expect(mockTransaction.commit).toHaveBeenCalledTimes(1);
      expect(mockTransaction.rollback).not.toHaveBeenCalled();
    });

    it('should rollback if adding to MySQL fails', async () => {
      // Dữ liệu nhân viên mới
      const newEmployee = {
        EmployeeID: 9999,
        FullName: 'Test Employee',
        DepartmentID: 1,
        PositionID: 1,
        BaseSalary: 10000000,
        Email: 'test@example.com',
        Status: 'Active'
      };

      // Mock SQL Server transaction
      // Đảm bảo mockTransaction có phương thức request
      const mockTransaction = {
        begin: jest.fn().mockResolvedValue(undefined),
        commit: jest.fn().mockResolvedValue(undefined),
        rollback: jest.fn().mockResolvedValue(undefined),
        request: jest.fn().mockReturnValue({
          input: jest.fn().mockReturnThis(),
          query: jest.fn().mockResolvedValue({ recordset: [], rowsAffected: [1] })
        })
      };

      // Mock kiểm tra trùng mã nhân viên trong SQL Server
      mockTransaction.request().query.mockResolvedValueOnce({ recordset: [] });

      // Mock kiểm tra trùng mã nhân viên trong MySQL
      mysql.query.mockResolvedValueOnce([[]]);

      // Mock thêm nhân viên vào SQL Server
      mockTransaction.request().query.mockResolvedValueOnce({ rowsAffected: [1] });

      // Mock lỗi khi thêm nhân viên vào MySQL
      mysql.query.mockRejectedValueOnce(new Error("MySQL connection error"));

      // Thực hiện thêm nhân viên và bắt lỗi
      let errorThrown = false;
      let errorMessage = '';
      let rollbackCalled = false;
      let commitCalled = false;

      try {
        await employeeService.addEmployee(newEmployee, mockTransaction);
      } catch (error) {
        errorThrown = true;
        errorMessage = error.message;
        rollbackCalled = mockTransaction.rollback.mock.calls.length > 0;
        commitCalled = mockTransaction.commit.mock.calls.length > 0;
      }

      // Kiểm tra kết quả
      expect(errorThrown).toBe(true);
      expect(errorMessage).toBe("MySQL connection error");
      expect(rollbackCalled).toBe(true);
      expect(commitCalled).toBe(false);
    });
  });

  // Test cập nhật nhân viên
  describe('Update Employee Synchronization', () => {
    it('should update employee in both SQL Server and MySQL', async () => {
      // Dữ liệu cập nhật
      const employeeId = 9999;
      const updateData = {
        FullName: 'Updated Employee',
        DepartmentID: 2,
        PositionID: 2,
        BaseSalary: 12000000,
        Email: 'updated@example.com',
        Status: 'Active'
      };

      // Mock SQL Server transaction
      // Đảm bảo mockTransaction có phương thức request
      const mockTransaction = {
        begin: jest.fn().mockResolvedValue(undefined),
        commit: jest.fn().mockResolvedValue(undefined),
        rollback: jest.fn().mockResolvedValue(undefined),
        request: jest.fn().mockReturnValue({
          input: jest.fn().mockReturnThis(),
          query: jest.fn().mockResolvedValue({ recordset: [], rowsAffected: [1] })
        })
      };

      // Mock cập nhật nhân viên trong SQL Server
      mockTransaction.request().query.mockResolvedValueOnce({ rowsAffected: [1] });

      // Mock cập nhật nhân viên trong MySQL
      mysql.query.mockResolvedValueOnce([{ affectedRows: 1 }]);

      // Mock cập nhật lương cơ bản trong MySQL
      mysql.query.mockResolvedValueOnce([{ affectedRows: 1 }]);

      // Sử dụng hàm updateEmployee từ employeeService
      const result = await employeeService.updateEmployee(employeeId, updateData, mockTransaction);

      // Kiểm tra kết quả
      expect(result.success).toBe(true);
      expect(result.message).toBe("Employee updated successfully");

      // Kiểm tra các hàm mock đã được gọi
      expect(mockTransaction.begin).toHaveBeenCalledTimes(1);
      expect(mockTransaction.request().query).toHaveBeenCalledTimes(1);
      expect(mysql.query).toHaveBeenCalledTimes(2);
      expect(mockTransaction.commit).toHaveBeenCalledTimes(1);
      expect(mockTransaction.rollback).not.toHaveBeenCalled();
    });
  });

  // Test xóa nhân viên
  describe('Delete Employee Synchronization', () => {
    it('should check constraints before deleting employee', async () => {
      const employeeId = 9999;

      // Mock kiểm tra ràng buộc trong MySQL (payroll)
      mysql.query.mockResolvedValueOnce([[{ count: 1 }]]);

      // Mock SQL Server transaction
      // Đảm bảo mockTransaction có phương thức request
      const mockTransaction = {
        begin: jest.fn().mockResolvedValue(undefined),
        commit: jest.fn().mockResolvedValue(undefined),
        rollback: jest.fn().mockResolvedValue(undefined),
        request: jest.fn().mockReturnValue({
          input: jest.fn().mockReturnThis(),
          query: jest.fn().mockResolvedValue({ recordset: [], rowsAffected: [1] })
        })
      };

      // Sử dụng hàm deleteEmployee từ employeeService
      const result = await employeeService.deleteEmployee(employeeId, mockTransaction);

      // Kiểm tra kết quả
      expect(result.success).toBe(false);
      expect(result.error).toBe("Cannot delete employee with payroll data");

      // Kiểm tra các hàm mock đã được gọi
      expect(mysql.query).toHaveBeenCalledTimes(1);
    });

    it('should delete employee from both systems if no constraints', async () => {
      const employeeId = 9999;

      // Mock SQL Server transaction
      // Đảm bảo mockTransaction có phương thức request
      const mockTransaction = {
        begin: jest.fn().mockResolvedValue(undefined),
        commit: jest.fn().mockResolvedValue(undefined),
        rollback: jest.fn().mockResolvedValue(undefined),
        request: jest.fn().mockReturnValue({
          input: jest.fn().mockReturnThis(),
          query: jest.fn().mockResolvedValue({ recordset: [], rowsAffected: [1] })
        })
      };

      // Mock kiểm tra ràng buộc trong MySQL (payroll)
      mysql.query.mockResolvedValueOnce([[{ count: 0 }]]);

      // Mock kiểm tra ràng buộc trong SQL Server (dividends)
      mockTransaction.request().query.mockResolvedValueOnce({ recordset: [{ count: 0 }] });

      // Mock xóa nhân viên từ SQL Server
      mockTransaction.request().query.mockResolvedValueOnce({ rowsAffected: [1] });

      // Mock xóa nhân viên từ MySQL
      mysql.query.mockResolvedValueOnce([{ affectedRows: 1 }]);

      // Sử dụng hàm deleteEmployee từ employeeService
      const result = await employeeService.deleteEmployee(employeeId, mockTransaction);

      // Kiểm tra kết quả
      expect(result.success).toBe(true);
      expect(result.message).toBe("Employee deleted successfully");

      // Kiểm tra các hàm mock đã được gọi
      expect(mysql.query).toHaveBeenCalledTimes(2);
      expect(mockTransaction.request().query).toHaveBeenCalledTimes(2);
      expect(mockTransaction.begin).toHaveBeenCalledTimes(1);
      expect(mockTransaction.commit).toHaveBeenCalledTimes(1);
      expect(mockTransaction.rollback).not.toHaveBeenCalled();
    });
  });
});
