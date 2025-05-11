# tests/test_departments_api.py
import unittest
from unittest.mock import patch, MagicMock
from datetime import datetime
import jwt as pyjwt 

# JWT Secret Key - phải giống với secret key trong Node.js
JWT_SECRET = "123456"
class TestGetDepartmentsAPI(unittest.TestCase):
    def setUp(self):
        # Giả lập verify_token và verify_hr
        patcher1 = patch("backend.routes.departments.verify_token", new=lambda f: f)  # Giữ nguyên xác thực token
        patcher2 = patch("backend.routes.departments.verify_hr", new=lambda f: f)  # Giữ nguyên xác thực role
        patcher3 = patch("backend.routes.departments.get_sqlserver_connection")
        patcher4 = patch("backend.routes.departments.get_mysql_connection")

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

    def test_get_departments_success(self):
        mock_cursor = MagicMock()
        mock_cursor.fetchall.return_value = [
            (1, "Phòng Kỹ thuật", datetime(2024, 5, 1, 10, 0, 0), datetime(2024, 5, 5, 15, 30, 0)),
            (2, "Phòng Nhân sự", None, None)
        ]
        mock_conn = MagicMock()
        mock_conn.cursor.return_value = mock_cursor
        self.mock_get_sqlserver_conn.return_value = mock_conn

        # Giả lập token hợp lệ với role 'hr'
        token_payload = {"role": "hr"}
        token = pyjwt.encode(token_payload, JWT_SECRET, algorithm="HS256")

        response = self.client.get("/api/departments", headers={"Authorization": f"Bearer {token}"})
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(len(data), 2)

    def test_add_departments_success(self):
        mock_sqlserver_cursor = MagicMock()
        mock_sqlserver_conn = MagicMock()  
        mock_sqlserver_conn.cursor.return_value = mock_sqlserver_cursor
        self.mock_get_sqlserver_conn.return_value = mock_sqlserver_conn

        mock_mysql_cursor = MagicMock()
        mock_mysql_conn = MagicMock()
        mock_mysql_conn.cursor.return_value = mock_mysql_cursor
        self.mock_get_mysql_conn.return_value = mock_mysql_conn

        department_name = "Phòng Marketing"
        token_payload = {"role": "hr"}
        token = pyjwt.encode(token_payload, JWT_SECRET, algorithm="HS256")

        # Mô phỏng trường hợp không có phòng ban nào trong cơ sở dữ liệu
        mock_sqlserver_cursor.fetchone.return_value = [0] # Không có phòng ban trùng tên trong SQL Server
        mock_mysql_cursor.fetchone.return_value = [0] # Không có phòng ban trùng tên trong MySQL

        response = self.client.post("/api/department/add" , 
                                    json = {"departmentName" : department_name},
                                    headers = {"Authorization" : f"Bearer {token}"})
        
        #Kiểm tra mã trạng thái trả về là 201 (tạo thành công)
        self.assertEqual(response.status_code , 201)
        data = response.get_json()
        self.assertEqual(data["departmentName"],department_name)
        self.assertTrue("id" in data)

    def test_update_department_success(self):
        # Mô phỏng SQL Server connection và cursor
        mock_sqlserver_cursor = MagicMock()
        mock_sqlserver_conn = MagicMock()
        mock_sqlserver_conn.cursor.return_value = mock_sqlserver_cursor
        self.mock_get_sqlserver_conn.return_value = mock_sqlserver_conn

        # Mô phỏng MySQL connection và cursor
        mock_mysql_cursor = MagicMock()
        mock_mysql_conn = MagicMock()
        mock_mysql_conn.cursor.return_value = mock_mysql_cursor
        self.mock_get_mysql_conn.return_value = mock_mysql_conn

        department_id = 1
        department_name = "Phòng Kỹ Thuật Mới"
        token_payload = {"role": "hr"}
        token = pyjwt.encode(token_payload, JWT_SECRET, algorithm="HS256")

         # Mô phỏng phòng ban tồn tại trong cả 2 DB
        mock_sqlserver_cursor.fetchone.return_value = [1]
        mock_mysql_cursor.fetchone.return_value = [1]

        # Mô phỏng câu lệnh UPDATE thành công
        mock_sqlserver_cursor.rowcount = 1
        mock_mysql_cursor.rowcount = 1

        response = self.client.put(f"/api/department/update/{department_id}", 
                                   json={"departmentName": department_name},
                                   headers={"Authorization": f"Bearer {token}"})
        
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(data['departmentName'], department_name)
        self.assertEqual(data['id'], department_id)
        self.assertTrue('updatedAt' in data)

    def test_delete_department_success(self):
        department_id = 10
        token_payload = {"role": "hr"}
        token = pyjwt.encode(token_payload, JWT_SECRET, algorithm="HS256")

        # Giả lập kết nối SQL Server
        mock_sqlserver_cursor = MagicMock()
        mock_sqlserver_conn = MagicMock()
        mock_sqlserver_conn.cursor.return_value = mock_sqlserver_cursor
        self.mock_get_sqlserver_conn.return_value = mock_sqlserver_conn

        # Giả lập kết nối MySQL
        mock_mysql_cursor = MagicMock()
        mock_mysql_conn = MagicMock()
        mock_mysql_conn.cursor.return_value = mock_mysql_cursor
        self.mock_get_mysql_conn.return_value = mock_mysql_conn

        # Giả lập kiểm tra tồn tại phòng ban trong SQL Server và MySQL
        mock_sqlserver_cursor.fetchone.return_value = [1]  # Phòng ban tồn tại trong SQL Server
        mock_mysql_cursor.fetchone.return_value = [1]  # Phòng ban tồn tại trong MySQL

        # Giả lập không có nhân viên trong phòng ban (không có ràng buộc dữ liệu)
        mock_sqlserver_cursor.execute.return_value = None  # Không có nhân viên trong SQL Server
        mock_mysql_cursor.execute.return_value = None  # Không có nhân viên trong MySQL

        # Giả lập việc xóa phòng ban thành công
        mock_sqlserver_cursor.rowcount = 1  # Thao tác xóa thành công trong SQL Server
        mock_mysql_cursor.rowcount = 1  # Thao tác xóa thành công trong MySQL

        # Gửi yêu cầu xóa phòng ban với tham số "force=true"
        response = self.client.delete(f"/api/department/delete/{department_id}?force=true", 
                                      headers={"Authorization": f"Bearer {token}"})

        # Kiểm tra kết quả trả về
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIn('message', data)
        self.assertEqual(data['message'], f'Department ID {department_id} deleted successfully from both databases')