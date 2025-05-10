import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import "../../styles/PayrollStyles/tableSalaries.css";
import SearchForPayroll from "../General/SearchForPayroll";


const SalaryTable = () => {
  const [dataSalary, setSalary] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState("FullName")
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [selectedEmployeeData, setSelectedEmployeeData] = useState({
    BaseSalary: '',
    Bonus: '',
    Deductions: ''
  });
  const [updateMessage, setUpdateMessage] = useState("");
  const [updateError, setUpdateError] = useState("");

  const fetchSalary = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:3001/api/payroll/salaries');
      const sortedData = res.data.sort((a, b) => a.SalaryID - b.SalaryID);
      setSalary(sortedData);
    } catch (err) {
      console.error("Failed to fetch salary data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalary();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getMonthYear = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return `${date.getMonth() + 1}-${date.getFullYear()}`;
  };

  const allMonths = Array.from(
    new Set(dataSalary.map((item) => getMonthYear(item.SalaryMonth)))
  );

  const searchCategories = [
    { value: "FullName", label: "Name" },
    { value: "EmployeeID", label: "Employee ID" },
    { value: "DepartmentName", label: "Department" },
    { value: "PositionName", label: "Position" }
  ];

  const filteredData = dataSalary
    .filter(item => selectedMonth === "all" || getMonthYear(item.SalaryMonth) === selectedMonth)
    .filter(item => {
      if (!searchQuery) return true;

      const searchValue = String(item[searchCategory] || "").toLowerCase();
      return searchValue.includes(searchQuery.toLowerCase());
    });

  const handleRowSelect = (employeeId, employeeData) => {
    if (selectedEmployeeId === employeeId) {
      // If already selected, deselect
      setSelectedEmployeeId(null);
    } else {
      // Otherwise select this employee
      setSelectedEmployeeId(employeeId);
      setSelectedEmployeeData({
        BaseSalary: employeeData.BaseSalary,
        Bonus: employeeData.Bonus,
        Deductions: employeeData.Deductions
      });
    }
  };

  const handleUpdateClick = () => {
    if (selectedEmployeeId) {
      setShowModal(true);
      // Reset any previous messages
      setUpdateMessage("");
      setUpdateError("");
    } else {
      alert("Please select an employee to update salary");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Ensure only numbers and decimal point can be entered
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setSelectedEmployeeData({
        ...selectedEmployeeData,
        [name]: value
      });
    }
  };

  const validateInputs = () => {
    const { BaseSalary, Bonus, Deductions } = selectedEmployeeData;

    // Check if inputs are not empty and are valid numbers
    if (!BaseSalary || isNaN(parseFloat(BaseSalary))) {
      setUpdateError("Base salary must be a valid number");
      return false;
    }

    if (!Bonus || isNaN(parseFloat(Bonus))) {
      setUpdateError("Bonus must be a valid number");
      return false;
    }

    if (!Deductions || isNaN(parseFloat(Deductions))) {
      setUpdateError("Deductions must be a valid number");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs before submitting
    if (!validateInputs()) {
      return;
    }

    try {
      setLoading(true);

      // Call API to update salary
      const response = await axios.put(
        `http://localhost:3001/api/payroll/salaries/${selectedEmployeeId}`,
        selectedEmployeeData
      );

      // If update successful, show success message and refresh data
      setUpdateMessage("Salary updated successfully!");
      fetchSalary(); // Refresh the salary data

      // Close modal after short delay
      setTimeout(() => {
        setShowModal(false);
        setUpdateMessage("");
      }, 1500);

    } catch (error) {
      console.error("Error updating salary:", error);
      setUpdateError(error.response?.data?.error || "Failed to update salary. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className='main-title'>Salary list</div>
      <div className="appli-table-header">
        <SearchForPayroll
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchCategory={searchCategory}
          setSearchCategory={setSearchCategory}
          categories={searchCategories}
          placeholder="Search salary information..."
        />
        <div className="button-group">
          <div className="btn-btn" onClick={handleUpdateClick}>Update salary</div>
          <Link to={'/payroll/salary/history'} style={{ color: 'white' }}>
            <div className="btn-btn">Salary history</div>
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <label htmlFor="month-filter">Month:</label>
            <select
              id="month-filter"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              <option value="all">All Month</option>
              {allMonths.map((month, index) => (
                <option key={index} value={month}>{month}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Bảng Dữ liệu attendance */}
      {loading ? (
        <div className="loading">Loading salary data...</div>
      ) : filteredData.length > 0 ? (
        <div>
          <table className="appli-table">
            <thead>
              <tr>
                <th>Selection</th>
                <th>ID</th>
                <th>Employee ID</th>
                <th>Full name</th>
                <th>Department</th>
                <th>Position</th>
                <th>Salary month</th>
                <th>Base salary</th>
                <th>Bonus</th>
                <th>Deductions</th>
                <th>Net salary</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((employee, index) => (
                <tr key={index}
                  className={`appli-table-row ${selectedEmployeeId === employee.SalaryID ? "selected-row" : ""}`}
                  onClick={() => handleRowSelect(employee.SalaryID, employee)}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedEmployeeId === employee.SalaryID}
                      onChange={() => handleRowSelect(employee.SalaryID, employee)}
                    />
                  </td>
                  <td>{employee.SalaryID}</td>
                  <td>{employee.EmployeeID}</td>
                  <td>{employee.FullName}</td>
                  <td>{employee.DepartmentName}</td>
                  <td>{employee.PositionName}</td>
                  <td>{formatDate(employee.SalaryMonth)}</td>
                  <td>{employee.BaseSalary}</td>
                  <td>{employee.Bonus}</td>
                  <td>{employee.Deductions}</td>
                  <td>{employee.NetSalary}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="no-data">No salary records found for the selected filters</div>
      )}
      <div className='modal-overlay' style={{ display: showModal ? "flex" : "none" }}>
        <div className="update-salary-modal">
          <h3>Updating Salary</h3>
          {updateMessage && <div className="update-success">{updateMessage}</div>}
          {updateError && <div className="update-error">{updateError}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group-salary">
              <label>Base Salary</label>
              <input
                type='text'
                name="BaseSalary"
                value={selectedEmployeeData.BaseSalary}
                onChange={handleInputChange}
                required
              />
              <span className='dollad'>$</span>
            </div>

            <div className="form-group-salary">
              <label>Bonus</label>
              <input
                type='text'
                name="Bonus"
                value={selectedEmployeeData.Bonus}
                onChange={handleInputChange}
                required
              />
              <span className='dollad'>$</span>
            </div>

            <div className="form-group-salary">
              <label>Deductions</label>
              <input
                type='text'
                name="Deductions"
                value={selectedEmployeeData.Deductions}
                onChange={handleInputChange}
                required
              />
              <span className='dollad'>$</span>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={handleCloseModal}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-submit"
                disabled={loading}
              >{loading ? "Updating..." : "Update Salary"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SalaryTable;