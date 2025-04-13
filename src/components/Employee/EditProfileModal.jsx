"use client"

import React, { useState } from 'react';
import { FaTimes, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaIdCard, FaBriefcase, FaCalendarAlt, FaUserTie } from 'react-icons/fa';

const EditProfileModal = ({ profileData, onSave, onCancel }) => {
    const [formData, setFormData] = useState({ ...profileData });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
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
                        <div className="form-section">
                            <div className="form-section-header">
                                <FaUser className="form-section-icon" />
                                <h3>Personal Information</h3>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="fullName">Full Name</label>
                                    <input
                                        id="fullName"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="dateOfBirth">Date of Birth</label>
                                    <input
                                        id="dateOfBirth"
                                        name="dateOfBirth"
                                        value={formData.dateOfBirth}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="gender">Gender</label>
                                    <select
                                        id="gender"
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                    >
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="nationality">Nationality</label>
                                    <input
                                        id="nationality"
                                        name="nationality"
                                        value={formData.nationality}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="form-section">
                            <div className="form-section-header">
                                <FaEnvelope className="form-section-icon" />
                                <h3>Contact Information</h3>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="email">
                                        <FaEnvelope className="input-icon" /> Email
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="phone">
                                        <FaPhone className="input-icon" /> Phone
                                    </label>
                                    <input
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group full-width">
                                    <label htmlFor="address">
                                        <FaMapMarkerAlt className="input-icon" /> Address
                                    </label>
                                    <input
                                        id="address"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Employment Details */}
                        <div className="form-section">
                            <div className="form-section-header">
                                <FaBriefcase className="form-section-icon" />
                                <h3>Employment Details</h3>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="employeeId">
                                        <FaIdCard className="input-icon" /> Employee ID
                                    </label>
                                    <input
                                        id="employeeId"
                                        name="employeeId"
                                        value={formData.employeeId}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="department">
                                        <FaBriefcase className="input-icon" /> Department
                                    </label>
                                    <input
                                        id="department"
                                        name="department"
                                        value={formData.department}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="position">
                                        <FaBriefcase className="input-icon" /> Position
                                    </label>
                                    <input
                                        id="position"
                                        name="position"
                                        value={formData.position}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="joinDate">
                                        <FaCalendarAlt className="input-icon" /> Join Date
                                    </label>
                                    <input
                                        id="joinDate"
                                        name="joinDate"
                                        value={formData.joinDate}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="manager">
                                        <FaUserTie className="input-icon" /> Manager
                                    </label>
                                    <input
                                        id="manager"
                                        name="manager"
                                        value={formData.manager}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>
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

export default EditProfileModal;