-- Thêm một nhân viên mới (nếu chưa có)
IF NOT EXISTS (SELECT * FROM Employees WHERE EmployeeID = 5)
BEGIN
    SET IDENTITY_INSERT Employees ON;
    INSERT INTO Employees (EmployeeID, FullName, DateOfBirth, Gender, PhoneNumber, Email, HireDate, DepartmentID, PositionID, Status, CreatedAt)
    VALUES (5, 'David Wilson', '1989-04-18', 'Male', '5551122334', 'david.wilson@email.com', '2023-08-01', 1, 1, 'Active', '2023-08-01 09:00:00');
    SET IDENTITY_INSERT Employees OFF;
END
GO

-- Thêm tài khoản mới với role là payroll
IF NOT EXISTS (SELECT * FROM Accounts WHERE Username = 'davidwilson')
BEGIN
    SET IDENTITY_INSERT Accounts ON;
    INSERT INTO Accounts (AccountID, EmployeeID, Username, PasswordHash, Role, CreatedAt, UpdatedAt)
    VALUES (5, 5, 'davidwilson', 'password123', 'payroll', '2023-08-02 09:00:00', '2023-08-02 09:00:00');
    SET IDENTITY_INSERT Accounts OFF;
END
GO

-- Kiểm tra xem tài khoản đã được thêm thành công chưa
SELECT * FROM Accounts WHERE Username = 'davidwilson';
GO
