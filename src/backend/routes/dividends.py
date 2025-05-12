from flask import Blueprint, jsonify, request
from ..db import get_sqlserver_connection
from datetime import datetime
from ..auth import verify_token, verify_hr

dividends_bp = Blueprint("dividends",__name__)

# Cổ đông (Dividend)
# Lấy toàn bộ danh sách Cổ đông
@dividends_bp.route("/api/dividends" , methods = ["GET"])
@verify_token
@verify_hr
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
    

# Thêm nhân viên
@dividends_bp.route("/api/dividend/add" , methods = ["POST"])
@verify_token
@verify_hr
def add_dividends():
    try:
        data = request.get_json()

        required_fields = [
            "employeeID" , "dividendAmount" , "dividendDate"
        ]

        missing_fields = [field for field in required_fields if field not in data or not data[field]]
        if missing_fields:
            return jsonify({"error": f"Missing fields : {', '.join(missing_fields)}"}), 400

        # Ket noi database
        sqlserver_conn = get_sqlserver_connection()
        sqlserver_cursor = sqlserver_conn.cursor()


        #LỆNH SQL_SERVER CHÈN
        query_sqlserver = """
            INSERT INTO Dividends
                (EmployeeID, DividendAmount , DividendDate , CreatedAt)
            OUTPUT INSERTED.DividendID
            VALUES
                (? , ? , ? , GETDATE())
        """


        #Lấy thời gian hiện tại
        current_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

        # THỰC THI LỆNH
        sqlserver_cursor.execute(query_sqlserver, (
            data["employeeID"],
            data["dividendAmount"],
            data["dividendDate"],
        )
        )
        new_dividend_id = sqlserver_cursor.fetchone()[0]
        print("✅ New ID with OUTPUT INSERTED:", new_dividend_id)
        sqlserver_conn.commit()

        # Đóng kết nối
        sqlserver_cursor.close()
        sqlserver_conn.close()


        return jsonify({
            'message': 'Dividend added successfully in database',
            'dividendID': new_dividend_id,
            'employeeID': data["employeeID"],
            'dividendAmount': data["dividendAmount"],
            'dividendDate': data["dividendDate"],
            'createdAt': current_time
        }), 201

    except Exception as e:
        print("Failed to add dividend: ",e)
        return jsonify({"error" : str(e)}),500
    
#Cập nhật cổ tức (dividendDate , dividendAmount)
@dividends_bp.route("/api/dividend/update/<int:dividend_id>", methods=["PUT"])
@verify_token
@verify_hr
def update_dividend(dividend_id):
    try:
        data = request.get_json()

        allowed_fields = {"dividendDate", "dividendAmount"}
        update_fields = {k: v for k, v in data.items() if k in allowed_fields and v is not None}

        #Kiểm tra
        if not update_fields:
            return jsonify({"error": "No valid fields provided for update"}), 400

        # SQL Server update
        sql_conn = get_sqlserver_connection()
        sql_cursor = sql_conn.cursor()

        set_clause_sql = ", ".join([f"{field} = ?" for field in update_fields])
        sql_query = f"""
            UPDATE Dividends
            SET {set_clause_sql}
            WHERE DividendID = ?
        """
        sql_cursor.execute(sql_query, list(update_fields.values()) + [dividend_id])
        sql_conn.commit()

        # Đóng kết nối
        sql_cursor.close()
        sql_conn.close()

        return jsonify({
            "message": "Dividend updated successfully",
            "dividendID": dividend_id,
            "updatedFields": list(update_fields.keys())
        }), 200

    except Exception as e:
        return jsonify({"error": f"Failed to update dividend: {str(e)}"}), 500

#Xóa cổ tức 
@dividends_bp.route("/api/dividend/delete/<int:dividend_id>", methods=["DELETE"])
@verify_token
@verify_hr
def delete_dividend(dividend_id):
    try:
        # SQL Server delete
        sql_conn = get_sqlserver_connection()
        sql_cursor = sql_conn.cursor()

        # Câu lệnh SQL để xóa bản ghi
        sql_query = """
            DELETE FROM Dividends
            WHERE DividendID = ?
        """
        sql_cursor.execute(sql_query, (dividend_id,))
        sql_conn.commit()

        # Kiểm tra xem có bản ghi nào bị xóa không
        if sql_cursor.rowcount == 0:
            return jsonify({"error": "Dividend not found"}), 404

        # Đóng kết nối
        sql_cursor.close()
        sql_conn.close()

        return jsonify({
            "message": "Dividend deleted successfully",
            "dividendID": dividend_id
        }), 200

    except Exception as e:
        return jsonify({"error": f"Failed to delete dividend: {str(e)}"}), 500
