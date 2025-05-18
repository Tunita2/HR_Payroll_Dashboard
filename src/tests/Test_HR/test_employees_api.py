# tests/test_employees_api.py
import unittest
from unittest.mock import patch, MagicMock
from datetime import datetime
import jwt as pyjwt 

# JWT Secret Key - phải giống với secret key trong Node.js
JWT_SECRET = "123456"
class TestGetEmployeesAPI(unittest.TestCase):
    def setUp(self):
        # Giả lập verify_token và verify_hr
        patcher1 = patch("backend.routes.employees.verify_token", new=lambda f: f)  # Giữ nguyên xác thực token
        patcher2 = patch("backend.routes.employees.verify_hr", new=lambda f: f)  # Giữ nguyên xác thực role
        patcher3 = patch("backend.routes.employees.get_sqlserver_connection")
        patcher4 = patch("backend.routes.employees.get_mysql_connection")

        self.addCleanup(patcher1.stop)
        self.addCleanup(patcher2.stop)
        self.addCleanup(patcher3.stop)
        self.addCleanup(patcher4.stop)

        patcher1.start()
        patcher2.start()
        self.mock_get_sqlserver_conn = patcher3.start()
        self.mock_get_mysql_conn = patcher4.start()

        from backend.app import app
        self.client = app.test_client()

    def test_get_employees_success(self):
        # Giả lập cursor và kết nối SQL Server
        mock_cursor = MagicMock()

        # Mô phỏng dữ liệu từ bảng Departments
        mock_cursor.fetchall.side_effect = [
            [(1, "Phòng Kỹ thuật"), (2, "Phòng Nhân sự")], # Dữ liệu Departments
            [(1, "Kỹ sư"), (2, "Nhân viên")],             # Dữ liệu Positions
            [                                             # Dữ liệu Employees
                (1, "Nguyễn Văn A", datetime(1990, 5, 1), "Nam", "0123456789", "a@example.com", datetime(2020, 6, 1), 1, 1, "Active", datetime(2020, 6, 1), datetime(2021, 6, 1)),
                (2, "Trần Thị B", datetime(1992, 7, 15), "Nữ", "0987654321", "b@example.com", datetime(2021, 1, 1), 2, 2, "Inactive", datetime(2021, 1, 1), datetime(2022, 1, 1))
            ]
        ]   

        mock_cursor.execute.return_value = None

        # Giả lập kết nối SQL Server
        mock_conn = MagicMock()
        mock_conn.cursor.return_value = mock_cursor
        self.mock_get_sqlserver_conn.return_value = mock_conn

        # Giả lập token hợp lệ với role 'hr'
        token_payload = {"role": "hr"}
        token = pyjwt.encode(token_payload, JWT_SECRET, algorithm="HS256")

        # Gửi yêu cầu GET đến API /api/employees
        response = self.client.get("/api/employees", headers={"Authorization": f"Bearer {token}"})

        # Kiểm tra mã trạng thái trả về là 200
        self.assertEqual(response.status_code, 200)

        # Kiểm tra dữ liệu trả về
        data = response.get_json()
        # print(data)  # In kết quả trả về từ API
        self.assertEqual(len(data), 2)  # Kiểm tra chỉ có 2 nhân viên trả về

        # # Kiểm tra thông tin nhân viên đầu tiên
        employee = data[0]
        self.assertEqual(employee["employeeID"], 1)
        self.assertEqual(employee["fullName"], "Nguyễn Văn A")
        self.assertEqual(employee["dateOfBirth"], "01-05-1990")
        self.assertEqual(employee["gender"], "Nam")
        self.assertEqual(employee["phoneNumber"], "0123456789")
        self.assertEqual(employee["email"], "a@example.com")
        self.assertEqual(employee["hireDate"], "01-06-2020")
        self.assertEqual(employee["departmentName"], "Phòng Kỹ thuật")
        self.assertEqual(employee["positionName"], "Kỹ sư")
        self.assertEqual(employee["status"], "Active")
        self.assertEqual(employee["createdAt"], "01-06-2020 00:00:00")
        self.assertEqual(employee["updatedAt"], "01-06-2021 00:00:00")

        # # Kiểm tra thông tin nhân viên thứ hai
        employee = data[1]
        self.assertEqual(employee["employeeID"], 2)
        self.assertEqual(employee["fullName"], "Trần Thị B")
        self.assertEqual(employee["dateOfBirth"], "15-07-1992")
        self.assertEqual(employee["gender"], "Nữ")
        self.assertEqual(employee["phoneNumber"], "0987654321")
        self.assertEqual(employee["email"], "b@example.com")
        self.assertEqual(employee["hireDate"], "01-01-2021")
        self.assertEqual(employee["departmentName"], "Phòng Nhân sự")
        self.assertEqual(employee["positionName"], "Nhân viên")
        self.assertEqual(employee["status"], "Inactive")
        self.assertEqual(employee["createdAt"], "01-01-2021 00:00:00")
        self.assertEqual(employee["updatedAt"], "01-01-2022 00:00:00")




    def test_add_employee_success(self):
        # Giả lập cursor và kết nối SQL Server
        mock_sqlserver_cursor = MagicMock()
        mock_sqlserver_conn = MagicMock()
        mock_sqlserver_conn.cursor.return_value = mock_sqlserver_cursor
        self.mock_get_sqlserver_conn.return_value = mock_sqlserver_conn

        # Giả lập cursor và kết nối MySQL
        mock_mysql_cursor = MagicMock()
        mock_mysql_conn = MagicMock()
        mock_mysql_conn.cursor.return_value = mock_mysql_cursor
        self.mock_get_mysql_conn.return_value = mock_mysql_conn

        # Dữ liệu test (nhân viên mới)
        new_employee_data = {
            "fullName": "Nguyễn Văn C",
            "dateOfBirth": "1995-12-25",
            "gender": "Nam",
            "phoneNumber": "0123456789",
            "email": "c@example.com",
            "hireDate": "2022-01-01",
            "departmentID": 1,  # Đảm bảo có ID phòng ban hợp lệ
            "positionID": 1,  # Đảm bảo có ID vị trí hợp lệ
            "status": "Active",
            "role": "employee"
        }

        # Mô phỏng hành vi khi thực thi truy vấn SQL Server và MySQL
        # Giả lập trả về ID của nhân viên mới cho cả SQL Server và MySQL
        mock_sqlserver_cursor.fetchone.return_value = [1]  # Mô phỏng trả về ID nhân viên mới

        # Giả lập các truy vấn kiểm tra sự tồn tại của DepartmentID và PositionID
        mock_sqlserver_cursor.execute.side_effect = [
            # Mô phỏng truy vấn để kiểm tra PositionID và DepartmentID có hợp lệ
            [1],  # Giả lập trả về ID hợp lệ cho PositionID
            [1]   # Giả lập trả về ID hợp lệ cho DepartmentID
        ]

        # Giả lập token hợp lệ với role 'hr'
        token_payload = {"role": "hr"}
        token = pyjwt.encode(token_payload, JWT_SECRET, algorithm="HS256")

        # Giả lập truy vấn SQL Server kiểm tra `PositionID` và `DepartmentID` có tồn tại trong bảng
        mock_sqlserver_cursor.execute.return_value = None  # Giả lập truy vấn INSERT thành công

        # Giả lập truy vấn MySQL để chèn nhân viên
        mock_mysql_cursor.execute.return_value = None  # Giả lập truy vấn INSERT MySQL thành công

        # Gửi yêu cầu POST đến API /api/employee/add
        response = self.client.post("/api/employee/add", 
                                    json=new_employee_data,
                                    headers={"Authorization": f"Bearer {token}"})

        # Kiểm tra mã trạng thái trả về là 201 (tạo thành công)
        self.assertEqual(response.status_code, 201)
        
        # Kiểm tra dữ liệu trả về
        data = response.get_json()
        self.assertTrue("employeeID" in data)  # Kiểm tra có trường employeeID
        self.assertEqual(data["fullName"], new_employee_data["fullName"])
        self.assertEqual(data["status"], new_employee_data["status"])
        self.assertEqual(data["hireDate"], new_employee_data["hireDate"])
        
        # Kiểm tra dữ liệu có đầy đủ trường được trả về
        self.assertTrue("createdAt" in data)
        self.assertTrue("updatedAt" in data)
        self.assertTrue("departmentID" in data)
        
        # Kiểm tra các phương thức đã được gọi đúng
        mock_sqlserver_cursor.execute.assert_called()
        mock_sqlserver_conn.commit.assert_called()
        mock_mysql_cursor.execute.assert_called()
        mock_mysql_conn.commit.assert_called()

    def test_update_employee_success(self):
        # Mô phỏng kết nối và cursor cho SQL Server
        mock_sqlserver_cursor = MagicMock()
        mock_sqlserver_conn = MagicMock()
        mock_sqlserver_conn.cursor.return_value = mock_sqlserver_cursor
        self.mock_get_sqlserver_conn.return_value = mock_sqlserver_conn

        # Mô phỏng kết nối và cursor cho MySQL
        mock_mysql_cursor = MagicMock()
        mock_mysql_conn = MagicMock()
        mock_mysql_conn.cursor.return_value = mock_mysql_cursor
        self.mock_get_mysql_conn.return_value = mock_mysql_conn

        # Thông tin nhân viên cần cập nhật
        employee_id = 1
        update_data = {
            "departmentID": 2,
            "positionID": 3,
            "status": "Active"
        }

        token_payload = {"role": "hr"}
        token = pyjwt.encode(token_payload, JWT_SECRET, algorithm="HS256")

        # Mô phỏng hành vi khi truy vấn SQL Server và MySQL
        mock_sqlserver_cursor.fetchone.return_value = [1]  # Nhân viên tồn tại trong SQL Server
        mock_mysql_cursor.fetchone.return_value = [1]  # Nhân viên tồn tại trong MySQL

        # Mô phỏng câu lệnh UPDATE thành công trong SQL Server và MySQL
        mock_sqlserver_cursor.rowcount = 1
        mock_mysql_cursor.rowcount = 1

        # Gửi yêu cầu PUT đến API /api/employee/update
        response = self.client.put(f"/api/employee/update/{employee_id}",
                                json=update_data,
                                headers={"Authorization": f"Bearer {token}"})

        # Kiểm tra mã trạng thái trả về là 200
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(data["employeeID"], employee_id)
        self.assertEqual(data["updatedFields"], list(update_data.keys()))
        self.assertIn("message", data)
        self.assertEqual(data["message"], "Employee updated successfully")

    def test_delete_employee_success(self):
        # Mô phỏng kết nối và cursor cho SQL Server
        mock_sqlserver_cursor = MagicMock()
        mock_sqlserver_conn = MagicMock()
        mock_sqlserver_conn.cursor.return_value = mock_sqlserver_cursor
        self.mock_get_sqlserver_conn.return_value = mock_sqlserver_conn

        # Mô phỏng kết nối và cursor cho MySQL
        mock_mysql_cursor = MagicMock()
        mock_mysql_conn = MagicMock()
        mock_mysql_conn.cursor.return_value = mock_mysql_cursor
        self.mock_get_mysql_conn.return_value = mock_mysql_conn

        employee_id = 1
        token_payload = {"role": "hr"}
        token = pyjwt.encode(token_payload, JWT_SECRET, algorithm="HS256")

        mock_sqlserver_cursor.fetchone.side_effect = [
            [0], # Kết quả COUNT(*) Dividends
            [0], # Kết quả COUNT(*) accounts
            # Thêm các kết quả fetchone khác nếu API gọi fetchone sau các lệnh execute khác (ví dụ kiểm tra tồn tại)
            # Ví dụ: [1] nếu có kiểm tra tồn tại nhân viên trước khi xóa
        ]

        mock_mysql_cursor.fetchone.side_effect = [
            [0], # Kết quả COUNT(*) salaries
            [0], # Kết quả COUNT(*) attendance
             # Thêm các kết quả fetchone khác tương tự
        ]


        # Mô phỏng xóa thành công trong SQL Server và MySQL
        mock_sqlserver_cursor.rowcount = 1
        mock_mysql_cursor.rowcount = 1

        # Gửi yêu cầu DELETE đến API /api/employee/delete
        response = self.client.delete(f"/api/employee/delete/{employee_id}",
                                    headers={"Authorization": f"Bearer {token}"})

        # Kiểm tra mã trạng thái trả về là 200
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIn("message", data)
        self.assertEqual(data["message"], f"Đã xoá nhân viên {employee_id} thành công")
            