import React, { useEffect, useState } from "react";
import "../../styles/HumanResourceStyles/HR_DividendTable.css";
import SearchBar from "../General/SearchBar";

const HR_DividendTable = ({ style }) => {
  const [dividends, setDividends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchKeyword, setSearchKeyword] = useState("");

  useEffect(() => {
    // Lấy token từ localStorage, sessionStorage, hoặc state (tuỳ vào cách bạn lưu trữ token)
    const token = localStorage.getItem("token"); // hoặc sessionStorage.getItem("token")

    if (!token) {
      console.error("Token không tồn tại");
      return;
    }

    fetch("http://localhost:5000/api/dividends", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // Gửi token dưới dạng Bearer token
      },
    })
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

  const filteredDividend = dividends.filter((divi) => {
    const keyword = searchKeyword.toLowerCase();
    return (
      divi.employeeName.toLowerCase().includes(keyword) ||
      divi.dividendID.toString().includes(keyword) ||
      divi.employeeID.toString().includes(keyword)
    );
  });

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
        
        <div className="table-button-container">
          <button className="table-button add">
            <strong>Add</strong>
          </button>
          <button className="table-button delete">
            <strong>Delete</strong>
          </button>
        </div>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <SearchBar
          placeholder="Search by ID or Department Name"
          onSearch={setSearchKeyword}
        />
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
            {filteredDividend.map((divi, index) => (
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
