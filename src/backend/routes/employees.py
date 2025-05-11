from flask import Blueprint, jsonify, request
from ..db import get_mysql_connection, get_sqlserver_connection
from datetime import datetime
import unicodedata
import re
from ..auth import verify_token, verify_hr

employees_bp = Blueprint("employees",__name__)

def convert_fullname_to_username(full_name):
    # 1. Chuẩn hóa unicode và loại bỏ dấu tiếng Việt
    normalized = unicodedata.normalize('NFD', full_name)
    no_accent = ''.join([c for c in normalized if unicodedata.category(c) != 'Mn'])

    # 2. Xóa khoảng trắng, chuyển thành chữ thường
    username = re.sub(r'\s+', '', no_accent).lower()

    return username

@employees_bp.route("/api/employees",methods = ["GET"])
@verify_token
@verify_hr
def get_employees():
    try:
        conn = get_sqlserver_connection()
        print("✅ Connected to DB successfully")
        cursor = conn.cursor()

        # Lấy dữ liệu từ bảng Departments để tạo department_dict
        cursor.execute("SELECT DepartmentID, DepartmentName FROM Departments")
        departments = cursor.fetchall()
        department_dict = {row[0]: row[1] for row in departments}

        #Lấy dữ liệu từ bảng Positions để tạo position_dict
        cursor.execute("SELECT PositionID, PositionName FROM Positions")
        positions = cursor.fetchall()
        position_dict = {row[0] : row[1] for row in positions}

        # Gọi rõ từng cột
        cursor.execute("SELECT EmployeeID, FullName,DateOfBirth,Gender,PhoneNumber,Email,HireDate,DepartmentID,PositionID,Status, CreatedAt, UpdatedAt FROM Employees")
        employees = []

        for row in cursor.fetchall():
            employee = {
                "employeeID": row[0],
                "fullName": row[1],
                "dateOfBirth" : row[2].strftime('%d-%m-%Y') if row[2] else None,
                "gender" : row[3],
                "phoneNumber" : row[4],
                "email" : row[5],
                "hireDate" : row[6].strftime('%d-%m-%Y') if row[6] else None,
                "departmentName" : department_dict.get(row[7],"None"),
                "positionName" : position_dict.get(row[8],"None"),
                "status" : row[9],
                "createdAt": row[10].strftime('%d-%m-%Y %H:%M:%S') if row[2] else None,  # convert datetime to string
                "updatedAt": row[11].strftime('%d-%m-%Y %H:%M:%S') if row[3] else None
            }
            employees.append(employee)

        return jsonify(employees)
    except Exception as e:
        print("❌ Failed to connect to DB:", e)
        return jsonify({"error": str(e)}), 500


# Thêm nhân viên
@employees_bp.route("/api/employee/add" , methods = ["POST"])
@verify_token
@verify_hr
def add_employees():
    try:
        data = request.get_json()

        required_fields = [
            "fullName" , "dateOfBirth" , "gender" , "phoneNumber" , "email",
            "hireDate" , "departmentID" , "positionID" , "status" , "role"
        ]

        missing_fields = [field for field in required_fields if field not in data or not data[field]]
        if missing_fields:
            return jsonify({"error": f"Missing fields : {', '.join(missing_fields)}"}), 400

        # Ket noi database
        sqlserver_conn = get_sqlserver_connection()
        sqlserver_cursor = sqlserver_conn.cursor()

        mysql_conn = get_mysql_connection()
        mysql_cursor = mysql_conn.cursor()

        #LỆNH SQL_SERVER CHÈN
        query_sqlserver = """
            INSERT INTO Employees
                (FullName, DateOfBirth , Gender , PhoneNumber, Email, HireDate,
                DepartmentID, PositionID, Status, CreatedAt , UpdatedAt)
            OUTPUT INSERTED.EmployeeID
            VALUES
                (? , ? , ? , ? , ? , ? , ? , ? , ? , GETDATE() , GETDATE())
        """
        query_sqlserver_account = """
            INSERT INTO accounts
                (EmployeeID , Username, PasswordHash , CreatedAt , UpdatedAt , Role)
            VALUES
                (? , ? , ? , GETDATE() , GETDATE() , ?)
        """

        #LỆNH MYSQL CHÈN
        query_mysql = """
            INSERT INTO employees
                (EmployeeID , FullName , DepartmentID , PositionID , Status)
            VALUES
                (%s , %s , %s , %s , %s)
        """

        #Lấy thời gian hiện tại
        current_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

        # THỰC THI LỆNH
        sqlserver_cursor.execute(query_sqlserver, (
            data["fullName"],
            data["dateOfBirth"],
            data["gender"],
            data["phoneNumber"],
            data["email"],
            data["hireDate"],
            data["departmentID"],
            data["positionID"],
            data["status"]
        )
        )

        # Chuyển tên TK
        full_name = data.get("fullName", "")
        username = convert_fullname_to_username(full_name)

        # sqlserver_cursor.execute("SELECT SCOPE_IDENTITY()")
        new_employee_id = sqlserver_cursor.fetchone()[0]
        print("✅ New ID with OUTPUT INSERTED:", new_employee_id)
        sqlserver_conn.commit()

        sqlserver_cursor.execute(query_sqlserver_account,(new_employee_id, username , data["phoneNumber"], data["role"] ))
        sqlserver_conn.commit()

        mysql_cursor.execute(query_mysql , (new_employee_id, data["fullName"], data["departmentID"], data["positionID"], data["status"]))
        mysql_conn.commit()
        print("✅ Inserted into MySQL successfully")

        # Đóng kết nối
        sqlserver_cursor.close()
        sqlserver_conn.close()
        mysql_cursor.close()
        mysql_conn.close()

        return jsonify({
            'message': 'Employee added successfully in both databases',
            'employeeID': new_employee_id,
            'fullName': data["fullName"],
            'departmentID': data["departmentID"],
            'status': data["status"],
            'hireDate': data["hireDate"],
            'createdAt': current_time,
            'updatedAt': current_time
        }), 201

    except Exception as e:
        print("Failed to add employee: ",e)
        return jsonify({"error" : str(e)}),500


