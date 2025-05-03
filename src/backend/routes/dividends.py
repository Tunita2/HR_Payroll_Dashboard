from flask import Blueprint, jsonify
from db import get_mysql_connection , get_sqlserver_connection

dividends_bp = Blueprint("dividends",__name__)

# Cổ đông (Dividend)
# Lấy toàn bộ danh sách Cổ đông
@dividends_bp.route("/api/dividends" , methods = ["GET"])
def get_dividends():
    try:
        conn = get_sqlserver_connection()
        print("✅ Connected to DB successfully")
        cursor = conn.cursor()

        # Lấy dữ liệu từ bảng Employee để tạo employee_dict
        cursor.execute("SELECT EmployeeID, FullName FROM Employees")
        employees = cursor.fetchall()
        employee_dict = {row[0] : row[1] for row in employees}  
        
        # Gọi rõ từng cột
        cursor.execute("SELECT DividendID, EmployeeID, DividendAmount, DividendDate, CreatedAt FROM Dividends")
        dividends = []

        for row in cursor.fetchall():
            dividend = {
                "dividendID": row[0],
                "employeeID": row[1],
                "employeeName" : employee_dict.get(row[1] , "None"),
                "dividendAmount": f"{int(row[2]):,}₫".replace(",", ".") if row[2] else None,
                "dividendDate": row[3].strftime('%d-%m-%Y') if row[3] else None,
                "createdAt": row[4].strftime('%d-%m-%Y %H:%M:%S') if row[3] else None
            }
            dividends.append(dividend)
        
        return jsonify(dividends)
    except Exception as e:
        print("❌ Failed to connect to DB:", e)
        return jsonify({"error": str(e)}), 500 