import React from "react";
import "../../styles/Department/Department.css";

const DepartmentTable = ({ style }) => {
  const departments = [
    {
      id: "01",
      department: "Kinh doanh",
      manageBy: "Alex"
    },
    
    // ... other employees
  ];

  return (
    <div>
      <div class="depart-table-header">
        <div>Department list</div>
        <div class="depart-search-container">
          <input
            type="text"
            placeholder="Search..."
            // value={searchTerm}
            // onChange={(e) => setSearchTerm(e.target.value)}
            className="table-search-depart-input"
          />
          <img
            src="https://dashboard.codeparrot.ai/api/image/Z-kDXwz4-w8v6Rl0/frame-9.png"
            alt="Search"
            className="depart-search-bar-icon"
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

      <div className="depart-table-container" style={style}>
        <table className="depart-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Department name</th>
              <th>Manage By</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((departments, index) => (
              <tr key={index} className="depart-table-row">
                <td>{departments.id}</td>
                <td>{departments.department}</td>
                <td>{departments.manageBy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

DepartmentTable.defaultProps = {
  style: {},
};

export default DepartmentTable;
