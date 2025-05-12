import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../axiosInstance';
import SearchForPayroll from "../../General/SearchForPayroll";
import "../../../styles/PayrollStyles/tableSalaries.css";

const AdminSalaryTable = () => {
  // Sử dụng component PayrollSalaries nhưng thay đổi đường dẫn của nút "Salary history"
  const [dataSalary, setDataSalary] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [selectedEmployeeData, setSelectedEmployeeData] = useState({
    BaseSalary: '',
    Bonus: '',
    Deductions: ''
  });
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [updateMessage, setUpdateMessage] = useState('');
  const [updateError, setUpdateError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState('FullName');
  const [selectedMonth, setSelectedMonth] = useState('all');
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

  // Fetch data when component mounts
  useEffect(() => {
    fetchSalary();
    fetchEmployees();
  }, []);

  const fetchSalary = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/payroll/salaries');
      setDataSalary(response.data);
      setError(null);
    } catch (err) {
      setError(err.message);
      setDataSalary([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await axiosInstance.get('/payroll/employees');
      // Log để debug
      console.log("Employees data:", response.data);
      setEmployees(response.data);
    } catch (err) {
      console.error("Error fetching employees:", err);
    }
  };

  // Format date function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  // Get month and year from date
  const getMonthYear = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  // Get all unique months from salary data
  const allMonths = [...new Set(dataSalary.map(item => getMonthYear(item.SalaryMonth)))];

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

  const handleUpdateClick = () => {
    if (selectedEmployeeId) {
      setShowModal(true);
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

  const handleRowSelect = (salaryId, employeeData) => {
    if (selectedEmployeeId === salaryId) {
      // Deselect if already selected
      setSelectedEmployeeId(null);
      setSelectedEmployeeData({
        BaseSalary: '',
        Bonus: '',
        Deductions: ''
      });
    } else {
      // Select new employee
      setSelectedEmployeeId(salaryId);
      setSelectedEmployeeData({
        BaseSalary: employeeData.BaseSalary,
        Bonus: employeeData.Bonus,
        Deductions: employeeData.Deductions
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEmployeeId) {
      setUpdateError("No employee selected");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.put(`/payroll/salaries/${selectedEmployeeId}`, {
        BaseSalary: selectedEmployeeData.BaseSalary,
        Bonus: selectedEmployeeData.Bonus,
        Deductions: selectedEmployeeData.Deductions
      });

      if (response.status === 200) {
        setUpdateMessage("Salary updated successfully");
        setUpdateError("");
        // Refresh data
        fetchSalary();
        // Close modal after a delay
        setTimeout(() => {
          setShowModal(false);
          setUpdateMessage("");
        }, 2000);
      }
    } catch (err) {
      setUpdateError(err.response?.data?.message || "Error updating salary");
      setUpdateMessage("");
    } finally {
      setLoading(false);
    }
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

  const handleAddSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs trước khi gửi
    if (!validateAddInputs()) {
      return;
    }

    setLoading(true);
    try {
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

      // Gọi API thêm lương với endpoint đúng
      const response = await axiosInstance.post('/payroll/salaries/adding', salaryData);

      if (response.status === 201) {
        setUpdateMessage("Salary record added successfully");
        setUpdateError("");
        // Refresh data
        fetchSalary();
        // Close modal after a delay
        setTimeout(() => {
          setShowAddModal(false);
          setUpdateMessage("");
        }, 2000);
      }
    } catch (err) {
      setUpdateError(err.response?.data?.error || "Error adding salary record");
      setUpdateMessage("");
    } finally {
      setLoading(false);
    }
  };

  const handleAddInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`Input change: ${name} = ${value}`);

    if (name === "EmployeeID" && value) {
      // Log để debug
      console.log("Looking for employee with ID:", value);
      console.log("Available employees:", employees);

      // Find the selected employee - convert value to same type for comparison
      // Ensure we're comparing the same types (string or number)
      const selectedEmployee = employees.find(emp => {
        const empIdStr = String(emp.EmployeeID);
        const valueStr = String(value);
        const match = empIdStr === valueStr;
        console.log(`Comparing: ${empIdStr} === ${valueStr} => ${match}`);
        return match;
      });

      console.log("Selected employee:", selectedEmployee);

      if (selectedEmployee) {
        setNewSalaryRecord({
          ...newSalaryRecord,
          [name]: value,
          FullName: selectedEmployee.FullName,
          DepartmentName: selectedEmployee.DepartmentName,
          DepartmentID: selectedEmployee.DepartmentID,
          PositionName: selectedEmployee.PositionName,
          PositionID: selectedEmployee.PositionID
        });
      } else {
        // Nếu không tìm thấy nhân viên, chỉ cập nhật EmployeeID
        setNewSalaryRecord({
          ...newSalaryRecord,
          [name]: value,
          FullName: '',
          DepartmentName: '',
          DepartmentID: '',
          PositionName: '',
          PositionID: ''
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
      // For other fields or when employee is deselected
      setNewSalaryRecord({
        ...newSalaryRecord,
        [name]: value
      });
    }
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
          <Link to={'/admin/salaries/history'} style={{ color: 'white' }}>
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
                {employees.length > 0 ? (
                  employees.map((emp) => (
                    <option key={emp.EmployeeID} value={String(emp.EmployeeID)}>
                      {emp.FullName} - {emp.PositionName} - {emp.DepartmentName}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>No employees available</option>
                )}
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

export default AdminSalaryTable;
