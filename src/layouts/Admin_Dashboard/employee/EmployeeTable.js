import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./EmployeeTable.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faTrash, 
  faUserCheck, 
  faUserClock, 
  faUserTimes, 
  faExclamationTriangle 
} from "@fortawesome/free-solid-svg-icons";

function EmployeeTable() {
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  const fetchEmployees = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://localhost:3001/api/employees');
      setEmployees(response.data);
      setIsLoading(false);
      setError(null);
    } catch (err) {
      console.error('Lỗi tải danh sách nhân viên:', err);
      setError('Không thể tải danh sách nhân viên');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleDeleteEmployee = async (employeeId) => {
    try {
      // Hiển thị xác nhận trước khi xóa
      const isConfirmed = window.confirm('Bạn có chắc chắn muốn vô hiệu hóa nhân viên này?');
      
      if (!isConfirmed) return;

      const response = await axios.delete(`http://localhost:3001/api/employees/${employeeId}`);
      
      // Cập nhật trạng thái nhân viên thay vì xóa khỏi danh sách
      const updatedEmployees = employees.map(emp => 
        emp.id === employeeId 
          ? { ...emp, status: 'inactive' } 
          : emp
      );
      
      setEmployees(updatedEmployees);
      setDeleteError(null);
    } catch (err) {
      console.error('Lỗi cập nhật trạng thái nhân viên:', err);
      setDeleteError(err.response?.data?.message || 'Không thể cập nhật trạng thái nhân viên');
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'active':
        return { icon: faUserCheck, className: 'active' };
      case 'inactive':
        return { icon: faUserClock, className: 'inactive' };
      default:
        return { icon: faUserTimes, className: 'unknown' };
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        <FontAwesomeIcon icon={faExclamationTriangle} className="error-icon" />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="employee-table-container">
      {deleteError && (
        <div className="delete-error-message">
          <FontAwesomeIcon icon={faExclamationTriangle} className="error-icon" />
          <p>{deleteError}</p>
        </div>
      )}
      <table className="employee-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Start Date</th>
            <th>Department</th>
            <th>Position</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Status</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => {
            const { icon, className } = getStatusIcon(employee.status);
            return (
              <tr 
                key={employee.id} 
                className={employee.status === 'inactive' ? 'inactive-row' : ''}
              >
                <td>{employee.id}</td>
                <td>{employee.name}</td>
                <td>{employee.startDate}</td>
                <td>{employee.department}</td>
                <td>{employee.position}</td>
                <td>{employee.email}</td>
                <td>{employee.phone}</td>
                <td className="status-cell">
                  <FontAwesomeIcon
                    icon={icon}
                    className={`status-icon ${className}`}
                  />
                  <span className="status-text">{employee.status}</span>
                </td>
                <td>
                  {employee.status === 'active' && (
                    <button 
                      className="action-button delete"
                      onClick={() => handleDeleteEmployee(employee.id)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default EmployeeTable;