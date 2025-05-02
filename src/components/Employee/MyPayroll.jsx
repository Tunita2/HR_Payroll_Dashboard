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
    // Dữ liệu dividend
    const dividend = apiData.dividendData || {};
    // Dữ liệu attendance
    const attendance = apiData.attendanceData || [];

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
        // Thêm thông tin tháng và năm dạng số để lọc
        monthNumber: item.SalaryMonth ? new Date(item.SalaryMonth).getMonth() + 1 : 0, // 1-12
        year: item.SalaryMonth ? new Date(item.SalaryMonth).getFullYear() : '',
        netSalary: item.NetSalary || 0,
        baseSalary: item.BaseSalary || 0,
        bonus: item.Bonus || 0,
        deductions: item.Deductions || 0,
        createdAt: item.CreatedAt ? new Date(item.CreatedAt).toLocaleDateString('vi-VN') : ''
    }));

    // Chuẩn hóa dữ liệu dividend
    const normalizedDividends = Array.isArray(dividend) && dividend.length > 0
        ? dividend.map(div => ({
            id: div.DividendID,
            amount: div.DividendAmount || 0,
            date: div.DividendDate ? new Date(div.DividendDate).toLocaleDateString('vi-VN') : '',
            createdAt: div.CreatedAt ? new Date(div.CreatedAt).toLocaleDateString('vi-VN') : '',
            // Thêm thông tin tháng và năm để lọc
            month: div.DividendDate ? new Date(div.DividendDate).getMonth() + 1 : 0, // 1-12
            year: div.DividendDate ? new Date(div.DividendDate).getFullYear() : 0,
            // Thêm chuỗi tháng để hiển thị
            monthName: div.DividendDate ? new Date(div.DividendDate).toLocaleDateString('vi-VN', { month: 'long' }) : ''
        }))
        : [];

    // Chuẩn hóa dữ liệu attendance
    const normalizedAttendance = Array.isArray(attendance) && attendance.length > 0
        ? attendance.map(att => ({
            id: att.AttendanceID,
            workDays: att.WorkDays || 0,
            absentDays: att.AbsentDays || 0,
            leaveDays: att.LeaveDays || 0,
            month: att.AttendanceMonth ? new Date(att.AttendanceMonth).getMonth() + 1 : 0, // 1-12
            year: att.AttendanceMonth ? new Date(att.AttendanceMonth).getFullYear() : 0,
            monthName: att.AttendanceMonth ? new Date(att.AttendanceMonth).toLocaleDateString('vi-VN', { month: 'long' }) : '',
            date: att.AttendanceMonth ? new Date(att.AttendanceMonth).toLocaleDateString('vi-VN') : '',
            createdAt: att.CreatedAt ? new Date(att.CreatedAt).toLocaleDateString('vi-VN') : ''
        }))
        : [];

    return {
        currentPayroll: normalizedCurrent,
        payrollHistory: normalizedHistory,
        dividendData: normalizedDividends,
        attendanceData: normalizedAttendance
    };
}

const API_URL = 'http://localhost:3001/api/employee/payroll';

