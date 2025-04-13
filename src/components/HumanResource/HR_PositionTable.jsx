import React from "react";
import "../../styles/HumanResourceStyles/HR_PositionTable.css";

const HR_PositionTable = ({ style }) => {
  const job = [
    {
      id: "01",
      positionName: "Sale",
      createdAt: "Alex",
      updatedAt: "Minh",
    },
  ];

  return (
    <div>
      <div className="job-table-header">
        <div>Position List</div>

        {/* Button add - thêm chức vụ và delete - xóa chức vụ */}
        <div className="table-button-container">
          <button className="table-button add">
            <strong>Add</strong>
          </button>
          <button className="table-button">
            <strong>Delete</strong>
          </button>
        </div>
      </div>

      {/* Bảng hiển thị dữ liệu chức vụ */}
      <div className="job-table-container" style={style}>
        <table className="job-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Position</th>
              <th>Created At</th>
              <th>Updated At</th>
            </tr>
          </thead>
          <tbody>
            {job.map((job, index) => (
              <tr key={index} className="job-table-row">
                <td>{job.id}</td>
                <td>{job.positionName}</td>
                <td>{job.createdAt}</td>
                <td>{job.updatedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

HR_PositionTable.defaultProps = {
  style: {},
};

export default HR_PositionTable;
