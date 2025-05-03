from flask import Blueprint, jsonify
from db import get_mysql_connection, get_sqlserver_connection

report_bp = Blueprint("report",__name__)

# REPORT : OVERVIEW - Đếm tổng nhân viên, phòng ban , vị trí , nam, nữ
@report_bp.route("/api/report/count" , methods = ["GET"])
def get_count():
    try:
        conn = get_sqlserver_connection()
        cursor = conn.cursor()

        #Đếm tổng số nhân viên từ bảng Employees
        cursor.execute("SELECT COUNT(*) FROM Employees")
        total_employees = cursor.fetchone()[0]

        #Đếm tổng số phòng ban từ bảng Departments
        cursor.execute("SELECT COUNT(*) FROM Departments")
        total_departments = cursor.fetchone()[0]

        #Đếm tổng số vị trí từ bảng Positions
        cursor.execute("SELECT COUNT(*) FROM Positions")
        total_positions = cursor.fetchone()[0]

        #Đếm tổng số nhân viên nam từ bảng Employees
        cursor.execute("SELECT COUNT(*) FROM Employees WHERE Gender = 'Nam' ")
        total_male = cursor.fetchone()[0]

        #Đếm tổng số nhân viên nữ từ bảng Employees
        cursor.execute("SELECT COUNT(*) FROM Employees WHERE Gender = N'Nữ' ")
        total_female = cursor.fetchone()[0]

        return jsonify({
            'totalEmployees' : total_employees,
            'totalDepartments' : total_departments,
            'totalPositions' : total_positions,
            'totalMale' : total_male,
            'totalFemale' : total_female
        })

    except Exception as e:
        print("❌Không đếm được ",e)
        return jsonify({"error": str(e)}), 500