const MyPayroll = () => {
    const [activeTab, setActiveTab] = useState('current');
    const [selectedPayslip, setSelectedPayslip] = useState(null);
    const [currentPayroll, setCurrentPayroll] = useState(null);
    const [payrollHistory, setPayrollHistory] = useState([]);
    const [filteredPayroll, setFilteredPayroll] = useState(null);
    const [allDividendData, setAllDividendData] = useState([]);
    const [filteredDividendData, setFilteredDividendData] = useState([]);
    const [allAttendanceData, setAllAttendanceData] = useState([]);
    const [filteredAttendanceData, setFilteredAttendanceData] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Default to current month (1-12)
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [yearRange, setYearRange] = useState({
        start: new Date().getFullYear() - 10,
        end: new Date().getFullYear() + 9
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filter dividends when month or year changes
    useEffect(() => {
        if (allDividendData.length > 0) {
            const filtered = allDividendData.filter(
                dividend => dividend.month === selectedMonth && dividend.year === selectedYear
            );
            setFilteredDividendData(filtered);
            console.log(`Filtered dividends for month ${selectedMonth}/${selectedYear}: ${filtered.length} records`);
        } else {
            setFilteredDividendData([]);
        }
    }, [allDividendData, selectedMonth, selectedYear]);

    // Filter attendance data when month or year changes
    useEffect(() => {
        if (allAttendanceData.length > 0) {
            const filtered = allAttendanceData.filter(
                attendance => attendance.month === selectedMonth && attendance.year === selectedYear
            );
            setFilteredAttendanceData(filtered);
            console.log(`Filtered attendance for month ${selectedMonth}/${selectedYear}: ${filtered.length} records`);
        } else {
            setFilteredAttendanceData([]);
        }
    }, [allAttendanceData, selectedMonth, selectedYear]);

    // Filter payroll data when month or year changes
    useEffect(() => {
        if (payrollHistory.length > 0) {
            const filtered = payrollHistory.find(
                payroll => payroll.monthNumber === selectedMonth && payroll.year === selectedYear
            );
            setFilteredPayroll(filtered || null);
            console.log(`Filtered payroll for month ${selectedMonth}/${selectedYear}: ${filtered ? 'Found' : 'Not found'}`);
        } else {
            setFilteredPayroll(null);
        }
    }, [payrollHistory, selectedMonth, selectedYear]);

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
                console.log('Normalized payroll data:', data);
                console.log('Payroll history with month numbers:', data.payrollHistory.map(p => ({
                    month: p.month,
                    monthNumber: p.monthNumber,
                    year: p.year
                })));
                setCurrentPayroll(data.currentPayroll);
                setPayrollHistory(data.payrollHistory);
                setAllDividendData(data.dividendData);
                setAllAttendanceData(data.attendanceData);
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

    // Hàm để chuyển đến phạm vi năm trước
    const handlePreviousYearRange = () => {
        const rangeSize = yearRange.end - yearRange.start + 1;
        setYearRange({
            start: yearRange.start - rangeSize,
            end: yearRange.end - rangeSize
        });
    };

    // Hàm để chuyển đến phạm vi năm sau
    const handleNextYearRange = () => {
        const rangeSize = yearRange.end - yearRange.start + 1;
        setYearRange({
            start: yearRange.start + rangeSize,
            end: yearRange.end + rangeSize
        });
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

                <div className="payroll-filter-container">
                    <div className="month-filter">
                        <label htmlFor="payroll-month">Month:</label>
                        <select
                            id="payroll-month"
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(Number(e.target.value))}
                            className="payroll-select"
                        >
                            <option value="1">January</option>
                            <option value="2">February</option>
                            <option value="3">March</option>
                            <option value="4">April</option>
                            <option value="5">May</option>
                            <option value="6">June</option>
                            <option value="7">July</option>
                            <option value="8">August</option>
                            <option value="9">September</option>
                            <option value="10">October</option>
                            <option value="11">November</option>
                            <option value="12">December</option>
                        </select>

                        <div className="year-selector">
                            <button
                                className="year-nav-btn"
                                onClick={handlePreviousYearRange}
                                title="Previous years"
                            >
                                &lt;&lt;
                            </button>

                            <label htmlFor="payroll-year" style={{ marginLeft: '10px' }}>Year:</label>
                            <select
                                id="payroll-year"
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(Number(e.target.value))}
                                className="payroll-select"
                            >
                                {[...Array(yearRange.end - yearRange.start + 1)].map((_, i) => {
                                    const year = yearRange.start + i;
                                    return <option key={year} value={year}>{year}</option>;
                                })}
                            </select>

                            <button
                                className="year-nav-btn"
                                onClick={handleNextYearRange}
                                title="Next years"
                            >
                                &gt;&gt;
                            </button>
                        </div>
                    </div>

                    <div className="payroll-tabs">
                        <button
                            className={`payroll-tab ${activeTab === 'current' ? 'active' : ''}`}
                            onClick={() => setActiveTab('current')}
                        >
                            Payroll Details
                        </button>
                        <button
                            className={`payroll-tab ${activeTab === 'history' ? 'active' : ''}`}
                            onClick={() => setActiveTab('history')}
                        >
                            Payroll History
                        </button>
                    </div>
                </div>

                <div className="payroll-content">
                    {activeTab === 'current' ? (
                        <div className="current-payroll">
                            <div className="payroll-section summary-section">
                                <h2 className="section-title">
                                    <FaMoneyBillWave className="section-icon" />
                                    Salary Summary
                                </h2>
                                {filteredPayroll ? (
                                    <div className="salary-summary">
                                        <div className="summary-period">
                                            <FaCalendarAlt className="summary-icon" />
                                            <span>{filteredPayroll.month} {filteredPayroll.year}</span>
                                        </div>
                                        <div className="summary-amount">
                                            <h3>${filteredPayroll.netSalary?.toLocaleString()}</h3>
                                            <span>Net Salary</span>
                                        </div>
                                        <button className="download-btn" onClick={handleDownloadPayslip}>
                                            <FaDownload className="download-icon" />
                                            Download Payslip
                                        </button>
                                    </div>
                                ) : (
                                    <div className="no-data-message">
                                        <p>No salary data available for {new Date(selectedYear, selectedMonth - 1).toLocaleDateString('vi-VN', { month: 'long' })} {selectedYear}</p>
                                    </div>
                                )}
                            </div>

                            <div className="payroll-details-container">
                                <div className="payroll-section earnings-section">
                                    <h2 className="section-title">
                                        <FaChartLine className="section-icon" />
                                        Earnings
                                    </h2>
                                    {filteredPayroll ? (
                                        <div className="payroll-details">
                                            <div className="detail-row">
                                                <span className="detail-label">Basic Salary:</span>
                                                <span className="detail-value">${filteredPayroll.baseSalary?.toLocaleString()}</span>
                                            </div>
                                            <div className="detail-row">
                                                <span className="detail-label">Bonus:</span>
                                                <span className="detail-value">${filteredPayroll.bonus?.toLocaleString()}</span>
                                            </div>
                                            <div className="detail-row total-row">
                                                <span className="detail-label">Gross Salary:</span>
                                                <span className="detail-value">${((Number(filteredPayroll.baseSalary) || 0) + (Number(filteredPayroll.bonus) || 0)).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="no-data-message">
                                            <p>No earnings data available for this period</p>
                                        </div>
                                    )}
                                </div>

                                <div className="payroll-section deductions-section">
                                    <h2 className="section-title">
                                        <FaMoneyBillWave className="section-icon" />
                                        Deductions
                                    </h2>
                                    {filteredPayroll ? (
                                        <div className="payroll-details">
                                            <div className="detail-row">
                                                <span className="detail-label">Total Deductions:</span>
                                                <span className="detail-value">-${filteredPayroll.deductions?.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="no-data-message">
                                            <p>No deductions data available for this period</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Attendance Section */}
                            <div className="payroll-section attendance-section">
                                <h2 className="section-title">
                                    <FaCalendarAlt className="section-icon" />
                                    Attendance Information
                                </h2>

                                {filteredAttendanceData.length > 0 ? (
                                    <>
                                        {filteredAttendanceData.map((attendance, index) => (
                                            <div key={attendance.id || index} className="attendance-details">
                                                <div className="attendance-summary">
                                                    <div className="attendance-period">
                                                        <span>Period: {attendance.date}</span>
                                                    </div>
                                                </div>
                                                <div className="attendance-data">
                                                    <div className="detail-row">
                                                        <span className="detail-label">Work Days:</span>
                                                        <span className="detail-value">{attendance.workDays} days</span>
                                                    </div>
                                                    <div className="detail-row">
                                                        <span className="detail-label">Absent Days:</span>
                                                        <span className="detail-value">{attendance.absentDays} days</span>
                                                    </div>
                                                    <div className="detail-row">
                                                        <span className="detail-label">Leave Days:</span>
                                                        <span className="detail-value">{attendance.leaveDays} days</span>
                                                    </div>
                                                    <div className="detail-row total-row">
                                                        <span className="detail-label">Total Days:</span>
                                                        <span className="detail-value">{attendance.workDays + attendance.absentDays + attendance.leaveDays} days</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </>
                                ) : (
                                    <div className="no-attendance-data">
                                        <p>No attendance data available for {selectedMonth}/{selectedYear}</p>
                                    </div>
                                )}
                            </div>

                            <div className="payroll-section payment-section">
                                <h2 className="section-title">
                                    <FaInfoCircle className="section-icon" />
                                    Payment Information
                                </h2>

                                <div className="payroll-details">
                                    {filteredPayroll ? (
                                        <div className="detail-row">
                                            <span className="detail-label">Net Salary:</span>
                                            <span className="detail-value">${filteredPayroll.netSalary?.toLocaleString()}</span>
                                        </div>
                                    ) : (
                                        <div className="detail-row">
                                            <span className="detail-label">Net Salary:</span>
                                            <span className="detail-value">No salary data for this period</span>
                                        </div>
                                    )}

                                    {filteredDividendData.length > 0 ? (
                                        <>
                                            <div className="detail-row">
                                                <span className="detail-label">Dividend Amount (Total):</span>
                                                <span className="detail-value">
                                                    ${filteredDividendData.reduce((sum, div) => sum + Number(div.amount), 0).toLocaleString()}
                                                </span>
                                            </div>
                                            {filteredDividendData.map((dividend, index) => (
                                                <div className="detail-row" key={dividend.id || index}>
                                                    <span className="detail-label">Dividend {index + 1}:</span>
                                                    <span className="detail-value">${Number(dividend.amount).toLocaleString()} ({dividend.date})</span>
                                                </div>
                                            ))}
                                        </>
                                    ) : (
                                        <div className="detail-row">
                                            <span className="detail-label">Dividend:</span>
                                            <span className="detail-value">No dividend data for this period</span>
                                        </div>
                                    )}

                                    {filteredPayroll ? (
                                        <div className="detail-row">
                                            <span className="detail-label">Created Date:</span>
                                            <span className="detail-value">{filteredPayroll.createdAt}</span>
                                        </div>
                                    ) : (
                                        <div className="detail-row">
                                            <span className="detail-label">Created Date:</span>
                                            <span className="detail-value">N/A</span>
                                        </div>
                                    )}
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

                                    {filteredDividendData.length > 0 ? (
                                        <>
                                            <div className="payslip-summary-item">
                                                <span className="summary-label">Dividend Amount (Total):</span>
                                                <span className="summary-value">
                                                    ${filteredDividendData.reduce((sum, div) => sum + Number(div.amount), 0).toLocaleString()}
                                                </span>
                                            </div>
                                            {filteredDividendData.map((dividend, index) => (
                                                <div className="payslip-summary-item" key={dividend.id || index}>
                                                    <span className="summary-label">Dividend {index + 1}:</span>
                                                    <span className="summary-value">${Number(dividend.amount).toLocaleString()} ({dividend.date})</span>
                                                </div>
                                            ))}
                                        </>
                                    ) : (
                                        <div className="payslip-summary-item">
                                            <span className="summary-label">Dividend:</span>
                                            <span className="summary-value">No dividend data for {selectedMonth}/{selectedYear}</span>
                                        </div>
                                    )}

                                    <div className="payslip-summary-item">
                                        <span className="summary-label">Created Date:</span>
                                        <span className="summary-value">{selectedPayslip.createdAt}</span>
                                    </div>

                                    {/* Attendance data in modal */}
                                    {filteredAttendanceData.length > 0 && (
                                        <>
                                            <div className="payslip-summary-item" style={{ gridColumn: "1 / -1", marginTop: "20px" }}>
                                                <span className="summary-label" style={{ fontSize: "16px", fontWeight: "600" }}>Attendance Information</span>
                                            </div>

                                            {filteredAttendanceData.map((attendance, index) => (
                                                <React.Fragment key={attendance.id || index}>
                                                    <div className="payslip-summary-item">
                                                        <span className="summary-label">Work Days:</span>
                                                        <span className="summary-value">{attendance.workDays} days</span>
                                                    </div>
                                                    <div className="payslip-summary-item">
                                                        <span className="summary-label">Absent Days:</span>
                                                        <span className="summary-value">{attendance.absentDays} days</span>
                                                    </div>
                                                    <div className="payslip-summary-item">
                                                        <span className="summary-label">Leave Days:</span>
                                                        <span className="summary-value">{attendance.leaveDays} days</span>
                                                    </div>
                                                    <div className="payslip-summary-item">
                                                        <span className="summary-label">Total Days:</span>
                                                        <span className="summary-value">{attendance.workDays + attendance.absentDays + attendance.leaveDays} days</span>
                                                    </div>
                                                </React.Fragment>
                                            ))}
                                        </>
                                    )}
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