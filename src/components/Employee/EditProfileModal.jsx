"use client";

import React, { useState } from 'react';
import {
  FaTimes, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt,
  FaIdCard, FaBriefcase, FaCalendarAlt, FaUserTie
} from 'react-icons/fa';

// Chuẩn hóa dữ liệu gửi về backend
function normalizeProfileForAPI(formData) {
  return {
    FullName: formData.fullName || '',
    DateOfBirth: formData.dateOfBirth || '',
    Gender: formData.gender || '',
    Nationality: formData.nationality || '',
    Email: formData.email || '',
    PhoneNumber: formData.phone || '',
    Address: formData.address || '',
    EmployeeID: formData.employeeId || '',
    DepartmentName: formData.department || '',
    PositionName: formData.position || '',
    HireDate: formData.joinDate || '',
    Status: formData.status || '',
    Manager: formData.manager || ''
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
    const apiData = normalizeProfileForAPI(formData);
    onSave(formData, apiData);
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
                <InputField id="dateOfBirth" name="dateOfBirth" label="Date of Birth" value={formData.dateOfBirth} onChange={handleChange} type="date" />
              </InputRow>
              <InputRow>
                <SelectField id="gender" name="gender" label="Gender" value={formData.gender} onChange={handleChange} options={['Male', 'Female', 'Other']} />
                <InputField id="nationality" name="nationality" label="Nationality" value={formData.nationality} onChange={handleChange} />
              </InputRow>
            </Section>

            {/* Contact Information */}
            <Section icon={<FaEnvelope />} title="Contact Information">
              <InputRow>
                <InputField id="email" name="email" label="Email" icon={<FaEnvelope />} value={formData.email} onChange={handleChange} type="email" />
                <InputField id="phone" name="phone" label="Phone" icon={<FaPhone />} value={formData.phone} onChange={handleChange} />
              </InputRow>
              <InputRow>
                <InputField id="address" name="address" label="Address" icon={<FaMapMarkerAlt />} value={formData.address} onChange={handleChange} fullWidth />
              </InputRow>
            </Section>

            {/* Employment Details */}
            <Section icon={<FaBriefcase />} title="Employment Details">
              <InputRow>
                <InputField id="employeeId" name="employeeId" label="Employee ID" icon={<FaIdCard />} value={formData.employeeId} onChange={handleChange} />
                <InputField id="department" name="department" label="Department" icon={<FaBriefcase />} value={formData.department} onChange={handleChange} />
              </InputRow>
              <InputRow>
                <InputField id="position" name="position" label="Position" icon={<FaBriefcase />} value={formData.position} onChange={handleChange} />
                <InputField id="joinDate" name="joinDate" label="Join Date" icon={<FaCalendarAlt />} value={formData.joinDate} onChange={handleChange} type="date" />
              </InputRow>
              <InputRow>
                <InputField id="manager" name="manager" label="Manager" icon={<FaUserTie />} value={formData.manager} onChange={handleChange} />
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

const InputField = ({ id, name, label, icon, value, onChange, type = "text", fullWidth = false }) => (
  <div className={`form-group${fullWidth ? ' full-width' : ''}`}>
    <label htmlFor={id}>
      {icon && <span className="input-icon">{icon}</span>} {label}
    </label>
    <input id={id} name={name} value={value} onChange={onChange} type={type} />
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
