from flask import Blueprint, jsonify, request
from ..db import get_mysql_connection, get_sqlserver_connection
from datetime import datetime
from ..auth import verify_token, verify_hr

positions_bp = Blueprint("positions", __name__)

# Vị trí (Position)
# Lấy toàn bộ danh sách vị trí
@positions_bp.route("/api/positions" , methods = ["GET"])
@verify_token
@verify_hr
def get_positions():
    try:
        conn = get_sqlserver_connection()
        print("✅ Connected to DB successfully")
        cursor = conn.cursor()
        
        # Gọi rõ từng cột
        cursor.execute("SELECT PositionID, PositionName, CreatedAt, UpdatedAt FROM Positions")
        positions = []

        for row in cursor.fetchall():
            position = {
                "id": row[0],
                "positionName": row[1],
                "createdAt": row[2].strftime('%d-%m-%Y %H:%M:%S') if row[2] else None,  # convert datetime to string
                "updatedAt": row[3].strftime('%d-%m-%Y %H:%M:%S') if row[3] else None
            }
            positions.append(position)

        return jsonify(positions)
    except Exception as e:
        print("❌ Failed to connect to DB:", e)
        return jsonify({"error": str(e)}), 500
    

# Thêm phòng ban vào database
@positions_bp.route('/api/position/add', methods=['POST'])
@verify_token
@verify_hr
def add_position():
    try:
        data = request.get_json()
        print("Received data:", data)  # Kiểm tra dữ liệu nhận được
        position_name = data.get('positionName')

        # ❌ Validate rỗng
        if not position_name or position_name.strip() == "":
            return jsonify({'error': 'Position name is required'}), 400

        # Kết nối database (SQL SERVER VÀ MYSQL)
        sqlserver_conn = get_sqlserver_connection()
        sqlserver_cursor = sqlserver_conn.cursor()

        mysql_conn = get_mysql_connection()
        mysql_cursor = mysql_conn.cursor()

        # 🔍 Kiểm tra trùng tên (không phân biệt hoa thường)
        sqlserver_cursor.execute("SELECT COUNT(*) FROM Positions WHERE LOWER(PositionName) = LOWER(?)", (position_name,))
        sqlserver_count = sqlserver_cursor.fetchone()[0]

        mysql_cursor.execute("SELECT COUNT(*) FROM positions WHERE LOWER(PositionName) = LOWER(%s)" , (position_name,))
        mysql_count = mysql_cursor.fetchone()[0]

        if sqlserver_count > 0 or mysql_count > 0:
            return jsonify({'error': f"Position '{position_name}' already exists."}), 409

        # 🕒 Lấy thời gian hiện tại
        current_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')


        # ✅ Thêm vào bảng SQL Server
        sqlserver_cursor.execute("""
            INSERT INTO Positions (PositionName, CreatedAt, UpdatedAt)
            OUTPUT INSERTED.PositionID
            VALUES (?, ?, ?)
        """, (position_name, current_time, current_time))


        new_id = sqlserver_cursor.fetchone()[0]
        print("✅ New ID with OUTPUT INSERTED:", new_id)
        sqlserver_conn.commit()

        # ✅ Thêm vào bảng MySQL
        mysql_cursor.execute("""
            INSERT INTO positions (PositionID, PositionName)
            VALUES (%s, %s)
        """, (new_id, position_name))
        mysql_conn.commit()
        print("✅ Inserted into MySQL successfully")


        # Đóng kết nối
        mysql_cursor.close()
        mysql_conn.close()
        sqlserver_cursor.close()
        sqlserver_conn.close()

        return jsonify({
            'id': new_id,
            'positionName': position_name,
            'createdAt': current_time,
            'updatedAt': current_time
        }), 201

    except Exception as e:
        print("❌ Error adding position:", e)
        return jsonify({'error': 'Failed to add position'}), 500

