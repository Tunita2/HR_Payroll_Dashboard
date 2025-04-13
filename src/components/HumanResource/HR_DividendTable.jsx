import React from "react";
import "../../styles/HumanResourceStyles/HR_DividendTable.css"

const HR_DividendTable = ({ style }) => {
  const dividends = [
    {
      dividendID: "01",
      employeeID: "01",
      dividendAmount: "1.000.000",
      dividendDate: "10/02/2022",
      createdAt: "10/02/2020",
    },
    
  ];

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
              <th>Dividend Amount</th>
              <th>Dividend Date</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {dividends.map((applicants, index) => (
              <tr key={index} className="dividend-table-row">
                <td>{applicants.dividendID}</td>
                <td>{applicants.employeeID}</td>
                <td>{applicants.dividendAmount}</td>
                <td>{applicants.dividendDate}</td>
                <td>{applicants.createdAt}</td>
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
