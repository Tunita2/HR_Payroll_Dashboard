import React from "react";
import "./EmployeeTable.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";

const EmployeeTable = () => {
  const employees = [
    {
      id: "CEO-01",
      name: "Nguyễn Văn An",
      startDate: "10/02/2020",
      department: "Kinh doanh",
      position: "Chủ tịch",
      email: "vanan@gmail.com",
      phone: "0901111222",
      status: true,
    },
    {
      id: "CEO-02",
      name: "Nguyễn Văn Bảo",
      startDate: "10/02/2020",
      department: "Kinh doanh",
      position: "Phó chủ tịch",
      email: "vanbao@gmail.com",
      phone: "0901111333",
      status: false,
    },
    {
      id: "CEO-03",
      name: "Phạm Long",
      startDate: "10/02/2020",
      department: "Kinh doanh",
      position: "Tổng giám đốc",
      email: "longpham@gmail.com",
      phone: "0901111444",
      status: true,
    },
  ];

  return (
    <table className="employee-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Full name</th>
          <th>Start date</th>
          <th>Department</th>
          <th>Position</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {employees.map((employee) => (
          <tr key={employee.id}>
            <td>{employee.id}</td>
            <td>{employee.name}</td>
            <td>{employee.startDate}</td>
            <td>{employee.department}</td>
            <td>{employee.position}</td>
            <td>{employee.email}</td>
            <td>{employee.phone}</td>
            <td className="status-cell">
              <FontAwesomeIcon
                icon={employee.status ? faCheck : faTimes}
                className={`status-icon ${
                  employee.status ? "active" : "inactive"
                }`}
              />
            </td>
            <td>
              <button className="action-button delete">
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default EmployeeTable;
