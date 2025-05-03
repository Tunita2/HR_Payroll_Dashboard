import React, { useEffect, useState } from "react";
import "../../styles/HumanResourceStyles/HR_DividendTable.css"

const HR_DividendTable = ({ style }) => {
  const [dividends, setDividends] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      fetch("http://localhost:5000/api/dividends")
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to fetch data");
          }
          return res.json();
        })
        .then((data) => {
          console.log("✅ Dữ liệu nhận được:", data); // THÊM DÒNG NÀY
          setDividends(data);
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
      <div className="dividend-table-header">
        <div>Dividend list</div>
        
        {/* <img
          src="https://dashboard.codeparrot.ai/api/image/Z-oMCgz4-w8v6Rpi/refresh.png"
          alt="Refresh"
          style={{ width: "30px", height: "30px", marginRight: "10px" }}
        /> */}

        {/* Button add - thêm cổ đông và delete - xóa cổ đông */}
        <div className="table-button-container">
          <button className="table-button add">
            <strong>Add</strong>
          </button>
          <button className="table-button delete">
            <strong>Delete</strong>
          </button>
        </div>
      </div>

      {/* Bảng hiển thị dữ liệu cổ đông */}
      <div className="dividend-table-container" style={style}>
        <table className="dividend-table">
          <thead>
            <tr>
              <th>Dividend ID</th>
              <th>Employee ID</th>
              <th>Employee Name</th>
              <th>Dividend Amount</th>
              <th>Dividend Date</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {dividends.map((divi, index) => (
              <tr key={index} className="dividend-table-row">
                <td>{divi.dividendID}</td>
                <td>{divi.employeeID}</td>
                <td>{divi.employeeName}</td>
                <td>{divi.dividendAmount}</td>
                <td>{divi.dividendDate}</td>
                <td>{divi.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

HR_DividendTable.defaultProps = {
  style: {},
};

export default HR_DividendTable;
