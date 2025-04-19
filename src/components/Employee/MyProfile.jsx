import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaIdCard, FaBriefcase, FaCalendarAlt, FaUserTie } from 'react-icons/fa';
import "../../styles/EmployeeStyles/MyProfile.css";
import EditProfileModal from "./EditProfileModal";
import axios from 'axios';

const API_URL = 'http://localhost:3001/api/employee';

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
        address: "",
        employeeId: "",
        department: "",
        position: "",
        joinDate: "",
        manager: ""
    });

    const employeeId = 1;

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_URL}/profile/${employeeId}`);

                const apiData = response.data;
                const formattedDate = apiData.dateOfBirth ? new Date(apiData.dateOfBirth).toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                }) : '';

                const formattedJoinDate = apiData.joinDate ? new Date(apiData.joinDate).toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                }) : '';

                setProfileData({
                    ...profileData,
                    fullName: apiData.fullName || '',
                    dateOfBirth: formattedDate,
                    gender: apiData.gender || '',
                    email: apiData.email || '',
                    phone: apiData.phoneNumber || '',
                    employeeId: apiData.employeeId?.toString() || '',
                    department: apiData.department || '',
                    position: apiData.position || '',
                    joinDate: formattedJoinDate
                });

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
                    address: "123 Nguyen Hue, Ho Chi Minh City",
                    employeeId: "EMP-1234",
                    department: "IT",
                    position: "Software Engineer",
                    joinDate: "01 Mar 2020",
                    manager: "Jane Smith"
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

    const handleSaveProfile = async (newData, apiData) => {
        try {
            setLoading(true);

            await axios.put(`${API_URL}/profile/${employeeId}`, apiData);

            setProfileData(newData);
            setIsEditing(false);
            setError(null);

            alert('Profile updated successfully!');
        } catch (err) {
            console.error('Error updating profile:', err);
            setError('Failed to update profile. Please try again.');
            alert('Failed to update profile. Please try again.');
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
                        <div className="profile-avatar-wrapper">
                            <div className="profile-avatar-container">
                                <img src="/assets/images/avatar.jpg" alt="User Avatar" className="profile-avatar" onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/150' }} />
                            </div>
                        </div>
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
                            <div className="detail-item with-icon">
                                <FaMapMarkerAlt className="detail-icon" />
                                <div className="detail-content">
                                    <span className="detail-label">Address:</span>
                                    <span className="detail-value">{profileData.address}</span>
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
                            <div className="detail-item with-icon">
                                <FaUserTie className="detail-icon" />
                                <div className="detail-content">
                                    <span className="detail-label">Manager:</span>
                                    <span className="detail-value">{profileData.manager}</span>
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
