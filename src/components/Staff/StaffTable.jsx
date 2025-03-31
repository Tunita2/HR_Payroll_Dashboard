import React from "react";
import "../../styles/Staff/StaffTable.css";

const StaffTable = ({ style }) => {
  const employees = [
    {
      id: "CEO-01",
      name: "Nguyễn Văn An",
      hireDate: "10/02/2020",
      department: "Kinh doanh",
      position: "Chủ tịch",
      email: "vanan@gmail.com",
      phone: "0901111222",
      status: true,
    },
    {
      id: "CEO-01",
      name: "Nguyễn Văn An",
      hireDate: "10/02/2020",
      department: "Kinh doanh",
      position: "Chủ tịch",
      email: "vanan@gmail.com",
      phone: "0901111222",
      status: true,
    },
    {
      id: "CEO-01",
      name: "Nguyễn Văn An",
      hireDate: "10/02/2020",
      department: "Kinh doanh",
      position: "Chủ tịch",
      email: "vanan@gmail.com",
      phone: "0901111222",
      status: true,
    },
    {
      id: "CEO-01",
      name: "Nguyễn Văn An",
      hireDate: "10/02/2020",
      department: "Kinh doanh",
      position: "Chủ tịch",
      email: "vanan@gmail.com",
      phone: "0901111222",
      status: true,
    },
    {
      id: "CEO-01",
      name: "Nguyễn Văn An",
      hireDate: "10/02/2020",
      department: "Kinh doanh",
      position: "Chủ tịch",
      email: "vanan@gmail.com",
      phone: "0901111222",
      status: true,
    },
    {
      id: "CEO-01",
      name: "Nguyễn Văn An",
      hireDate: "10/02/2020",
      department: "Kinh doanh",
      position: "Chủ tịch",
      email: "vanan@gmail.com",
      phone: "0901111222",
      status: true,
    },
    {
      id: "CEO-01",
      name: "Nguyễn Văn An",
      hireDate: "10/02/2020",
      department: "Kinh doanh",
      position: "Chủ tịch",
      email: "vanan@gmail.com",
      phone: "0901111222",
      status: true,
    },
    {
      id: "CEO-01",
      name: "Nguyễn Văn An",
      hireDate: "10/02/2020",
      department: "Kinh doanh",
      position: "Chủ tịch",
      email: "vanan@gmail.com",
      phone: "0901111222",
      status: true,
    },
    {
      id: "CEO-01",
      name: "Nguyễn Văn An",
      hireDate: "10/02/2020",
      department: "Kinh doanh",
      position: "Chủ tịch",
      email: "vanan@gmail.com",
      phone: "0901111222",
      status: true,
    },
    {
      id: "CEO-01",
      name: "Nguyễn Văn An",
      hireDate: "10/02/2020",
      department: "Kinh doanh",
      position: "Chủ tịch",
      email: "vanan@gmail.com",
      phone: "0901111222",
      status: true,
    },
    // ... other employees
  ];

  return (
    <div>
      <div class="staff-table-header">
        <div>Staff list</div>
        <div class="search-container">
          <input
            type="text"
            placeholder="Search..."
            // value={searchTerm}
            // onChange={(e) => setSearchTerm(e.target.value)}
            className="table-search-staff-input"
          />
          <img
            src="https://dashboard.codeparrot.ai/api/image/Z-kDXwz4-w8v6Rl0/frame-9.png"
            alt="Search"
            className="staff-search-bar-icon"
          />
        </div>

        <div className="table-button-container">
          <button className="table-button add">
            <strong>Add</strong>
          </button>
          <button className="table-button">
            <strong>Delete</strong>
          </button>
        </div>
      </div>
      <div className="staff-table-container" style={style}>
        <table className="staff-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Full name</th>
              <th>Hire-date</th>
              <th>Department</th>
              <th>Position</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Work status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee, index) => (
              <tr key={index} className="staff-table-row">
                <td>{employee.id}</td>
                <td>{employee.name}</td>
                <td>{employee.hireDate}</td>
                <td>{employee.department}</td>
                <td>{employee.position}</td>
                <td>{employee.email}</td>
                <td>{employee.phone}</td>
                <td>
                  <div className="status-indicator">
                    <div
                      className={`status-circle ${
                        employee.status ? "active" : "inactive"
                      }`}
                    />
                  </div>
                </td>
                <td>
                  <div className="action-icon">
                    <img
                      src="https://dashboard.codeparrot.ai/api/image/Z-WDlR_Ow-G566v0/frame-87-20.png"
                      alt="action"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

StaffTable.defaultProps = {
  style: {},
};

export default StaffTable;
