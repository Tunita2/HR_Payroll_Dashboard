"use client"

import React, { useState, useEffect } from 'react';
import { FaFileInvoiceDollar, FaCalendarAlt, FaMoneyBillWave, FaDownload, FaHistory, FaChartLine, FaInfoCircle } from 'react-icons/fa';
import "../../styles/EmployeeStyles/MyPayroll.css";
import axios from 'axios';

// Hàm chuẩn hóa dữ liệu payroll cho cả hai DB
function normalizePayrollData(apiData) {
    // Dữ liệu lương hiện tại
    const current = apiData.currentPayroll || apiData.current || {};
    // Dữ liệu lịch sử lương
    const history = apiData.payrollHistory || apiData.history || [];
    // Chuẩn hóa lương hiện tại
    const normalizedCurrent = {
        month: current.month || current.SalaryMonth || '',
        year: current.year || (current.SalaryMonth ? new Date(current.SalaryMonth).getFullYear() : ''),
        salary: {
            basic: current.BaseSalary || current.basic || 0,
            allowances: current.Allowances || current.allowances || 0,
            overtime: current.Overtime || current.overtime || 0,
            bonus: current.Bonus || current.bonus || 0,
            grossSalary: current.GrossSalary || current.grossSalary || 0,
            deductions: {
                tax: current.Tax || (current.deductions ? current.deductions.tax : 0) || 0,
                insurance: current.Insurance || (current.deductions ? current.deductions.insurance : 0) || 0,
                pension: current.Pension || (current.deductions ? current.deductions.pension : 0) || 0,
                other: current.OtherDeductions || (current.deductions ? current.deductions.other : 0) || 0
            },
            netSalary: current.NetSalary || current.netSalary || 0
        },
        paymentDate: current.PaymentDate || current.paymentDate || '',
        paymentMethod: current.PaymentMethod || current.paymentMethod || '',
        accountNumber: current.AccountNumber || current.accountNumber || ''
    };
    // Chuẩn hóa lịch sử lương
    const normalizedHistory = history.map((item, idx) => ({
        id: item.id || item.SalaryID || idx + 1,
        month: item.month || item.SalaryMonth || '',
        year: item.year || (item.SalaryMonth ? new Date(item.SalaryMonth).getFullYear() : ''),
        netSalary: item.NetSalary || item.netSalary || 0,
        paymentDate: item.PaymentDate || item.paymentDate || '',
        status: item.Status || item.status || 'Paid'
    }));
    return {
        currentPayroll: normalizedCurrent,
        payrollHistory: normalizedHistory
    };
}

const API_URL = 'http://localhost:3001/api/payroll';

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
                const response = await axios.get(API_URL, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const data = normalizePayrollData(response.data);
                setCurrentPayroll(data.currentPayroll);
                setPayrollHistory(data.payrollHistory);
            } catch (err) {
                setError('Failed to load payroll data. Please try again later.');
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
                                            <span className="detail-label">Allowances:</span>
                                            <span className="detail-value">${currentPayroll?.salary?.allowances?.toLocaleString()}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-label">Overtime:</span>
                                            <span className="detail-value">${currentPayroll?.salary?.overtime?.toLocaleString()}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-label">Bonus:</span>
                                            <span className="detail-value">${currentPayroll?.salary?.bonus?.toLocaleString()}</span>
                                        </div>
                                        <div className="detail-row total-row">
                                            <span className="detail-label">Gross Salary:</span>
                                            <span className="detail-value">${currentPayroll?.salary?.grossSalary?.toLocaleString()}</span>
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
                                            <span className="detail-label">Tax:</span>
                                            <span className="detail-value">-${currentPayroll?.salary?.deductions?.tax?.toLocaleString()}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-label">Insurance:</span>
                                            <span className="detail-value">-${currentPayroll?.salary?.deductions?.insurance?.toLocaleString()}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-label">Pension:</span>
                                            <span className="detail-value">-${currentPayroll?.salary?.deductions?.pension?.toLocaleString()}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-label">Other Deductions:</span>
                                            <span className="detail-value">-${currentPayroll?.salary?.deductions?.other?.toLocaleString()}</span>
                                        </div>
                                        <div className="detail-row total-row">
                                            <span className="detail-label">Total Deductions:</span>
                                            <span className="detail-value">-${((currentPayroll?.salary?.deductions?.tax || 0) +
                                                (currentPayroll?.salary?.deductions?.insurance || 0) +
                                                (currentPayroll?.salary?.deductions?.pension || 0) +
                                                (currentPayroll?.salary?.deductions?.other || 0)).toLocaleString()}</span>
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
                                        <span className="detail-label">Payment Date:</span>
                                        <span className="detail-value">{currentPayroll?.paymentDate}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="detail-label">Payment Method:</span>
                                        <span className="detail-value">{currentPayroll?.paymentMethod}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="detail-label">Account Number:</span>
                                        <span className="detail-value">{currentPayroll?.accountNumber}</span>
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
                                                <th>Net Salary</th>
                                                <th>Payment Date</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {payrollHistory.map(payslip => (
                                                <tr key={payslip.id}>
                                                    <td>{payslip.month} {payslip.year}</td>
                                                    <td>${payslip.netSalary.toLocaleString()}</td>
                                                    <td>{payslip.paymentDate}</td>
                                                    <td>
                                                        <span className={`status-badge ${payslip.status.toLowerCase()}`}>
                                                            {payslip.status}
                                                        </span>
                                                    </td>
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
                                        <span className="summary-label">Net Salary:</span>
                                        <span className="summary-value">${selectedPayslip.netSalary.toLocaleString()}</span>
                                    </div>
                                    <div className="payslip-summary-item">
                                        <span className="summary-label">Payment Date:</span>
                                        <span className="summary-value">{selectedPayslip.paymentDate}</span>
                                    </div>
                                    <div className="payslip-summary-item">
                                        <span className="summary-label">Status:</span>
                                        <span className={`status-badge ${selectedPayslip.status.toLowerCase()}`}>
                                            {selectedPayslip.status}
                                        </span>
                                    </div>
                                </div>
                                <p className="payslip-note">
                                    For detailed information about this payslip, please download the PDF version.
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