#Cập nhật nhân viên (phòng ban , vị trí , status)
@employees_bp.route("/api/employee/update/<int:employee_id>", methods=["PUT"])
@verify_token
@verify_hr
def update_employee(employee_id):
    try:
        data = request.get_json()

        allowed_fields = {"departmentID", "positionID", "status"}
        update_fields = {k: v for k, v in data.items() if k in allowed_fields and v is not None}

        #Kiểm tra
        if not update_fields:
            return jsonify({"error": "No valid fields provided for update"}), 400

        # SQL Server update
        sql_conn = get_sqlserver_connection()
        sql_cursor = sql_conn.cursor()

        set_clause_sql = ", ".join([f"{field} = ?" for field in update_fields])
        sql_query = f"""
            UPDATE Employees
            SET {set_clause_sql}, UpdatedAt = GETDATE()
            WHERE EmployeeID = ?
        """
        sql_cursor.execute(sql_query, list(update_fields.values()) + [employee_id])
        sql_conn.commit()

        # MySQL update
        mysql_conn = get_mysql_connection()
        mysql_cursor = mysql_conn.cursor()

        set_clause_mysql = ", ".join([f"{field} = %s" for field in update_fields])
        mysql_query = f"""
            UPDATE employees
            SET {set_clause_mysql}
            WHERE EmployeeID = %s
        """
        mysql_cursor.execute(mysql_query, list(update_fields.values()) + [employee_id])
        mysql_conn.commit()

        # Đóng kết nối
        sql_cursor.close()
        sql_conn.close()
        mysql_cursor.close()
        mysql_conn.close()

        return jsonify({
            "message": "Employee updated successfully",
            "employeeID": employee_id,
            "updatedFields": list(update_fields.keys())
        }), 200

    except Exception as e:
        return jsonify({"error": f"Failed to update employee: {str(e)}"}), 500

# Xóa nhân viên bằng ID
@employees_bp.route("/api/employee/delete/<int:employee_id>", methods=["DELETE"])
@verify_token
@verify_hr
def delete_employee(employee_id):
    sqlserver_deleted = False
    mysql_deleted = False
    errors = []

    force_delete = request.args.get("force", "false").lower() == "true"

    try:
        # SQL Server and MySQL
        sql_conn = get_sqlserver_connection()
        sql_cursor = sql_conn.cursor()

        mysql_conn = get_mysql_connection()
        mysql_cursor = mysql_conn.cursor()


        # Kiểm tra ràng buộc khóa ngoại trong bảng Dividend
        sql_cursor.execute("SELECT COUNT(*) FROM Dividends WHERE EmployeeID = ?", (employee_id,))
        dividend_count = sql_cursor.fetchone()[0]

        sql_cursor.execute("SELECT COUNT(*) FROM accounts WHERE EmployeeID = ?", (employee_id,))
        account_count = sql_cursor.fetchone()[0]

        mysql_cursor.execute("SELECT COUNT(*) FROM salaries WHERE EmployeeID = %s", (employee_id,))
        salaries_count_mysql = mysql_cursor.fetchone()[0]

        mysql_cursor.execute("SELECT COUNT(*) FROM attendance WHERE EmployeeID = %s", (employee_id,))
        attendance_count_mysql = mysql_cursor.fetchone()[0]

        if (dividend_count > 0 or salaries_count_mysql > 0 or account_count > 0 or attendance_count_mysql > 0) and not force_delete:
            return jsonify({
                "error": "Ràng buộc dữ liệu",
                "message": f"Nhân viên ID {employee_id} đang được có dữ liệu ràng buộc trong bảng Dividend hoặc salaries.",
                "hasDependencies": True
            }), 409  
        else:
            sql_cursor.execute("DELETE FROM Dividends WHERE EmployeeID = ?", (employee_id,))
            sql_cursor.execute("DELETE FROM accounts WHERE EmployeeID = ?", (employee_id,))
            sql_cursor.execute("DELETE FROM Employees WHERE EmployeeID = ?", (employee_id,))
            sql_conn.commit()

            mysql_cursor.execute("DELETE FROM salaries WHERE EmployeeID = %s", (employee_id,))
            mysql_cursor.execute("DELETE FROM attendance WHERE EmployeeID = %s", (employee_id,))
            mysql_cursor.execute("DELETE FROM employees WHERE EmployeeID = %s", (employee_id,))
            mysql_conn.commit()

            if mysql_cursor.rowcount > 0 and sql_cursor.rowcount > 0:
                mysql_deleted = True
                sqlserver_deleted = True
            else:
                errors.append("Không tìm thấy nhân viên trong MySQL")

        sql_cursor.close()
        sql_conn.close()
        
        mysql_cursor.close()
        mysql_conn.close()

    except Exception as e:
        errors.append(f"Lỗi hệ thống: {str(e)}")

    # Xử lý kết quả
    if sqlserver_deleted or mysql_deleted:
        return jsonify({"message": f"Đã xoá nhân viên {employee_id} thành công"}), 200
    elif errors:
        return jsonify({"error": "Không thể xoá nhân viên", "details": errors}), 400
    else:
        return jsonify({"error": "Không thể xoá nhân viên vì lý do không xác định"}), 500
