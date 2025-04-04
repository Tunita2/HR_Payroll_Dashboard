import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faTrash, 
  faExclamationTriangle 
} from "@fortawesome/free-solid-svg-icons";
import { fetchEmployees, deleteEmployee } from '../../../services/API';
import { getStatusIcon } from '../../../utils/Employee_Status';
import "./EmployeeTable.css";

function EmployeeTable() {
  // khai báo state 
  const [employees, setEmployees] = useState([]); // dữ liệu mặc định là rỗng setEmployees[ ]
  // có thể hiểu thế này: setEmployees(employees[])
  const [isLoading, setIsLoading] = useState(true); // 
  const [error, setError] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  // Lấy danh sách nhân viên khi component được mount
  useEffect(() => {
    const loadEmployees = async () => {
      try {
        //nhiệm vụ chính
        setIsLoading(true);
        const data = await fetchEmployees();// lưu kết quả của hàm vào data
        setEmployees(data); // Khi API trả dữ liệu, setEmployees(data) cập nhật state, làm component render lại với danh sách mới
       
        // nhiệm vụ phụ
        setError(null);
      } catch (err) {
        setError('Không thể tải danh sách nhân viên');
      } finally {
        setIsLoading(false);
      }
    };

    loadEmployees();
  }, []);// [ ] (dependency array rỗng): Đảm bảo useEffect không chạy lại khi state thay đổi.

  // Xử lý xóa nhân viên
  const handleDeleteEmployee = async (employeeId) => {
    try {
      // Hiển thị xác nhận trước khi xóa
      const isConfirmed = window.confirm('Bạn có chắc chắn muốn vô hiệu hóa nhân viên này?');
      
      if (!isConfirmed) return;

      await deleteEmployee(employeeId);
      
      // Cập nhật trạng thái nhân viên thay vì xóa khỏi danh sách
      const updatedEmployees = employees.map(emp => 
        emp.id === employeeId 
          ? { ...emp, status: 'inactive' } 
          : emp
      ); 
      
      setEmployees(updatedEmployees);
      setDeleteError(null);
    } catch (err) {
      setDeleteError(err.response?.data?.message || 'Không thể cập nhật trạng thái nhân viên');
    }
  };

  // Hiển thị trạng thái loading
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  // Hiển thị lỗi nếu có
  if (error) {
    return (
      <div className="error-message">
        <FontAwesomeIcon icon={faExclamationTriangle} className="error-icon" />
        <p>{error}</p>
      </div>
    );
  }

  // Render bảng nhân viên
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