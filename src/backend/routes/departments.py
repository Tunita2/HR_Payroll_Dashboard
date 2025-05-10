from flask import Blueprint, jsonify, request
from db import get_mysql_connection, get_sqlserver_connection
from datetime import datetime
from auth import verify_token, verify_hr

departments_bp = Blueprint("departmens",__name__)

# PHÒNG BAN (Departments)
# Lấy toàn bộ danh sách PHÒNG BAN
@departments_bp.route("/api/departments" , methods = ["GET"])
@verify_token
@verify_hr
def get_departments():
    try:
        conn = get_sqlserver_connection()
        print("✅ Connected to DB successfully")
        cursor = conn.cursor()

        # Gọi rõ từng cột
        cursor.execute("SELECT DepartmentID, DepartmentName, CreatedAt, UpdatedAt FROM Departments")
        departments = []

        for row in cursor.fetchall():
            department = {
                "id": row[0],
                "departmentName": row[1],
                "createdAt": row[2].strftime('%d-%m-%Y %H:%M:%S') if row[2] else None,  # convert datetime to string
                "updatedAt": row[3].strftime('%d-%m-%Y %H:%M:%S') if row[3] else None
            }
            departments.append(department)

        return jsonify(departments)
    except Exception as e:
        print("❌ Failed to connect to DB:", e)
        return jsonify({"error": str(e)}), 500


# Thêm phòng ban vào database
@departments_bp.route('/api/department/add', methods=['POST'])
@verify_token
@verify_hr
def add_department():
    try:
        data = request.get_json()
        print("Received data:", data)  # Kiểm tra dữ liệu nhận được
        department_name = data.get('departmentName')

        # ❌ Validate rỗng
        if not department_name or department_name.strip() == "":
            return jsonify({'error': 'Department name is required'}), 400

        # Kết nối database (SQL SERVER VÀ MYSQL)
        sqlserver_conn = get_sqlserver_connection()
        sqlserver_cursor = sqlserver_conn.cursor()

        mysql_conn = get_mysql_connection()
        mysql_cursor = mysql_conn.cursor()

        # 🔍 Kiểm tra trùng tên (không phân biệt hoa thường)
        sqlserver_cursor.execute("SELECT COUNT(*) FROM Departments WHERE LOWER(DepartmentName) = LOWER(?)", (department_name,))
        sqlserver_count = sqlserver_cursor.fetchone()[0]

        mysql_cursor.execute("SELECT COUNT(*) FROM departments WHERE LOWER(DepartmentName) = LOWER(%s)" , (department_name,))
        mysql_count = mysql_cursor.fetchone()[0]

        if sqlserver_count > 0 or mysql_count > 0:
            return jsonify({'error': f"Department '{department_name}' already exists."}), 409

        # 🕒 Lấy thời gian hiện tại
        current_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')


        # ✅ Thêm vào bảng SQL Server
        sqlserver_cursor.execute("""
            INSERT INTO Departments (DepartmentName, CreatedAt, UpdatedAt)
            OUTPUT INSERTED.DepartmentID
            VALUES (?, ?, ?)
        """, (department_name, current_time, current_time))


        new_id = sqlserver_cursor.fetchone()[0]
        print("✅ New ID with OUTPUT INSERTED:", new_id)
        sqlserver_conn.commit()

        # ✅ Thêm vào bảng MySQL
        mysql_cursor.execute("""
            INSERT INTO departments (DepartmentID, DepartmentName)
            VALUES (%s, %s)
        """, (new_id, department_name))
        mysql_conn.commit()
        print("✅ Inserted into MySQL successfully")


        # Đóng kết nối
        mysql_cursor.close()
        mysql_conn.close()
        sqlserver_cursor.close()
        sqlserver_conn.close()

        return jsonify({
            'id': new_id,
            'departmentName': department_name,
            'createdAt': current_time,
            'updatedAt': current_time
        }), 201

    except Exception as e:
        print("❌ Error adding department:", e)
        return jsonify({'error': 'Failed to add department'}), 500

# Cập nhật phòng ban
@departments_bp.route('/api/department/update/<int:id>', methods=['PUT'])
@verify_token
@verify_hr
def update_department(id):
    try:
        data = request.get_json()
        department_name = data.get('departmentName', '').strip()

        if not department_name:
            return jsonify({'error': 'Department name is required'}), 400

        updated_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

        # Kết nối DB
        mysql_conn = get_mysql_connection()
        mysql_cursor = mysql_conn.cursor()

        sqlserver_conn = get_sqlserver_connection()
        sqlserver_cursor = sqlserver_conn.cursor()

        # Kiểm tra tồn tại ở cả hai DB
        mysql_cursor.execute("SELECT COUNT(*) FROM departments WHERE DepartmentID = %s", (id,))
        if mysql_cursor.fetchone()[0] == 0:
            return jsonify({'error': 'Department not found in MySQL'}), 404

        sqlserver_cursor.execute("SELECT COUNT(*) FROM Departments WHERE DepartmentID = ?", (id,))
        if sqlserver_cursor.fetchone()[0] == 0:
            return jsonify({'error': 'Department not found in SQL Server'}), 404

        # Cập nhật MySQL
        mysql_cursor.execute("""
            UPDATE departments SET DepartmentName=%s WHERE DepartmentID=%s
        """, (department_name, id))
        mysql_conn.commit()

        # Cập nhật SQL Server
        sqlserver_cursor.execute("""
            UPDATE Departments SET DepartmentName=?, UpdatedAt=? WHERE DepartmentID=?
        """, (department_name, updated_time, id))
        sqlserver_conn.commit()

        # Đóng kết nối
        mysql_cursor.close()
        mysql_conn.close()
        sqlserver_cursor.close()
        sqlserver_conn.close()

        return jsonify({
            'message': 'Department updated successfully in both databases',
            'id': id,
            'departmentName': department_name,
            'updatedAt': updated_time
        })

    except Exception as e:
        print("❌ Error updating department:", e)
        try:
            mysql_conn.rollback()
            sqlserver_conn.rollback()
        except:
            pass
        return jsonify({'error': 'Failed to update department'}), 500

# XÓA PHÒNG BAN
@departments_bp.route('/api/department/delete/<int:department_id>', methods=['DELETE'])
@verify_token
@verify_hr
def delete_department(department_id):
    sqlserver_deleted = False
    mysql_deleted = False
    errors = []

    force_delete = request.args.get("force", "false").lower() == "true"
    
    try:
        # Kết nối DB
        sqlserver_conn = get_sqlserver_connection()
        sqlserver_cursor = sqlserver_conn.cursor()

        mysql_conn = get_mysql_connection()
        mysql_cursor = mysql_conn.cursor()


        # Kiểm tra tồn tại
        mysql_cursor.execute("SELECT COUNT(*) FROM departments WHERE DepartmentID = %s", (department_id,))
        if mysql_cursor.fetchone()[0] == 0:
            return jsonify({'error': 'Department not found in MySQL'}), 404

        sqlserver_cursor.execute("SELECT COUNT(*) FROM Departments WHERE DepartmentID = ?", (department_id,))
        if sqlserver_cursor.fetchone()[0] == 0:
            return jsonify({'error': 'Department not found in SQL Server'}), 404
        
        sqlserver_cursor.execute("SELECT COUNT(*) FROM Employees WHERE DepartmentID = ?", (department_id,))
        department_count = sqlserver_cursor.fetchone()[0]

        mysql_cursor.execute("SELECT COUNT(*) FROM employees WHERE DepartmentID = %s", (department_id,))
        department_count_mysql = mysql_cursor.fetchone()[0]

        if (department_count > 0 or department_count_mysql>0) and not force_delete:
            return jsonify({
                "error": "Ràng buộc dữ liệu",
                "message": f"Phòng ban ID {department_id} đang được có dữ liệu ràng buộc trong bảng Employee.",
                "hasDependencies": True
            }), 409  
        else:

            sqlserver_cursor.execute("UPDATE Employees SET DepartmentID = NULL WHERE DepartmentID = ?", (department_id,))
            mysql_cursor.execute("UPDATE employees SET DepartmentID = NULL WHERE DepartmentID = %s", (department_id,))

            sqlserver_cursor.execute("DELETE FROM Departments WHERE DepartmentID = ?", (department_id,))
            mysql_cursor.execute("DELETE FROM departments WHERE DepartmentID = %s", (department_id,))
            
            sqlserver_conn.commit()
            mysql_conn.commit()

            if mysql_cursor.rowcount > 0 and sqlserver_cursor.rowcount > 0:
                mysql_deleted = True
                sqlserver_deleted = True
            else:
                errors.append("Không tìm thấy nhân viên trong MySQL")

        # Đóng kết nối
        mysql_cursor.close()
        mysql_conn.close()

        sqlserver_cursor.close()
        sqlserver_conn.close()    

        return jsonify({'message': f'Department ID {department_id} deleted successfully from both databases'}), 200

    except Exception as e:
        print("❌ Error deleting department:", e)
        try:
            mysql_conn.rollback()
            sqlserver_conn.rollback()
        except:
            pass
        return jsonify({'error': 'Failed to delete department'}), 500

