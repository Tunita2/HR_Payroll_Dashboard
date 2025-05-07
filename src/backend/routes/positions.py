from flask import Blueprint , jsonify
from db import get_mysql_connection, get_sqlserver_connection

positions_bp = Blueprint("positions", __name__)

# Vị trí (Position)
# Lấy toàn bộ danh sách vị trí
@positions_bp.route("/api/positions" , methods = ["GET"])
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