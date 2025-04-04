import axios from 'axios';

// Base URL cho API
const API_URL = 'http://localhost:3001/api';

// Lấy danh sách tất cả nhân viên
export const fetchEmployees = async () => {
  try {
    const response = await axios.get(`${API_URL}/employees`);
    return response.data;
  } catch (err) {
    console.error('Lỗi tải danh sách nhân viên:', err);
    throw err;
  }
};

// Xóa/vô hiệu hóa nhân viên
export const deleteEmployee = async (employeeId) => {
  try {
    const response = await axios.delete(`${API_URL}/employees/${employeeId}`);
    return response.data;
  } catch (err) {
    console.error('Lỗi cập nhật trạng thái nhân viên:', err);
    throw err;
  }
};