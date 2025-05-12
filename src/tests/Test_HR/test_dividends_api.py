# tests/test_departments_api.py
import unittest
from unittest.mock import patch, MagicMock
from datetime import datetime
import jwt as pyjwt 

# JWT Secret Key - phải giống với secret key trong Node.js
JWT_SECRET = "123456"
class TestGetDividendsAPI(unittest.TestCase):
    def setUp(self):
        # Giả lập verify_token và verify_hr
        patcher1 = patch("backend.routes.dividends.verify_token", new=lambda f: f)  # Giữ nguyên xác thực token
        patcher2 = patch("backend.routes.dividends.verify_hr", new=lambda f: f)  # Giữ nguyên xác thực role
        patcher3 = patch("backend.routes.dividends.get_sqlserver_connection")

        self.addCleanup(patcher1.stop)
        self.addCleanup(patcher2.stop)
        self.addCleanup(patcher3.stop)

        patcher1.start()
        patcher2.start()
        self.mock_get_sqlserver_conn = patcher3.start()

        from backend.app import app
        self.client = app.test_client()

    def test_get_dividends_success(self):

        # Tạo mock dữ liệu từ Employees
        mock_employees = [(1, "Nguyễn Văn A"), (2, "Trần Thị B")]

        # Tạo mock dữ liệu từ Dividends
        mock_dividends = [
            (101, 1, 5000000, datetime(2024, 4, 20), datetime(2024, 4, 21, 10, 0, 0)),
            (102, 2, None, None, None)
        ]

        mock_cursor = MagicMock()
        mock_cursor.fetchall.side_effect = [mock_employees, mock_dividends]  # 2 lần gọi fetchall


        mock_conn = MagicMock()
        mock_conn.cursor.return_value = mock_cursor
        self.mock_get_sqlserver_conn.return_value = mock_conn

        # Giả lập token hợp lệ với role 'hr'
        token_payload = {"role": "hr"}
        token = pyjwt.encode(token_payload, JWT_SECRET, algorithm="HS256")

        response = self.client.get("/api/dividends", headers={"Authorization": f"Bearer {token}"})
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(len(data), 2)

        # Kiểm tra phần tử đầu tiên
        self.assertEqual(data[0]['dividendID'], 101)
        self.assertEqual(data[0]['employeeID'], 1)
        self.assertEqual(data[0]['employeeName'], "Nguyễn Văn A")
        self.assertEqual(data[0]['dividendAmount'], "5.000.000₫")
        self.assertEqual(data[0]['dividendDate'], "20-04-2024")
        self.assertEqual(data[0]['createdAt'], "21-04-2024 10:00:00")

        # Kiểm tra phần tử thứ hai (None cases)
        self.assertEqual(data[1]['dividendID'], 102)
        self.assertEqual(data[1]['employeeName'], "Trần Thị B")
        self.assertIsNone(data[1]['dividendAmount'])
        self.assertIsNone(data[1]['dividendDate'])
        self.assertIsNone(data[1]['createdAt'])


    def test_add_departments_success(self):
        mock_sqlserver_cursor = MagicMock()
        mock_sqlserver_conn = MagicMock()  
        mock_sqlserver_conn.cursor.return_value = mock_sqlserver_cursor
        self.mock_get_sqlserver_conn.return_value = mock_sqlserver_conn

        mock_sqlserver_cursor.fetchone.return_value = [123]

        token_payload = {"role": "hr"}
        token = pyjwt.encode(token_payload, JWT_SECRET, algorithm="HS256")

        request_data = {
            "employeeID": 1,
            "dividendAmount": 5000000,
            "dividendDate": "2024-05-01"
        }

        response = self.client.post("/api/dividend/add" , 
                                    json = request_data,
                                    headers = {"Authorization" : f"Bearer {token}"})
        
        self.assertEqual(response.status_code, 201)
        data = response.get_json()
        self.assertEqual(data["dividendID"], 123)
        self.assertEqual(data["employeeID"], request_data["employeeID"])
        self.assertEqual(data["dividendAmount"], request_data["dividendAmount"])
        self.assertEqual(data["dividendDate"], request_data["dividendDate"])
        self.assertIn("createdAt", data)  # thời gian tạo nên kiểm tra có key là đủ

    def test_update_dividends_success(self):
        # Mô phỏng SQL Server connection và cursor
        mock_sqlserver_cursor = MagicMock()
        mock_sqlserver_conn = MagicMock()
        mock_sqlserver_conn.cursor.return_value = mock_sqlserver_cursor
        self.mock_get_sqlserver_conn.return_value = mock_sqlserver_conn

        token_payload = {"role": "hr"}
        token = pyjwt.encode(token_payload, JWT_SECRET, algorithm="HS256")

        dividend_id = 1
        updated_data = {
            "dividendAmount": 8000000,
            "dividendDate": "2024-05-12"
        }

        response = self.client.put(f"/api/dividend/update/{dividend_id}", 
                                   json=updated_data,
                                   headers={"Authorization": f"Bearer {token}"})
        
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(data["dividendID"], dividend_id)
        self.assertEqual(set(data["updatedFields"]), set(updated_data.keys()))
        self.assertEqual(data["message"], "Dividend updated successfully")

    def test_delete_dividend_success(self):
        dividend_id = 5
        token_payload = {"role": "hr"}
        token = pyjwt.encode(token_payload, JWT_SECRET, algorithm="HS256")

        # Giả lập kết nối SQL Server
        mock_sqlserver_cursor = MagicMock()
        mock_sqlserver_conn = MagicMock()
        mock_sqlserver_conn.cursor.return_value = mock_sqlserver_cursor
        self.mock_get_sqlserver_conn.return_value = mock_sqlserver_conn

        # Giả lập có bản ghi bị xóa (rowcount = 1)
        mock_sqlserver_cursor.rowcount = 1

        # Gửi yêu cầu xóa phòng ban với tham số "force=true"
        response = self.client.delete(
            f"/api/dividend/delete/{dividend_id}", 
            headers={"Authorization": f"Bearer {token}"}
        )

        # Kiểm tra kết quả trả về
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(data["message"], "Dividend deleted successfully")
        self.assertEqual(data["dividendID"], dividend_id)