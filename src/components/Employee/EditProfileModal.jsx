"use client";

import React, { useState } from 'react';
import {
  FaTimes, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt,
  FaIdCard, FaBriefcase, FaCalendarAlt, FaUserTie
} from 'react-icons/fa';

// Chuẩn hóa dữ liệu gửi về backend
function normalizeProfileForAPI(formData) {
  // Đảm bảo DateOfBirth được gửi đúng định dạng cho SQL Server (YYYY-MM-DD)
  let dateOfBirth = '';

  // Ưu tiên sử dụng dateOfBirthRaw từ input type="date" nếu có
  if (formData.dateOfBirthRaw) {
    // Input type="date" luôn trả về định dạng YYYY-MM-DD
    dateOfBirth = formData.dateOfBirthRaw;
    console.log("Using dateOfBirthRaw directly:", dateOfBirth);
  }
  // Nếu không có dateOfBirthRaw, thử dùng dateOfBirth
  else if (formData.dateOfBirth) {
    // Kiểm tra xem đã là định dạng YYYY-MM-DD chưa
    if (/^\d{4}-\d{2}-\d{2}$/.test(formData.dateOfBirth)) {
      // Đã đúng định dạng, sử dụng trực tiếp
      dateOfBirth = formData.dateOfBirth;
      console.log("Using dateOfBirth in YYYY-MM-DD format:", dateOfBirth);
    } else {
      // Thử chuyển đổi từ định dạng khác
      try {
        const date = new Date(formData.dateOfBirth);
        if (!isNaN(date.getTime())) {
          // Format lại thành YYYY-MM-DD
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          dateOfBirth = `${year}-${month}-${day}`;
          console.log("Converted dateOfBirth to YYYY-MM-DD:", dateOfBirth);
        }
      } catch (err) {
        console.error("Error formatting date:", err);
      }
    }
  }

  // Đảm bảo Gender được gửi đúng định dạng
  let gender = formData.gender || '';

  console.log("Sending to API - DateOfBirth:", dateOfBirth);
  console.log("Sending to API - Gender:", gender);

  return {
    FullName: formData.fullName || '',
    DateOfBirth: dateOfBirth,
    Gender: gender,
    Email: formData.email || '',
    PhoneNumber: formData.phone || '',
    // Không gửi DepartmentID và PositionID vì chúng không thể được thay đổi bởi employee
    // Chỉ gửi các trường mà employee được phép cập nhật
    Status: formData.status || ''
  };
}

const EditProfileModal = ({ profileData, onSave, onCancel }) => {
  const [formData, setFormData] = useState({ ...profileData });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Tạo bản sao của formData để xử lý
    const processedFormData = { ...formData };

    // Đảm bảo dateOfBirth được lấy từ input type="date" (dateOfBirthRaw)
    if (formData.dateOfBirthRaw) {
      // Sử dụng giá trị từ input type="date" (đã ở định dạng YYYY-MM-DD)
      // Tạo định dạng hiển thị cho người dùng
      try {
        const date = new Date(formData.dateOfBirthRaw);
        if (!isNaN(date.getTime())) {
          const formattedDate = date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
          processedFormData.dateOfBirth = formattedDate;
          console.log("Formatted date for display:", formattedDate);
          console.log("Raw date for API:", formData.dateOfBirthRaw);
        }
      } catch (err) {
        console.error("Error formatting display date:", err);
        processedFormData.dateOfBirth = formData.dateOfBirthRaw;
      }
    }

    console.log("Form data before API submission:", processedFormData);
    const apiData = normalizeProfileForAPI(processedFormData);
    console.log("API data for submission:", apiData);

    onSave(processedFormData, apiData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Edit Profile</h2>
          <button className="modal-close-btn" onClick={onCancel}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Personal Information */}
            <Section icon={<FaUser />} title="Personal Information">
              <InputRow>
                <InputField id="fullName" name="fullName" label="Full Name" value={formData.fullName} onChange={handleChange} />
                <InputField id="dateOfBirthRaw" name="dateOfBirthRaw" label="Date of Birth" value={formData.dateOfBirthRaw || ''} onChange={handleChange} type="date" />
              </InputRow>
              <InputRow>
                <SelectField id="gender" name="gender" label="Gender" value={formData.gender} onChange={handleChange} options={['Male', 'Female', 'Other']} />
              </InputRow>
            </Section>

            {/* Contact Information */}
            <Section icon={<FaEnvelope />} title="Contact Information">
              <InputRow>
                <InputField id="email" name="email" label="Email" icon={<FaEnvelope />} value={formData.email} onChange={handleChange} type="email" />
                <InputField id="phone" name="phone" label="Phone" icon={<FaPhone />} value={formData.phone} onChange={handleChange} />
              </InputRow>
            </Section>

            {/* Employment Details */}
            <Section icon={<FaBriefcase />} title="Employment Details">
              <InputRow>
                <InputField id="employeeId" name="employeeId" label="Employee ID" icon={<FaIdCard />} value={formData.employeeId} onChange={handleChange} disabled />
                <InputField id="department" name="department" label="Department" icon={<FaBriefcase />} value={formData.department} onChange={handleChange} disabled />
              </InputRow>
              <InputRow>
                <InputField id="position" name="position" label="Position" icon={<FaBriefcase />} value={formData.position} onChange={handleChange} disabled />
              </InputRow>
            </Section>
          </div>

          <div className="modal-footer">
            <button type="button" className="cancel-btn" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="save-btn">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Component phụ trợ để tổ chức lại UI
const Section = ({ icon, title, children }) => (
  <div className="form-section">
    <div className="form-section-header">
      {icon && <span className="form-section-icon">{icon}</span>}
      <h3>{title}</h3>
    </div>
    {children}
  </div>
);

const InputRow = ({ children }) => (
  <div className="form-row">{children}</div>
);

const InputField = ({ id, name, label, icon, value, onChange, type = "text", fullWidth = false, disabled = false }) => (
  <div className={`form-group${fullWidth ? ' full-width' : ''}${disabled ? ' disabled-field' : ''}`}>
    <label htmlFor={id}>
      {icon && <span className="input-icon">{icon}</span>} {label}
    </label>
    <input
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      type={type}
      disabled={disabled}
      className={disabled ? 'read-only-input' : ''}
    />
  </div>
);

const SelectField = ({ id, name, label, value, onChange, options = [] }) => (
  <div className="form-group">
    <label htmlFor={id}>{label}</label>
    <select id={id} name={name} value={value} onChange={onChange}>
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

export default EditProfileModal;
