import pyodbc
import mysql.connector
from datetime import datetime


# ✅ Kết nối Sql Server (HUMAN) - Sử dụng dữ liệu mẫu
def get_sqlserver_connection():
    try:
        conn_sqlServer = pyodbc.connect(
            r"DRIVER={ODBC Driver 17 for SQL Server};"
            r"SERVER=ASUSCUAHIEU;"
            r"DATABASE=HUMAN;"
            r"Trusted_Connection=yes;"
        )
        return conn_sqlServer
    except Exception as e:
        print(f"❌ Failed to connect to DB: {e}")
        return None


# ✅ Kết nối MySQL (payroll) - Sử dụng dữ liệu mẫu
def get_mysql_connection():
    try:
        conn_mySql = mysql.connector.connect(
            host="localhost", user="root", password="123456", database="payroll"
        )
        return conn_mySql
    except Exception as e:
        print(f"❌ Failed to connect to MySQL: {e}")
        return None


# Dữ liệu mẫu cho employees
def get_sample_employees():
    return [
        {
            "id": 1,
            "employeeId": "EMP001",
            "fullName": "Nguyễn Văn A",
            "email": "nguyenvana@example.com",
            "phone": "0901234567",
            "departmentId": 1,
            "departmentName": "IT",
            "positionId": 1,
            "positionName": "Developer",
            "status": "Active",
            "createdAt": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "updatedAt": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        },
        {
            "id": 2,
            "employeeId": "EMP002",
            "fullName": "Trần Thị B",
            "email": "tranthib@example.com",
            "phone": "0901234568",
            "departmentId": 2,
            "departmentName": "HR",
            "positionId": 2,
            "positionName": "Manager",
            "status": "Active",
            "createdAt": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "updatedAt": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        },
        {
            "id": 3,
            "employeeId": "EMP003",
            "fullName": "Lê Văn C",
            "email": "levanc@example.com",
            "phone": "0901234569",
            "departmentId": 3,
            "departmentName": "Finance",
            "positionId": 3,
            "positionName": "Accountant",
            "status": "Active",
            "createdAt": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "updatedAt": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        },
    ]


# Dữ liệu mẫu cho departments
def get_sample_departments():
    return [
        {
            "id": 1,
            "departmentName": "IT",
            "createdAt": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "updatedAt": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        },
        {
            "id": 2,
            "departmentName": "HR",
            "createdAt": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "updatedAt": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        },
        {
            "id": 3,
            "departmentName": "Finance",
            "createdAt": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "updatedAt": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        },
    ]


# Dữ liệu mẫu cho positions
def get_sample_positions():
    return [
        {
            "id": 1,
            "positionName": "Developer",
            "createdAt": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "updatedAt": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        },
        {
            "id": 2,
            "positionName": "Manager",
            "createdAt": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "updatedAt": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        },
        {
            "id": 3,
            "positionName": "Accountant",
            "createdAt": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "updatedAt": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        },
    ]
