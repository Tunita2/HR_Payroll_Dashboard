import React from 'react';
import "../../styles/PayrollStyles/tableAttendance.css"

const AttendanceTable = () => {
  const list_attendance = [
    {
      id: "01",
      employee_id: "101",
      fullname: "Văn An",
      position: "Manager",
      department: "Marketing",
      workDays: "200",
      AbsentDays: "19",
      LeaveDays: "19",
      AttendanceMonth: "June",
      Created_at: "20/10/2025",
    },
    {
      id: "01",
      employee_id: "101",
      fullname: "Văn An",
      position: "Manager",
      department: "Marketing",
      workDays: "200",
      AbsentDays: "19",
      LeaveDays: "19",
      AttendanceMonth: "April",
      Created_at: "20/10/2025",
    },
    {
      id: "01",
      employee_id: "101",
      fullname: "Văn An",
      position: "Manager",
      department: "Marketing",
      workDays: "200",
      AbsentDays: "19",
      LeaveDays: "19",
      AttendanceMonth: "March",
      Created_at: "20/10/2025",
    },
    {
      id: "01",
      employee_id: "101",
      fullname: "Văn An",
      position: "Manager",
      department: "Marketing",
      workDays: "200",
      AbsentDays: "19",
      LeaveDays: "19",
      AttendanceMonth: "February",
      Created_at: "20/10/2025",
    },
    {
      id: "01",
      employee_id: "101",
      fullname: "Văn An",
      position: "Manager",
      department: "Marketing",
      workDays: "200",
      AbsentDays: "19",
      LeaveDays: "19",
      AttendanceMonth: "January",
      Created_at: "20/10/2025",
    },
  ];
  return (
    <div>
      <div class="appli-table-header">
        <div>Attendance list</div>
        <img src="https://dashboard.codeparrot.ai/api/image/Z-oMCgz4-w8v6Rpi/refresh.png" alt="Refresh" style={{ width: '30px', height: '30px', marginRight: '10px' }} />
      </div>

      {/* Bảng Dữ liệu attendance */}
      <div>
        <table className="appli-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Employee ID</th>
              <th>Full name</th>
              <th>Department</th>
              <th>Position</th>
              <th>Work Days</th>
              <th>Absent Days</th>
              <th>Leave Days</th>
              <th>Attendance month</th>
              <th>Create At</th>
            </tr>
          </thead>
          <tbody>
            {list_attendance.map((employee, index) => (
              <tr key={index} className="appli-table-row">
                <td>{employee.id}</td>
                <td>{employee.employee_id}</td>
                <td>{employee.fullname}</td>
                <td>{employee.department}</td>
                <td>{employee.position}</td>
                <td>{employee.workDays}</td>
                <td>{employee.AbsentDays}</td>
                <td>{employee.LeaveDays}</td>
                <td>{employee.AttendanceMonth}</td>
                <td>{employee.Created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceTable;