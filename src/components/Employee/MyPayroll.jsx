"use client"

import React, { useState, useEffect } from 'react';
import { FaFileInvoiceDollar, FaCalendarAlt, FaMoneyBillWave, FaDownload, FaHistory, FaChartLine, FaInfoCircle } from 'react-icons/fa';
import "../../styles/EmployeeStyles/MyPayroll.css";
import axios from 'axios';

// Hàm chuẩn hóa dữ liệu payroll cho cả hai DB - đã cập nhật theo schema mới
function normalizePayrollData(apiData) {
    // Dữ liệu lương hiện tại
    const current = apiData.currentPayroll || apiData.current || {};
    // Dữ liệu lịch sử lương
    const history = apiData.payrollHistory || apiData.history || [];

    // Chuẩn hóa lương hiện tại
    const normalizedCurrent = {
        month: current.SalaryMonth ? new Date(current.SalaryMonth).toLocaleDateString('vi-VN', { month: 'long' }) : '',
        year: current.SalaryMonth ? new Date(current.SalaryMonth).getFullYear() : '',
        salary: {
            basic: current.BaseSalary || 0,
            bonus: current.Bonus || 0,
            deductions: current.Deductions || 0,
            netSalary: current.NetSalary || 0
        },
        createdAt: current.CreatedAt || ''
    };

    // Chuẩn hóa lịch sử lương
    const normalizedHistory = history.map((item, idx) => ({
        id: item.SalaryID || idx + 1,
        month: item.SalaryMonth ? new Date(item.SalaryMonth).toLocaleDateString('vi-VN', { month: 'long' }) : '',
        year: item.SalaryMonth ? new Date(item.SalaryMonth).getFullYear() : '',
        netSalary: item.NetSalary || 0,
        baseSalary: item.BaseSalary || 0,
        bonus: item.Bonus || 0,
        deductions: item.Deductions || 0,
        createdAt: item.CreatedAt ? new Date(item.CreatedAt).toLocaleDateString('vi-VN') : ''
    }));

    return {
        currentPayroll: normalizedCurrent,
        payrollHistory: normalizedHistory
    };
}

const API_URL = 'http://localhost:3001/api/employee/payroll';

const MyPayroll = () => {
    const [activeTab, setActiveTab] = useState('current');
    const [selectedPayslip, setSelectedPayslip] = useState(null);
    const [currentPayroll, setCurrentPayroll] = useState(null);
    const [payrollHistory, setPayrollHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPayroll = async () => {
            try {
                setLoading(true);
                setError(null);
                const token = localStorage.getItem('token');

                console.log('Fetching payroll data from:', API_URL);
                console.log('Using token:', token ? 'Token exists' : 'No token found');

                const response = await axios.get(API_URL, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                console.log('Payroll API response:', response.data);

                // Check if we have valid data
                if (!response.data || (Array.isArray(response.data.payrollHistory) && response.data.payrollHistory.length === 0)) {
                    console.log('No payroll data found');
                    setCurrentPayroll(null);
                    setPayrollHistory([]);
                    setError('No payroll data available for your account.');
                    setLoading(false);
                    return;
                }

                const data = normalizePayrollData(response.data);
                setCurrentPayroll(data.currentPayroll);
                setPayrollHistory(data.payrollHistory);
            } catch (err) {
                console.error('Error fetching payroll data:', err);
                if (err.response) {
                    console.error('Error response:', err.response.data);
                    setError(`Failed to load payroll data: ${err.response.data.error || err.response.statusText}`);
                } else if (err.request) {
                    console.error('No response received');
                    setError('Failed to load payroll data: No response from server. Please check your connection.');
                } else {
                    console.error('Error setting up request:', err.message);
                    setError(`Failed to load payroll data: ${err.message}`);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchPayroll();
    }, []);

    const handleDownloadPayslip = () => {
        // Implement download functionality
        alert('Downloading payslip...');
    };

    const handleViewPayslip = (payslip) => {
        setSelectedPayslip(payslip);
    };

    const closePayslipModal = () => {
        setSelectedPayslip(null);
    };

    if (loading) {
        return (
            <div className="main-content-area">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading payroll data...</p>
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

    // Handle case when there's no payroll data
    if (!loading && (!currentPayroll || !payrollHistory.length)) {
        return (
            <div className="main-content-area">
                <div className="payroll-container">
                    <div className="payroll-header-banner">
                        <div className="payroll-header-content">
                            <div className="payroll-icon-wrapper">
                                <div className="payroll-icon-container">
                                    <FaFileInvoiceDollar className="payroll-icon" />
                                </div>
                            </div>
                            <div className="payroll-title-container">
                                <h1 className="payroll-title">My Payroll</h1>
                                <div className="payroll-subtitle">
                                    <span>View and manage your salary information</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="no-data-container" style={{
                        padding: '2rem',
                        textAlign: 'center',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '8px',
                        margin: '2rem'
                    }}>
                        <h2 style={{ marginBottom: '1rem', color: '#495057' }}>No Payroll Data Available</h2>
                        <p style={{ marginBottom: '1.5rem', color: '#6c757d' }}>
                            There is currently no payroll data available for your account.
                            This could be because:
                        </p>
                        <ul style={{
                            textAlign: 'left',
                            maxWidth: '500px',
                            margin: '0 auto',
                            marginBottom: '1.5rem',
                            color: '#6c757d'
                        }}>
                            <li>You are a new employee and your first payroll has not been processed yet</li>
                            <li>The payroll system is being updated</li>
                            <li>There might be a technical issue with the payroll database</li>
                        </ul>
                        <p style={{ color: '#6c757d' }}>
                            If you believe this is an error, please contact the HR department.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            style={{
                                marginTop: '1.5rem',
                                padding: '0.5rem 1rem',
                                backgroundColor: '#4a96ff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Refresh Data
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="main-content-area">
            <div className="payroll-container">
                <div className="payroll-header-banner">
                    <div className="payroll-header-content">
                        <div className="payroll-icon-wrapper">
                            <div className="payroll-icon-container">
                                <FaFileInvoiceDollar className="payroll-icon" />
                            </div>
                        </div>
                        <div className="payroll-title-container">
                            <h1 className="payroll-title">My Payroll</h1>
                            <div className="payroll-subtitle">
                                <span>View and manage your salary information</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="payroll-tabs">
                    <button
                        className={`payroll-tab ${activeTab === 'current' ? 'active' : ''}`}
                        onClick={() => setActiveTab('current')}
                    >
                        Current Payroll
                    </button>
                    <button
                        className={`payroll-tab ${activeTab === 'history' ? 'active' : ''}`}
                        onClick={() => setActiveTab('history')}
                    >
                        Payroll History
                    </button>
                </div>

                <div className="payroll-content">
                    {activeTab === 'current' ? (
                        <div className="current-payroll">
                            <div className="payroll-section summary-section">
                                <h2 className="section-title">
                                    <FaMoneyBillWave className="section-icon" />
                                    Current Salary Summary
                                </h2>
                                <div className="salary-summary">
                                    <div className="summary-period">
                                        <FaCalendarAlt className="summary-icon" />
                                        <span>{currentPayroll?.month} {currentPayroll?.year}</span>
                                    </div>
                                    <div className="summary-amount">
                                        <h3>${currentPayroll?.salary?.netSalary?.toLocaleString()}</h3>
                                        <span>Net Salary</span>
                                    </div>
                                    <button className="download-btn" onClick={handleDownloadPayslip}>
                                        <FaDownload className="download-icon" />
                                        Download Payslip
                                    </button>
                                </div>
                            </div>

                            <div className="payroll-details-container">
                                <div className="payroll-section earnings-section">
                                    <h2 className="section-title">
                                        <FaChartLine className="section-icon" />
                                        Earnings
                                    </h2>
                                    <div className="payroll-details">
                                        <div className="detail-row">
                                            <span className="detail-label">Basic Salary:</span>
                                            <span className="detail-value">${currentPayroll?.salary?.basic?.toLocaleString()}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-label">Bonus:</span>
                                            <span className="detail-value">${currentPayroll?.salary?.bonus?.toLocaleString()}</span>
                                        </div>
                                        <div className="detail-row total-row">
                                            <span className="detail-label">Gross Salary:</span>
                                            <span className="detail-value">${((Number(currentPayroll?.salary?.basic) || 0) + (Number(currentPayroll?.salary?.bonus) || 0)).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="payroll-section deductions-section">
                                    <h2 className="section-title">
                                        <FaMoneyBillWave className="section-icon" />
                                        Deductions
                                    </h2>
                                    <div className="payroll-details">
                                        <div className="detail-row">
                                            <span className="detail-label">Total Deductions:</span>
                                            <span className="detail-value">-${currentPayroll?.salary?.deductions?.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="payroll-section payment-section">
                                <h2 className="section-title">
                                    <FaInfoCircle className="section-icon" />
                                    Payment Information
                                </h2>
                                <div className="payroll-details">
                                    <div className="detail-row">
                                        <span className="detail-label">Net Salary:</span>
                                        <span className="detail-value">${currentPayroll?.salary?.netSalary?.toLocaleString()}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="detail-label">Created Date:</span>
                                        <span className="detail-value">{currentPayroll?.createdAt}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="payroll-history">
                            <div className="payroll-section history-section">
                                <h2 className="section-title">
                                    <FaHistory className="section-icon" />
                                    Payroll History
                                </h2>
                                <div className="payroll-table-container">
                                    <table className="payroll-table">
                                        <thead>
                                            <tr>
                                                <th>Period</th>
                                                <th>Base Salary</th>
                                                <th>Bonus</th>
                                                <th>Gross Salary</th>
                                                <th>Deductions</th>
                                                <th>Net Salary</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {payrollHistory.map(payslip => (
                                                <tr key={payslip.id}>
                                                    <td>{payslip.month} {payslip.year}</td>
                                                    <td>${payslip.baseSalary.toLocaleString()}</td>
                                                    <td>${payslip.bonus.toLocaleString()}</td>
                                                    <td>${((Number(payslip.baseSalary) || 0) + (Number(payslip.bonus) || 0)).toLocaleString()}</td>
                                                    <td>-${payslip.deductions.toLocaleString()}</td>
                                                    <td>${payslip.netSalary.toLocaleString()}</td>
                                                    <td>
                                                        <div className="action-buttons">
                                                            <button
                                                                className="view-btn"
                                                                onClick={() => handleViewPayslip(payslip)}
                                                            >
                                                                View
                                                            </button>
                                                            <button
                                                                className="download-btn-small"
                                                                onClick={handleDownloadPayslip}
                                                            >
                                                                <FaDownload />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {selectedPayslip && (
                <div className="modal-overlay">
                    <div className="modal-container payslip-modal">
                        <div className="modal-header">
                            <h2>Payslip - {selectedPayslip.month} {selectedPayslip.year}</h2>
                            <button className="modal-close-btn" onClick={closePayslipModal}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="payslip-details">
                                <div className="payslip-summary">
                                    <div className="payslip-summary-item">
                                        <span className="summary-label">Base Salary:</span>
                                        <span className="summary-value">${selectedPayslip.baseSalary.toLocaleString()}</span>
                                    </div>
                                    <div className="payslip-summary-item">
                                        <span className="summary-label">Bonus:</span>
                                        <span className="summary-value">${selectedPayslip.bonus.toLocaleString()}</span>
                                    </div>
                                    <div className="payslip-summary-item">
                                        <span className="summary-label">Gross Salary:</span>
                                        <span className="summary-value">${((Number(selectedPayslip.baseSalary) || 0) + (Number(selectedPayslip.bonus) || 0)).toLocaleString()}</span>
                                    </div>
                                    <div className="payslip-summary-item">
                                        <span className="summary-label">Deductions:</span>
                                        <span className="summary-value">-${selectedPayslip.deductions.toLocaleString()}</span>
                                    </div>
                                    <div className="payslip-summary-item">
                                        <span className="summary-label">Net Salary:</span>
                                        <span className="summary-value">${selectedPayslip.netSalary.toLocaleString()}</span>
                                    </div>
                                    <div className="payslip-summary-item">
                                        <span className="summary-label">Created Date:</span>
                                        <span className="summary-value">{selectedPayslip.createdAt}</span>
                                    </div>
                                </div>
                                <p className="payslip-note">
                                    For detailed information about this payslip, please contact the HR department.
                                </p>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="cancel-btn" onClick={closePayslipModal}>
                                Close
                            </button>
                            <button className="save-btn" onClick={handleDownloadPayslip}>
                                <FaDownload className="download-icon" />
                                Download Payslip
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyPayroll;