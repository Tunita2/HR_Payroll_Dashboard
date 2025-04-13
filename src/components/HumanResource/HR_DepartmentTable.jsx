import React from "react";
import "../../styles/HumanResourceStyles/HR_DepartmentTable.css"

const HR_DepartmentTable = ({ style }) => {
  const departments = [
    {
      id: "01",
      departmentName: "Kinh doanh",
      createdAt: "Alex",
      updatedAt : "Minh"
    },
    
  ];

  return (
    <div>
      <div className ="depart-table-header">
        <div>Department list</div>
        
        {/* Button add - thêm phòng ban và delete - xóa phòng ban */}
        <div className="table-button-container">
          <button className="table-button add">
            <strong>Add</strong>
          </button>
          <button className="table-button">
            <strong>Delete</strong>
          </button>
        </div>
      </div>

      {/* Bảng hiển thị dữ liệu phòng ban */}
      <div className="depart-table-container" style={style}>
        <table className="depart-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Department name</th>
              <th>Created At</th>
              <th>Updated At</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((departments, index) => (
              <tr key={index} className="depart-table-row">
                <td>{departments.id}</td>
                <td>{departments.departmentName}</td>
                <td>{departments.createdAt}</td>
                <td>{departments.updatedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

HR_DepartmentTable.defaultProps = {
  style: {},
};

export default HR_DepartmentTable;
