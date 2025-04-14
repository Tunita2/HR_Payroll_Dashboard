import React, { useEffect, useState } from "react";
import "../../styles/HumanResourceStyles/HR_DepartmentTable.css"

const HR_DepartmentTable = ({ style }) => {
  // const departments = [
  //   {
  //     id: "01",
  //     departmentName: "Kinh doanh",
  //     createdAt: "Alex",
  //     updatedAt : "Minh"
  //   },
    
  // ];

  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/departments")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }
        return res.json();
      })
      .then((data) => {
        console.log("✅ Dữ liệu nhận được:", data);  // THÊM DÒNG NÀY
        setDepartments(data);
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
            {departments.map((dept, index) => (
              <tr key={index} className="depart-table-row">
                <td>{dept.id}</td>
                <td>{dept.departmentName}</td>
                <td>{dept.createdAt}</td>
                <td>{dept.updatedAt}</td>
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
