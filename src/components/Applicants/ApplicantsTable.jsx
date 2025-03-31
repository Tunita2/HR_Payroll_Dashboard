import React from "react";
import "../../styles/Applicants/ApplicantsTable.css";

const StaffTable = ({ style }) => {
  const employees = [
    {
      id: "01",
      firstName: "Nguyễn",
      lastName: "Văn An",
      email: "vanan@gmail.com",
      phone: "0901111333",
      applicantionDate: "10/02/2020",
      position: "IT Full-Stack",
      status: true,
    },

    {
      id: "02",
      firstName: "Nguyễn",
      lastName: "Long",
      email: "long@gmail.com",
      phone: "0901111222",
      applicantionDate: "10/02/2020",
      position: "Sales",
      status: false,
    },

    // ... other employees
  ];

  return (
    <div>
      <div class="appli-table-header">
        <div>Applicants list</div>
        <div class="appli-search-container">
          <input
            type="text"
            placeholder="Search..."
            // value={searchTerm}
            // onChange={(e) => setSearchTerm(e.target.value)}
            className="table-search-appli-input"
          />
          <img
            src="https://dashboard.codeparrot.ai/api/image/Z-kDXwz4-w8v6Rl0/frame-9.png"
            alt="Search"
            className="appli-search-bar-icon"
          />
        </div>
        <img src="https://dashboard.codeparrot.ai/api/image/Z-oMCgz4-w8v6Rpi/refresh.png" alt="Refresh" style={{ width: '30px', height: '30px', marginRight: '10px' }} />
        {/* <div className="table-button-container">
          <button className="table-button add">
            <strong>Add</strong>
          </button>
          <button className="table-button">
            <strong>Delete</strong>
          </button>
        </div> */}
      </div>

      {/* Bảng Dữ liệu applicants */}
      <div className="appli-table-container" style={style}>
        <table className="appli-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>First name</th>
              <th>Last name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Applicantion-date</th>
              <th>Job title</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee, index) => (
              <tr key={index} className="appli-table-row">
                <td>{employee.id}</td>
                <td>{employee.firstName}</td>
                <td>{employee.lastName}</td>
                <td>{employee.email}</td>
                <td>{employee.phone}</td>
                <td>{employee.applicantionDate}</td>
                <td>{employee.position}</td>
                <td>
                  <div className="appli-status-indicator">
                    <div
                      className={`appli-status-circle ${
                        employee.status ? "active" : "inactive"
                      }`}
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
