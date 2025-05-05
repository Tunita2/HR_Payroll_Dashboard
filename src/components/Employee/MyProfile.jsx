import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaIdCard, FaBriefcase, FaCalendarAlt } from 'react-icons/fa';
import "../../styles/EmployeeStyles/MyProfile.css";
import EditProfileModal from "./EditProfileModal";
import axios from 'axios';

const API_URL = 'http://localhost:3001/api/employee';

// Hàm chuẩn hóa dữ liệu profile cho cả hai DB
function normalizeProfileData(apiData) {
    // Xử lý DateOfBirth để lưu cả định dạng hiển thị và định dạng gửi lên server
    let dateOfBirthFormatted = '';
    let dateOfBirthRaw = '';

    if (apiData.DateOfBirth) {
        const date = new Date(apiData.DateOfBirth);
        dateOfBirthFormatted = date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
        dateOfBirthRaw = date.toISOString().split('T')[0]; // Format YYYY-MM-DD for input type="date"
    } else if (apiData.dateOfBirth) {
        const date = new Date(apiData.dateOfBirth);
        dateOfBirthFormatted = date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
        dateOfBirthRaw = date.toISOString().split('T')[0]; // Format YYYY-MM-DD for input type="date"
    }

    console.log("API Data DateOfBirth:", apiData.DateOfBirth);
    console.log("Formatted DateOfBirth:", dateOfBirthFormatted);
    console.log("Raw DateOfBirth for input:", dateOfBirthRaw);

    return {
        fullName: apiData.FullName || apiData.fullName || '',
        dateOfBirth: dateOfBirthFormatted, // Định dạng hiển thị
        dateOfBirthRaw: dateOfBirthRaw, // Định dạng cho input type="date"
        gender: apiData.Gender || apiData.gender || '',
        nationality: apiData.Nationality || apiData.nationality || 'Vietnamese',
        email: apiData.Email || apiData.email || '',
        phone: apiData.PhoneNumber || apiData.phone || '',
        employeeId: apiData.EmployeeID?.toString() || apiData.employeeId?.toString() || '',
        department: apiData.DepartmentName || apiData.departmentName || apiData.department || '',
        position: apiData.PositionName || apiData.positionName || apiData.position || '',
        joinDate: apiData.HireDate
            ? new Date(apiData.HireDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
            : (apiData.joinDate
                ? new Date(apiData.joinDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
                : ''),
        status: apiData.Status || apiData.status || ''
    };
}

const MyProfile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [profileData, setProfileData] = useState({
        fullName: "",
        dateOfBirth: "",
        gender: "",
        nationality: "Vietnamese",
        email: "",
        phone: "",
        employeeId: "",
        department: "",
        position: "",
        joinDate: "",
        status: ""
    });

    // Lấy employeeId từ localStorage
    const employeeId = localStorage.getItem('employeeId');
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_URL}/profile`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const apiData = response.data;
                console.log("API profile data:", apiData);
                setProfileData(normalizeProfileData(apiData));

                setError(null);
            } catch (err) {
                console.error('Error fetching profile data:', err);
                setError('Failed to load profile data. Please try again later.');

                setProfileData({
                    fullName: "John Doe",
                    dateOfBirth: "15 Jan 1990",
                    gender: "Male",
                    nationality: "Vietnamese",
                    email: "john.doe@example.com",
                    phone: "+84 123 456 789",
                    employeeId: "EMP-1234",
                    department: "IT",
                    position: "Software Engineer",
                    joinDate: "01 Mar 2020",
                    status: "Active"
                });
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [employeeId]);

    const handleEditProfile = () => {
        setIsEditing(true);
    };

    const handleSaveProfile = async (_, apiData) => {
        try {
            setLoading(true);
            console.log("Sending API data to server:", apiData);

            const response = await axios.put(`${API_URL}/profile`, apiData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.log("Server response:", response.data);

            // Sau khi cập nhật thành công, lấy lại dữ liệu mới từ server
            const updatedResponse = await axios.get(`${API_URL}/profile`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.log("Updated profile data from server:", updatedResponse.data);

            // Cập nhật state với dữ liệu mới từ server
            setProfileData(normalizeProfileData(updatedResponse.data));
            setIsEditing(false);
            setError(null);

            alert('Profile updated successfully!');
        } catch (err) {
            console.error('Error updating profile:', err);

            // Hiển thị thông báo lỗi cụ thể từ API nếu có
            let errorMessage = 'Failed to update profile. Please try again.';
            if (err.response && err.response.data && err.response.data.error) {
                errorMessage = err.response.data.error;
            }

            setError(errorMessage);
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="main-content-area">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading profile data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="main-content-area">
                <div className="error-container">
                    <p className="error-message">{error}</p>
                    <button onClick={() => window.location.reload()} className="retry-button">
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="main-content-area">
            <div className="enhanced-profile-container">
                <div className="profile-header-banner">
                    <div className="profile-header-content">
                        <div className="profile-name-container">
                            <h1 className="profile-name">{profileData.fullName}</h1>
                            <div className="profile-position">
                                <FaBriefcase className="profile-icon" />
                                <span>{profileData.position}</span>
                            </div>
                            <div className="profile-department">
                                <span>{profileData.department} Department</span>
                            </div>
                            <button
                                onClick={handleEditProfile}
                                className="edit-profile-button"
                            >
                                Edit Profile
                            </button>
                        </div>
                    </div>
                </div>

                <div className="profile-content">
                    <div className="profile-section personal-info-section">
                        <h2 className="section-title">
                            <FaUser className="section-icon" />
                            Personal Information
                        </h2>
                        <div className="profile-details">
                            <div className="detail-item">
                                <span className="detail-label">Full Name:</span>
                                <span className="detail-value">{profileData.fullName}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Date of Birth:</span>
                                <span className="detail-value">{profileData.dateOfBirth}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Gender:</span>
                                <span className="detail-value">{profileData.gender}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Nationality:</span>
                                <span className="detail-value">{profileData.nationality}</span>
                            </div>
                        </div>
                    </div>

                    <div className="profile-section contact-info-section">
                        <h2 className="section-title">
                            <FaEnvelope className="section-icon" />
                            Contact Information
                        </h2>
                        <div className="profile-details">
                            <div className="detail-item with-icon">
                                <FaEnvelope className="detail-icon" />
                                <div className="detail-content">
                                    <span className="detail-label">Email:</span>
                                    <span className="detail-value">{profileData.email}</span>
                                </div>
                            </div>
                            <div className="detail-item with-icon">
                                <FaPhone className="detail-icon" />
                                <div className="detail-content">
                                    <span className="detail-label">Phone:</span>
                                    <span className="detail-value">{profileData.phone}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="profile-section employment-details-section">
                        <h2 className="section-title">
                            <FaBriefcase className="section-icon" />
                            Employment Details
                        </h2>
                        <div className="profile-details">
                            <div className="detail-item with-icon">
                                <FaIdCard className="detail-icon" />
                                <div className="detail-content">
                                    <span className="detail-label">Employee ID:</span>
                                    <span className="detail-value">{profileData.employeeId}</span>
                                </div>
                            </div>
                            <div className="detail-item with-icon">
                                <FaBriefcase className="detail-icon" />
                                <div className="detail-content">
                                    <span className="detail-label">Department:</span>
                                    <span className="detail-value">{profileData.department}</span>
                                </div>
                            </div>
                            <div className="detail-item with-icon">
                                <FaBriefcase className="detail-icon" />
                                <div className="detail-content">
                                    <span className="detail-label">Position:</span>
                                    <span className="detail-value">{profileData.position}</span>
                                </div>
                            </div>
                            <div className="detail-item with-icon">
                                <FaCalendarAlt className="detail-icon" />
                                <div className="detail-content">
                                    <span className="detail-label">Join Date:</span>
                                    <span className="detail-value">{profileData.joinDate}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {isEditing && (
                    <EditProfileModal
                        profileData={profileData}
                        onSave={handleSaveProfile}
                        onCancel={() => setIsEditing(false)}
                    />
                )}
            </div>
        </div>
    );
};

export default MyProfile;
