import React, { useEffect, useState } from 'react';
import axiosInstance from '../Admin/axiosInstance';
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
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [selectedEmployeeData, setSelectedEmployeeData] = useState({
    BaseSalary: '',
    Bonus: '',
    Deductions: ''
  });
  const [updateMessage, setUpdateMessage] = useState("");
  const [updateError, setUpdateError] = useState("");
  const [employees, setEmployees] = useState([]);
  const [newSalaryRecord, setNewSalaryRecord] = useState({
    EmployeeID: '',
    FullName: '',
    DepartmentName: '',
    DepartmentID: '',
    PositionName: '',
    PositionID: '',
    SalaryMonth: new Date().toISOString().split('T')[0],
    BaseSalary: '',
    Bonus: '',
    Deductions: ''
  });

  const fetchSalary = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/payroll/salaries');
      const sortedData = res.data.sort((a, b) => a.SalaryID - b.SalaryID);
      setSalary(sortedData);
    } catch (err) {
      console.error("Failed to fetch salary data", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await axiosInstance.get('/payroll/employees');
      setEmployees(res.data);
    } catch (err) {
      console.error("Failed to fetch employees data", err);
    }
  };

  useEffect(() => {
    fetchSalary();
    fetchEmployees();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "green";
      case "Inactive":
        return "red";
      default:
        return "black";
    }
  };

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

  const handleAddClick = () => {
    setShowAddModal(true);
    setNewSalaryRecord({
      EmployeeID: '',
      FullName: '',
      DepartmentName: '',
      DepartmentID: '',
      PositionName: '',
      PositionID: '',
      SalaryMonth: new Date().toISOString().split('T')[0],
      BaseSalary: '',
      Bonus: '',
      Deductions: ''
    });
    setUpdateMessage("");
    setUpdateError("");
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
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

  const handleAddInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'EmployeeID') {
      const selectedEmployee = employees.find(emp => emp.EmployeeID === parseInt(value));
      if (selectedEmployee) {
        setNewSalaryRecord({
          ...newSalaryRecord,
          EmployeeID: value,
          FullName: selectedEmployee.FullName || '',
          DepartmentID: selectedEmployee.DepartmentID || '',
          DepartmentName: selectedEmployee.DepartmentName || '',
          PositionID: selectedEmployee.PositionID || '',
          PositionName: selectedEmployee.PositionName || ''
        });
      } else {
        setNewSalaryRecord({
          ...newSalaryRecord,
          EmployeeID: value,
          FullName: '',
          DepartmentID: '',
          DepartmentName: '',
          PositionID: '',
          PositionName: ''
        });
      }
    } else if (['BaseSalary', 'Bonus', 'Deductions'].includes(name)) {
      // Ensure only numbers and decimal point can be entered
      if (value === '' || /^\d*\.?\d*$/.test(value)) {
        setNewSalaryRecord({
          ...newSalaryRecord,
          [name]: value
        });
      }
    } else {
      setNewSalaryRecord({
        ...newSalaryRecord,
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

  const validateAddInputs = () => {
    const { EmployeeID, SalaryMonth, BaseSalary, Bonus, Deductions } = newSalaryRecord;

    if (!EmployeeID) {
      setUpdateError("Please select an employee");
      return false;
    }

    if (!SalaryMonth) {
      setUpdateError("Please select a salary month");
      return false;
    }

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
      await axiosInstance.put(`/payroll/salaries/${selectedEmployeeId}`, selectedEmployeeData);

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

  const handleAddSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs trước khi gửi
    if (!validateAddInputs()) {
      return;
    }

    try {
      setLoading(true);

      // Tính lương thực nhận
      const baseSalary = parseFloat(newSalaryRecord.BaseSalary) || 0;
      const bonus = parseFloat(newSalaryRecord.Bonus) || 0;
      const deductions = parseFloat(newSalaryRecord.Deductions) || 0;
      const netSalary = baseSalary + bonus - deductions;

      // Chuẩn bị dữ liệu gửi lên
      const salaryData = {
        EmployeeID: newSalaryRecord.EmployeeID,
        SalaryMonth: newSalaryRecord.SalaryMonth,
        BaseSalary: baseSalary,
        Bonus: bonus,
        Deductions: deductions,
        NetSalary: netSalary.toFixed(2)
      };

      // Gọi API thêm lương
      await axiosInstance.post('/payroll/salaries/adding', salaryData);

      // Hiển thị thông báo + reload
      setUpdateMessage("Salary record added successfully!");
      fetchSalary(); // Refresh dữ liệu

      // Đóng modal sau 1.5s
      setTimeout(() => {
        setShowAddModal(false);
        setUpdateMessage("");
      }, 1500);

    } catch (error) {
      setUpdateError(error.response?.data?.error || "Failed to add salary record. Please try again.");
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
          <div className="btn-btn" onClick={handleAddClick}>Add record</div>
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

      {/* Salary Data Table */}
      {loading ? (
        <div className="loading">Loading salary data...</div>
      ) : filteredData.length > 0 ? (
        <div>
          <table className="appli-table">
            <thead>
              <tr>
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
                <th>Status</th>
                <th>Select</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((employee, index) => {
                return (
                  <tr key={index}
                    className={`appli-table-row ${selectedEmployeeId === employee.SalaryID ? "selected-row" : ""}`}
                    onClick={() => handleRowSelect(employee.SalaryID, employee)}>
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
                    <td>
                      <span style={{
                        color: getStatusColor(employee.Status),
                        fontWeight: "bold",
                        padding: "3px 8px",
                        borderRadius: "4px",
                        backgroundColor: `${getStatusColor(employee.Status)}15`
                      }}>
                        {employee.Status}
                      </span>
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedEmployeeId === employee.SalaryID}
                        onChange={() => handleRowSelect(employee.SalaryID, employee)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="no-data">No salary records found for the selected filters</div>
      )}

      {/* Update Salary Modal */}
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

      {/* Add New Salary Record Modal */}
      <div className='modal-overlay' style={{ display: showAddModal ? "flex" : "none" }}>
        <div className="update-salary-modal">
          <h3>Adding new payroll record</h3>
          {updateMessage && <div className="update-success">{updateMessage}</div>}
          {updateError && <div className="update-error">{updateError}</div>}
          <form onSubmit={handleAddSubmit}>
            <div className="form-group-salary">
              <label>Employee</label>
              <select
                name="EmployeeID"
                value={newSalaryRecord.EmployeeID}
                onChange={handleAddInputChange}
                required
              >
                <option value="">-- Select an employee --</option>
                {employees.map((emp) => (
                  <option key={emp.EmployeeID} value={emp.EmployeeID}>
                    {emp.FullName} - {emp.PositionName} - {emp.DepartmentName}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group-salary">
              <label>Department</label>
              <input
                type='text'
                value={newSalaryRecord.DepartmentName}
                readOnly
              />
            </div>

            <div className="form-group-salary">
              <label>Position</label>
              <input
                type='text'
                value={newSalaryRecord.PositionName}
                readOnly
              />
            </div>

            <div className="form-group-salary">
              <label>Salary Month</label>
              <input
                type='date'
                name="SalaryMonth"
                value={newSalaryRecord.SalaryMonth}
                onChange={handleAddInputChange}
                required
              />
            </div>

            <div className="form-group-salary">
              <label>Base Salary</label>
              <input
                type='text'
                name="BaseSalary"
                value={newSalaryRecord.BaseSalary}
                onChange={handleAddInputChange}
                required
              />
              <span className='dollad'>$</span>
            </div>

            <div className="form-group-salary">
              <label>Bonus</label>
              <input
                type='text'
                name="Bonus"
                value={newSalaryRecord.Bonus}
                onChange={handleAddInputChange}
                required
              />
              <span className='dollad'>$</span>
            </div>

            <div className="form-group-salary">
              <label>Deductions</label>
              <input
                type='text'
                name="Deductions"
                value={newSalaryRecord.Deductions}
                onChange={handleAddInputChange}
                required
              />
              <span className='dollad'>$</span>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={handleCloseAddModal}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-submit"
                disabled={loading}
              >{loading ? "Adding..." : "Add Record"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SalaryTable;