"use client"

import React, { useState } from 'react';
import { FaFileInvoiceDollar, FaCalendarAlt, FaMoneyBillWave, FaDownload, FaHistory, FaChartLine, FaInfoCircle } from 'react-icons/fa';
import "../../styles/EmployeeStyles/MyPayroll.css";

const MyPayroll = () => {
    const [activeTab, setActiveTab] = useState('current');
    const [selectedPayslip, setSelectedPayslip] = useState(null);

    // Sample data - replace with your actual data
    const currentPayroll = {
        month: 'November',
        year: '2023',
        salary: {
            basic: 5000,
            allowances: 1200,
            overtime: 350,
            bonus: 500,
            grossSalary: 7050,
            deductions: {
                tax: 705,
                insurance: 250,
                pension: 350,
                other: 100
            },
            netSalary: 5645
        },
        paymentDate: '25 Nov 2023',
        paymentMethod: 'Bank Transfer',
        accountNumber: '**** **** **** 1234'
    };

    const payrollHistory = [
        { id: 1, month: 'October', year: '2023', netSalary: 5500, paymentDate: '25 Oct 2023', status: 'Paid' },
        { id: 2, month: 'September', year: '2023', netSalary: 5500, paymentDate: '25 Sep 2023', status: 'Paid' },
        { id: 3, month: 'August', year: '2023', netSalary: 5300, paymentDate: '25 Aug 2023', status: 'Paid' },
        { id: 4, month: 'July', year: '2023', netSalary: 5300, paymentDate: '25 Jul 2023', status: 'Paid' },
        { id: 5, month: 'June', year: '2023', netSalary: 5300, paymentDate: '25 Jun 2023', status: 'Paid' },
        { id: 6, month: 'May', year: '2023', netSalary: 5200, paymentDate: '25 May 2023', status: 'Paid' }
    ];

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
                                        <span>{currentPayroll.month} {currentPayroll.year}</span>
                                    </div>
                                    <div className="summary-amount">
                                        <h3>${currentPayroll.salary.netSalary.toLocaleString()}</h3>
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
                                            <span className="detail-value">${currentPayroll.salary.basic.toLocaleString()}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-label">Allowances:</span>
                                            <span className="detail-value">${currentPayroll.salary.allowances.toLocaleString()}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-label">Overtime:</span>
                                            <span className="detail-value">${currentPayroll.salary.overtime.toLocaleString()}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-label">Bonus:</span>
                                            <span className="detail-value">${currentPayroll.salary.bonus.toLocaleString()}</span>
                                        </div>
                                        <div className="detail-row total-row">
                                            <span className="detail-label">Gross Salary:</span>
                                            <span className="detail-value">${currentPayroll.salary.grossSalary.toLocaleString()}</span>
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
                                            <span className="detail-value">-${currentPayroll.salary.deductions.tax.toLocaleString()}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-label">Insurance:</span>
                                            <span className="detail-value">-${currentPayroll.salary.deductions.insurance.toLocaleString()}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-label">Pension:</span>
                                            <span className="detail-value">-${currentPayroll.salary.deductions.pension.toLocaleString()}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-label">Other Deductions:</span>
                                            <span className="detail-value">-${currentPayroll.salary.deductions.other.toLocaleString()}</span>
                                        </div>
                                        <div className="detail-row total-row">
                                            <span className="detail-label">Total Deductions:</span>
                                            <span className="detail-value">-${(currentPayroll.salary.deductions.tax +
                                                currentPayroll.salary.deductions.insurance +
                                                currentPayroll.salary.deductions.pension +
                                                currentPayroll.salary.deductions.other).toLocaleString()}</span>
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
                                        <span className="detail-value">{currentPayroll.paymentDate}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="detail-label">Payment Method:</span>
                                        <span className="detail-value">{currentPayroll.paymentMethod}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="detail-label">Account Number:</span>
                                        <span className="detail-value">{currentPayroll.accountNumber}</span>
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