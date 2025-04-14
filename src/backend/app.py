from flask import Flask, jsonify
from flask_cors import CORS
from db import get_connection

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

# Lấy toàn bộ danh sách phòng ban
@app.route("/api/departments", methods=["GET"])
def get_departments():
    try:
        conn = get_connection()
        print("✅ Connected to DB successfully")
        cursor = conn.cursor()
        
       # Gọi rõ từng cột thay vì SELECT *
        cursor.execute("SELECT DepartmentID, DepartmentName, CreatedAt, UpdatedAt FROM Departments")
        departments = []

        for row in cursor.fetchall():
            department = {
                "id": row[0],
                "departmentName": row[1],
                "createdAt": str(row[2]) if row[2] else None,  # convert datetime to string
                "updatedAt": str(row[3]) if row[3] else None
            }
            departments.append(department)
        
        return jsonify(departments)
    except Exception as e:
        print("❌ Failed to connect to DB:", e)
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
