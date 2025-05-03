import React, { useEffect, useState } from "react";
import "../../styles/HumanResourceStyles/HR_PositionTable.css";

const HR_PositionTable = ({ style }) => {
  // const job = [
  //   {
  //     id: "01",
  //     positionName: "Sale",
  //     createdAt: "Alex",
  //     updatedAt: "Minh",
  //   },
  // ];

  const [job, setPosition] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/positions")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }
        return res.json();
      })
      .then((data) => {
        console.log("✅ Dữ liệu nhận được:", data); // THÊM DÒNG NÀY
        setPosition(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

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
