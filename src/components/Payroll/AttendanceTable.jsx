import React, { useEffect, useState } from 'react';
import axiosInstance from '../Admin/axiosInstance';
import "../../styles/PayrollStyles/tableAttendance.css";
import SearchForPayroll from '../General/SearchForPayroll';

const AttendanceTable = () => {
  const [dataAttendance, setAttendance] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState("FullName")
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [selectedEmployeeData, setSelectedEmployeeData] = useState({
    WorkDays: '',
    AbsentDays: '',
    LeaveDays: ''
  });

  const [updateMessage, setUpdateMessage] = useState("");
  const [updateError, setUpdateError] = useState("");
  const [employees, setEmployees] = useState([]);
  const [newAttendanceRecord, setNewAttendanceRecord] = useState({
    EmployeeID: '',
    FullName: '',
    DepartmentName: '',
    DepartmentID: '',
    PositionName: '',
    PositionID: '',
    WorkDays: '',
    AbsentDays: '',
    LeaveDays: '',
    AttendanceMonth: new Date().toISOString().split('T')[0],
    CreatedAt: new Date().toISOString().split('T')[0],
  });

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/payroll/attendance');
      const sortedData = res.data.sort((a, b) => a.AttendanceID - b.AttendanceID);
      setAttendance(sortedData);
    } catch (err) {
      console.error("Failed to fetch attendance data", err);
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
    fetchAttendance();
    fetchEmployees();
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
    new Set(dataAttendance.map((item) => getMonthYear(item.AttendanceMonth)))
  );

  const searchCategories = [
    { value: "FullName", label: "Name" },
    { value: "EmployeeID", label: "Employee ID" },
    { value: "DepartmentName", label: "Department" },
    { value: "PositionName", label: "Position" }
  ];

  const filteredData = dataAttendance
    .filter(item => selectedMonth === "all" || getMonthYear(item.AttendanceMonth) === selectedMonth)
    .filter(item => {
      if (!searchQuery) return true;

      const searchValue = String(item[searchCategory] || "").toLowerCase();
      return searchValue.includes(searchQuery.toLowerCase());
    });

  // const handleRowSelect = (employeeId, employeeData) => {
  //   if (selectedEmployeeId === employeeId) {
  //     // If already selected, deselect
  //     setSelectedEmployeeId(null);
  //   } else {
  //     // Otherwise select this employee
  //     setSelectedEmployeeId(employeeId);
  //     setSelectedEmployeeData({
  //       WorkDays: employeeData.WorkDays,
  //       AbsentDays: employeeData.AbsentDays,
  //       LeaveDays: employeeData.LeaveDays
  //     });
  //   }
  // };
  // const handleUpdateClick = () => {
  //   if (selectedEmployeeId) {
  //     setShowModal(true);
  //     // Reset any previous messages
  //     setUpdateMessage("");
  //     setUpdateError("");
  //   } else {
  //     alert("Please select an employee to update salary");
  //   }
  // };
  // const handleAddClick = () => {
  //   setShowAddModal(true);
  //   setNewAttendanceRecord({
  //     EmployeeID: '',
  //     FullName: '',
  //     DepartmentName: '',
  //     DepartmentID: '',
  //     PositionName: '',
  //     PositionID: '',
  //     WorkDays: '',
  //     AbsentDays: '',
  //     LeaveDays: '',
  //     AttendanceMonth: new Date().toISOString().split('T')[0],
  //     CreatedAt: new Date().toISOString().split('T')[0],
  //   });
  //   setUpdateMessage("");
  //   setUpdateError("");
  // };
  // const handleCloseModal = () => {
  //   setShowModal(false);
  // };

  // const handleCloseAddModal = () => {
  //   setShowAddModal(false);
  // };

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   // Ensure only numbers and decimal point can be entered
  //   if (value === '' || /^\d*\.?\d*$/.test(value)) {
  //     setSelectedEmployeeData({
  //       ...selectedEmployeeData,
  //       [name]: value
  //     });
  //   }
  // };

  // const handleAddInputChange = (e) => {
  //   const { name, value } = e.target;

  //   if (name === 'EmployeeID') {
  //     const selectedEmployee = employees.find(emp => emp.EmployeeID === parseInt(value));
  //     if (selectedEmployee) {
  //       setNewAttendanceRecord({
  //         ...newAttendanceRecord,
  //         EmployeeID: value,
  //         FullName: selectedEmployee.FullName || '',
  //         DepartmentID: selectedEmployee.DepartmentID || '',
  //         DepartmentName: selectedEmployee.DepartmentName || '',
  //         PositionID: selectedEmployee.PositionID || '',
  //         PositionName: selectedEmployee.PositionName || ''
  //       });
  //     } else {
  //       setNewAttendanceRecord({
  //         ...newAttendanceRecord,
  //         EmployeeID: value,
  //         FullName: '',
  //         DepartmentID: '',
  //         DepartmentName: '',
  //         PositionID: '',
  //         PositionName: ''
  //       });
  //     }
  //   } else if (['WorkDays', 'AbsentDays', 'LeaveDays'].includes(name)) {
  //     // Ensure only numbers and decimal point can be entered
  //     if (value === '' || /^\d*\.?\d*$/.test(value)) {
  //       setNewAttendanceRecord({
  //         ...newAttendanceRecord,
  //         [name]: value
  //       });
  //     }
  //   } else {
  //     setNewAttendanceRecord({
  //       ...newAttendanceRecord,
  //       [name]: value
  //     });
  //   }
  // };

  // const validateInputs = () => {
  //   const { WorkDays, AbsentDays, LeaveDays } = selectedEmployeeData;

  //   // Check if inputs are not empty and are valid numbers
  //   if (!WorkDays || isNaN(parseFloat(WorkDays))) {
  //     setUpdateError("Work Days must be a valid number");
  //     return false;
  //   }

  //   if (!AbsentDays || isNaN(parseFloat(AbsentDays))) {
  //     setUpdateError("Absent Days must be a valid number");
  //     return false;
  //   }

  //   if (!LeaveDays || isNaN(parseFloat(LeaveDays))) {
  //     setUpdateError("Leave Days must be a valid number");
  //     return false;
  //   }

  //   return true;
  // };

  // const validateAddInputs = () => {
  //   const { EmployeeID, WorkDays, AbsentDays, LeaveDays, AttendanceMonth } = newAttendanceRecord;

  //   if (!EmployeeID) {
  //     setUpdateError("Please select an employee");
  //     return false;
  //   }

  //   if (!AttendanceMonth) {
  //     setUpdateError("Please select a salary month");
  //     return false;
  //   }

  //   if (!WorkDays || isNaN(parseFloat(WorkDays))) {
  //     setUpdateError("Work Days must be a valid number");
  //     return false;
  //   }

  //   if (!AbsentDays || isNaN(parseFloat(AbsentDays))) {
  //     setUpdateError("Absent Days must be a valid number");
  //     return false;
  //   }

  //   if (!LeaveDays || isNaN(parseFloat(LeaveDays))) {
  //     setUpdateError("Leave Days must be a valid number");
  //     return false;
  //   }

  //   return true;
  // };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   // Validate inputs before submitting
  //   if (!validateInputs()) {
  //     return;
  //   }

  //   try {
  //     setLoading(true);

  //     // Call API to update salary
  //     const response = await axios.put(`payroll/attendance/${selectedEmployeeId}`, selectedEmployeeData);

  //     // If update successful, show success message and refresh data
  //     setUpdateMessage("Attendance updated successfully!");
  //     fetchAttendance(); // Refresh the salary data

  //     // Close modal after short delay
  //     setTimeout(() => {
  //       setShowModal(false);
  //       setUpdateMessage("");
  //     }, 1500);

  //   } catch (error) {
  //     console.error("Error updating attendance:", error);
  //     setUpdateError(error.response?.data?.error || "Failed to update attendance. Please try again.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const handleAddSubmit = async (e) => {
  //   e.preventDefault();

  //   // Validate inputs trước khi gửi
  //   if (!validateAddInputs()) {
  //     return;
  //   }

  //   try {
  //     setLoading(true);

  //     const workDays = parseFloat(newAttendanceRecord.WorkDays) || 0;
  //     const absentDays = parseFloat(newAttendanceRecord.AbsentDays) || 0;
  //     const leaveDays = parseFloat(newAttendanceRecord.LeaveDays) || 0;

  //     // Chuẩn bị dữ liệu gửi lên
  //     const attendanceData = {
  //       EmployeeID: newAttendanceRecord.EmployeeID,
  //       AttendanceMonth: newAttendanceRecord.AttendanceMonth,
  //       WorkDays: workDays,
  //       AbsentDays: absentDays,
  //       LeaveDays: leaveDays,
  //     };

  //     // Gọi API thêm lương
  //     const response = await axios.post('payroll/attendance/adding', attendanceData);

  //     // Hiển thị thông báo + reload
  //     setUpdateMessage("Attendance record added successfully!");
  //     fetchAttendance(); // Refresh dữ liệu

  //     // Đóng modal sau 1.5s
  //     setTimeout(() => {
  //       setShowAddModal(false);
  //       setUpdateMessage("");
  //     }, 1500);

  //   } catch (error) {
  //     setUpdateError(error.response?.data?.error || "Failed to add attendance record. Please try again.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div>
      <div className='main-title'>Attendance list</div>
      <div className="appli-table-header">
        <SearchForPayroll
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchCategory={searchCategory}
          setSearchCategory={setSearchCategory}
          categories={searchCategories}
          placeholder="Search attendance records..."
        />
        <div className="button-group">
          <div className="btn-btn" >Update salary</div>
          <div className="btn-btn" >Add record</div>
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
                <th>Work Days</th>
                <th>Absent Days</th>
                <th>Leave Days</th>
                <th>Attendance Month</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((employee, index) => (
                <tr key={index} className="appli-table-row">
                  <td>{employee.AttendanceID}</td>
                  <td>{employee.EmployeeID}</td>
                  <td>{employee.FullName}</td>
                  <td>{employee.DepartmentName}</td>
                  <td>{employee.PositionName}</td>
                  <td>{employee.WorkDays}</td>
                  <td>{employee.AbsentDays}</td>
                  <td>{employee.LeaveDays}</td>
                  <td>{formatDate(employee.AttendanceMonth)}</td>
                  <td>{formatDate(employee.CreatedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="no-data">No salary records found for the selected filters</div>
      )}
      {/* Update Salary Modal */}
      {/* <div className='modal-overlay' style={{ display: showModal ? "flex" : "none" }}>
        <div className="update-salary-modal">
          <h3>Updating Attendance</h3>
          {updateMessage && <div className="update-success">{updateMessage}</div>}
          {updateError && <div className="update-error">{updateError}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group-salary">
              <label>Work Days</label>
              <input
                type='text'
                name="WorkDays"
                value={selectedEmployeeData.WorkDays}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group-salary">
              <label>Absent Days</label>
              <input
                type='text'
                name="AbsentDays"
                value={selectedEmployeeData.AbsentDays}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group-salary">
              <label>Leave Days</label>
              <input
                type='text'
                name="LeaveDays"
                value={selectedEmployeeData.LeaveDays}
                onChange={handleInputChange}
                required
              />
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
              >{loading ? "Updating..." : "Update Attendance"}
              </button>
            </div>
          </form>
        </div>
      </div> */}

      {/* Add New Salary Record Modal */}
      {/* <div className='modal-overlay' style={{ display: showAddModal ? "flex" : "none" }}>
        <div className="update-salary-modal">
          <h3>Adding new attendance record</h3>
          {updateMessage && <div className="update-success">{updateMessage}</div>}
          {updateError && <div className="update-error">{updateError}</div>}
          <form onSubmit={handleAddSubmit}>
            <div className="form-group-salary">
              <label>Employee</label>
              <select
                name="EmployeeID"
                value={newAttendanceRecord.EmployeeID}
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
                value={newAttendanceRecord.DepartmentName}
                readOnly
              />
            </div>

            <div className="form-group-salary">
              <label>Position</label>
              <input
                type='text'
                value={newAttendanceRecord.PositionName}
                readOnly
              />
            </div>

            <div className="form-group-salary">
              <label>Work Days</label>
              <input
                type='date'
                name="WorkDays"
                value={newAttendanceRecord.WorkDays}
                onChange={handleAddInputChange}
                required
              />
              <span className='dollad'>day(s)</span>
            </div>

            <div className="form-group-salary">
              <label>Absent Days</label>
              <input
                type='text'
                name="AbsentDays"
                value={newAttendanceRecord.AbsentDays}
                onChange={handleAddInputChange}
                required
              />
              <span className='dollad'>day(s)</span>
            </div>

            <div className="form-group-salary">
              <label>Leave Days</label>
              <input
                type='text'
                name="LeaveDays"
                value={newAttendanceRecord.LeaveDays}
                onChange={handleAddInputChange}
                required
              />
              <span className='dollad'>day(s)</span>
            </div>

            <div className="form-group-salary">
              <label>Attendance Month</label>
              <input
                type='text'
                name="AttendanceMonth"
                value={newAttendanceRecord.AttendanceMonth}
                onChange={handleAddInputChange}
                required
              />
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
      </div> */}
    </div>
  );
};

export default AttendanceTable;
