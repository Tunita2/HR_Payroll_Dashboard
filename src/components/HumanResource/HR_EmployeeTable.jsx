import React from "react";
import "../../styles/HumanResourceStyles/HR_EmployeeTable.css";

const HR_EmployeeTable = ({ style }) => {
  const employees = [
    {
      id: "01",
      fullName: "Nguyễn Văn An",
      dateOfBirth: "10/02/2000",
      gender: "Male",
      phoneNumber: "0901111222",
      email: "vanan@gmail.com",
      hireDate: "10/12/2015",
      departmentID: "001",
      positionID: "003",
      status: true,
      createdAt: "10/12/2015",
      updatedAt: "20/12/2020",
    },

    // ... other employees
  ];

  return (
    <div>
      <div className ="employ-table-header">
        <div>Employee list</div>

        {/* Button add - thêm nhân viên và delete - xóa nhân viên */}
        <div className="table-button-container">
          <button className="table-button add">
            <strong>Add</strong>
          </button>
          <button className="table-button delete">
            <strong>Delete</strong>
          </button>
        </div>
      </div>

      {/* Bảng hiển thị dữ liệu nhân viên */}
      <div className="employ-table-container" style={style}>
        <div className="employ-table-wrapper">
          <table className="employ-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Full name</th>
                <th>Date-Birth</th>
                <th>Gender</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Hire-date</th>
                <th>Department</th>
                <th>Position</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Updated At</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee, index) => (
                <tr key={index} className="employ-table-row">
                  <td>{employee.id}</td>
                  <td>{employee.fullName}</td>
                  <td>{employee.dateOfBirth}</td>
                  <td>{employee.gender}</td>
                  <td>{employee.phoneNumber}</td>
                  <td>{employee.email}</td>
                  <td>{employee.hireDate}</td>
                  <td>{employee.departmentID}</td>
                  <td>{employee.positionID}</td>
                  <td>
                    <div className="status-indicator">
                      <div
                        className={`status-circle ${
                          employee.status ? "active" : "inactive"
                        }`}
                      />
                    </div>
                  </td>
                  <td>{employee.createdAt}</td>
                  <td>{employee.updatedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

HR_EmployeeTable.defaultProps = {
  style: {},
};

export default HR_EmployeeTable;