# Cập nhật phòng ban
@positions_bp.route('/api/position/update/<int:id>', methods=['PUT'])
@verify_token
@verify_hr
def update_position(id):
    try:
        data = request.get_json()
        position_name = data.get('positionName', '').strip()

        if not position_name:
            return jsonify({'error': 'Position name is required'}), 400

        updated_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

        # Kết nối DB
        mysql_conn = get_mysql_connection()
        mysql_cursor = mysql_conn.cursor()

        sqlserver_conn = get_sqlserver_connection()
        sqlserver_cursor = sqlserver_conn.cursor()

        # Kiểm tra tồn tại ở cả hai DB
        mysql_cursor.execute("SELECT COUNT(*) FROM positions WHERE PositionID = %s", (id,))
        if mysql_cursor.fetchone()[0] == 0:
            return jsonify({'error': 'Position not found in MySQL'}), 404

        sqlserver_cursor.execute("SELECT COUNT(*) FROM Positions WHERE PositionID = ?", (id,))
        if sqlserver_cursor.fetchone()[0] == 0:
            return jsonify({'error': 'Position not found in SQL Server'}), 404

        # Cập nhật MySQL
        mysql_cursor.execute("""
            UPDATE positions SET PositionName=%s WHERE PositionID=%s
        """, (position_name, id))
        mysql_conn.commit()

        # Cập nhật SQL Server
        sqlserver_cursor.execute("""
            UPDATE Positions SET PositionName=?, UpdatedAt=? WHERE PositionID=?
        """, (position_name, updated_time, id))
        sqlserver_conn.commit()

        # Đóng kết nối
        mysql_cursor.close()
        mysql_conn.close()
        sqlserver_cursor.close()
        sqlserver_conn.close()

        return jsonify({
            'message': 'Position updated successfully in both databases',
            'id': id,
            'positionName': position_name,
            'updatedAt': updated_time
        })

    except Exception as e:
        print("❌ Error updating position:", e)
        try:
            mysql_conn.rollback()
            sqlserver_conn.rollback()
        except:
            pass
        return jsonify({'error': 'Failed to update position'}), 500

# XÓA PHÒNG BAN
@positions_bp.route('/api/position/delete/<int:position_id>', methods=['DELETE'])
@verify_token
@verify_hr
def delete_position(position_id):
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
        mysql_cursor.execute("SELECT COUNT(*) FROM positions WHERE PositionID = %s", (position_id,))
        if mysql_cursor.fetchone()[0] == 0:
            return jsonify({'error': 'Position not found in MySQL'}), 404

        sqlserver_cursor.execute("SELECT COUNT(*) FROM Positions WHERE PositionID = ?", (position_id,))
        if sqlserver_cursor.fetchone()[0] == 0:
            return jsonify({'error': 'Position not found in SQL Server'}), 404
        
        sqlserver_cursor.execute("SELECT COUNT(*) FROM Employees WHERE PositionID = ?", (position_id,))
        position_count = sqlserver_cursor.fetchone()[0]

        mysql_cursor.execute("SELECT COUNT(*) FROM employees WHERE PositionID = %s", (position_id,))
        position_count_mysql = mysql_cursor.fetchone()[0]

        if (position_count > 0 or position_count_mysql>0) and not force_delete:
            return jsonify({
                "error": "Ràng buộc dữ liệu",
                "message": f"Vị trí ID {position_id} đang được có dữ liệu ràng buộc trong bảng Employee.",
                "hasDependencies": True
            }), 409  
        else:

            sqlserver_cursor.execute("UPDATE Employees SET PositionID = NULL WHERE PositionID = ?", (position_id,))
            mysql_cursor.execute("UPDATE employees SET PositionID = NULL WHERE PositionID = %s", (position_id,))

            sqlserver_cursor.execute("DELETE FROM Positions WHERE PositionID = ?", (position_id,))
            mysql_cursor.execute("DELETE FROM positions WHERE PositionID = %s", (position_id,))
            
            sqlserver_conn.commit()
            mysql_conn.commit()

            if mysql_cursor.rowcount > 0 and sqlserver_cursor.rowcount > 0:
                mysql_deleted = True
                sqlserver_deleted = True
            else:
                errors.append("Không tìm thấy vị trí trong MySQL")

        # Đóng kết nối
        mysql_cursor.close()
        mysql_conn.close()

        sqlserver_cursor.close()
        sqlserver_conn.close()    

        return jsonify({'message': f'Position ID {position_id} deleted successfully from both databases'}), 200

    except Exception as e:
        print("❌ Error deleting position:", e)
        try:
            mysql_conn.rollback()
            sqlserver_conn.rollback()
        except:
            pass
        return jsonify({'error': 'Failed to delete position'}), 500

