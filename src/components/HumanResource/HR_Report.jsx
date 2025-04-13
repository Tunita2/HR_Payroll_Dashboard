import React, { useState } from "react";
import { MdOutlineRefresh } from "react-icons/md";

import {
  FiSearch,
  FiCalendar,
  FiUser,
  FiFileText,
  FiAlertTriangle,
  FiCheckCircle,
} from "react-icons/fi";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "../../styles/HumanResourceStyles/HR_Report.css";

const HR_Report = ({ style = {} }) => {
  const [activeTab, setActiveTab] = useState("Overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [timeRange, setTimeRange] = useState("year");
  const [notesActiveTab, setNotesActiveTab] = useState("evaluations");

  // Sample employee data
  const employees = [
    {
      EmployeeID: "EMP001",
      FullName: "John Doe",
      Position: "HR Manager",
      Department: "Human Resources",
      Status: "Active",
    },
    {
      EmployeeID: "EMP002",
      FullName: "Jane Smith",
      Position: "Software Engineer",
      Department: "Engineering",
      Status: "Active",
    },
    {
      EmployeeID: "EMP003",
      FullName: "Robert Johnson",
      Position: "Marketing Specialist",
      Department: "Marketing",
      Status: "Active",
    },
    {
      EmployeeID: "EMP004",
      FullName: "Emily Davis",
      Position: "Financial Analyst",
      Department: "Finance",
      Status: "Active",
    },
    {
      EmployeeID: "EMP005",
      FullName: "Michael Wilson",
      Position: "IT Support",
      Department: "IT",
      Status: "Inactive",
    },
    {
      EmployeeID: "EMP006",
      FullName: "Sarah Brown",
      Position: "UX Designer",
      Department: "Design",
      Status: "Active",
    },
    {
      EmployeeID: "EMP007",
      FullName: "David Lee",
      Position: "Project Manager",
      Department: "Engineering",
      Status: "Active",
    },
    {
      EmployeeID: "EMP008",
      FullName: "Lisa Wang",
      Position: "Data Analyst",
      Department: "Analytics",
      Status: "Active",
    },
    {
      EmployeeID: "EMP009",
      FullName: "James Taylor",
      Position: "Sales Representative",
      Department: "Sales",
      Status: "Inactive",
    },
    {
      EmployeeID: "EMP010",
      FullName: "Jennifer Garcia",
      Position: "Customer Support",
      Department: "Support",
      Status: "Active",
    },
  ];

  // Sample HR movement data
  const monthlyData = [
    { name: "Jan", resignationRate: 2.1, newHireRate: 3.5 },
    { name: "Feb", resignationRate: 1.8, newHireRate: 2.8 },
    { name: "Mar", resignationRate: 2.3, newHireRate: 4.2 },
    { name: "Apr", resignationRate: 2.5, newHireRate: 3.8 },
    { name: "May", resignationRate: 1.9, newHireRate: 2.5 },
    { name: "Jun", resignationRate: 2.7, newHireRate: 3.2 },
    { name: "Jul", resignationRate: 3.2, newHireRate: 2.9 },
    { name: "Aug", resignationRate: 2.8, newHireRate: 3.7 },
    { name: "Sep", resignationRate: 2.4, newHireRate: 4.1 },
    { name: "Oct", resignationRate: 2.2, newHireRate: 3.5 },
    { name: "Nov", resignationRate: 1.7, newHireRate: 2.6 },
    { name: "Dec", resignationRate: 2.0, newHireRate: 2.3 },
  ];

  const quarterlyData = [
    { name: "Q1", resignationRate: 2.1, newHireRate: 3.5 },
    { name: "Q2", resignationRate: 2.4, newHireRate: 3.2 },
    { name: "Q3", resignationRate: 2.8, newHireRate: 3.6 },
    { name: "Q4", resignationRate: 2.0, newHireRate: 2.8 },
  ];

  const yearlyData = [
    { name: "2021", resignationRate: 2.3, newHireRate: 3.1 },
    { name: "2022", resignationRate: 2.5, newHireRate: 3.4 },
    { name: "2023", resignationRate: 2.2, newHireRate: 3.2 },
    { name: "2024", resignationRate: 2.4, newHireRate: 3.5 },
    { name: "2025", resignationRate: 2.1, newHireRate: 3.3 },
  ];

  // Sample HR notes data
  const evaluationNotes = [
    {
      id: 1,
      title: "Q1 2025 Performance Review",
      date: "March 28, 2025",
      author: "Minh Nguyen",
      content:
        "Overall employee satisfaction has increased by 12% compared to last quarter. Key areas of improvement include work-life balance and professional development opportunities. Management team needs to focus on improving communication channels and recognition programs.",
      priority: "high",
      status: "completed",
    },
    {
      id: 2,
      title: "Employee Engagement Survey Results",
      date: "February 15, 2025",
      author: "Linh Tran",
      content:
        "Survey participation rate was 87%. Engagement score improved to 4.2/5 from 3.8/5 last year. Top concerns: career growth opportunities and internal communication. Recommended actions: implement mentorship program and regular town halls.",
      priority: "medium",
      status: "in-progress",
    },
    {
      id: 3,
      title: "Recruitment Process Evaluation",
      date: "January 10, 2025",
      author: "Minh Nguyen",
      content:
        "Average time-to-hire decreased from 45 to 32 days. Candidate experience rating is 4.5/5. Areas for improvement: technical assessment process and onboarding procedures. Recommended to revise job descriptions and implement structured interview training.",
      priority: "medium",
      status: "completed",
    },
  ];

  const improvementNotes = [
    {
      id: 1,
      title: "Onboarding Process Improvement",
      date: "April 2, 2025",
      author: "Minh Nguyen",
      content:
        "Current onboarding takes 2 weeks on average. Proposal to streamline to 1 week with improved digital resources and buddy system. Expected to improve new hire productivity by 15% in first month.",
      priority: "high",
      status: "in-progress",
    },
    {
      id: 2,
      title: "Remote Work Policy Update",
      date: "March 20, 2025",
      author: "Linh Tran",
      content:
        "Proposal to implement hybrid work model with 2 days in office, 3 days remote. Survey shows 78% of employees prefer this arrangement. Need to update equipment policy and collaboration tools.",
      priority: "medium",
      status: "pending",
    },
  ];

  const complianceNotes = [
    {
      id: 1,
      title: "Annual Compliance Training Status",
      date: "April 10, 2025",
      author: "Hoa Le",
      content:
        "85% completion rate for mandatory compliance training. Remaining 15% have been reminded with deadline of April 30. New data privacy module added this year with positive feedback.",
      priority: "high",
      status: "in-progress",
    },
    {
      id: 2,
      title: "Labor Law Updates",
      date: "February 28, 2025",
      author: "Tuan Pham",
      content:
        "New regulations on overtime compensation effective June 1, 2025. HR policies updated and manager training scheduled for May. Payroll system updates in progress.",
      priority: "high",
      status: "completed",
    },
  ];

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.FullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.Department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.Position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.EmployeeID.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getDataByTimeRange = () => {
    switch (timeRange) {
      case "month":
        return monthlyData;
      case "quarter":
        return quarterlyData;
      case "year":
        return yearlyData;
      default:
        return monthlyData;
    }
  };

  // Calculate averages for HR movement statistics
  const data = getDataByTimeRange();
  const avgResignationRate = (
    data.reduce((sum, item) => sum + item.resignationRate, 0) / data.length
  ).toFixed(1);
  const avgNewHireRate = (
    data.reduce((sum, item) => sum + item.newHireRate, 0) / data.length
  ).toFixed(1);
  const turnoverRate = (
    (Number.parseFloat(avgResignationRate) /
      Number.parseFloat(avgNewHireRate)) *
    100
  ).toFixed(1);

  const tabs = [
    { id: "overview", label: "Overview", width: "150px" },
    { id: "detailStaff", label: "Detail Staff", width: "150px" },
    { id: "hrMovement", label: "HR Movement Statistics", width: "250px" },
    { id: "notes", label: "Notes", width: "150px" },
  ];

  const cards = [
    { title: "Total Employees", value: "155" },
    { title: "Total Department", value: "15" },
    { title: "Total Position", value: "20" },
    { title: "Total Male", value: "110" },
    { title: "Total Female", value: "40" },
  ];

  // Function to render the Detail Staff View
  const renderDetailStaffView = () => {
    return (
      <div className="hr-detail-staff-container">
        <div className="hr-search-container">
          <FiSearch className="hr-search-icon" />
          <input
            type="text"
            placeholder="Search employees..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="hr-search-input"
          />
        </div>

        <div className="hr-table-container">
          <table className="hr-table">
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Full Name</th>
                <th>Position</th>
                <th>Department</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((employee) => (
                <tr key={employee.EmployeeID}>
                  <td>{employee.EmployeeID}</td>
                  <td>{employee.FullName}</td>
                  <td>{employee.Position}</td>
                  <td>{employee.Department}</td>
                  <td>
                    <span
                      className={`hr-status-badge ${
                        employee.Status === "Active" ? "active" : "inactive"
                      }`}
                    >
                      {employee.Status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Function to render the HR Movement Statistics
  const renderHRMovementStatistics = () => {
    return (
      <div className="hr-movement-container">
        <div className="hr-movement-header">
          <h2 className="hr-movement-title">HR Movement Trends</h2>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="hr-movement-select"
          >
            <option value="month">Monthly</option>
            <option value="quarter">Quarterly</option>
            <option value="year">Yearly</option>
          </select>
        </div>

        <div className="hr-stats-cards">
          <div className="hr-stat-card">
            <h3>Avg. Resignation Rate</h3>
            <p className="hr-stat-description">Per {timeRange}</p>
            <div className="hr-stat-value">{avgResignationRate}%</div>
          </div>
          <div className="hr-stat-card">
            <h3>Avg. New Hire Rate</h3>
            <p className="hr-stat-description">Per {timeRange}</p>
            <div className="hr-stat-value">{avgNewHireRate}%</div>
          </div>
          <div className="hr-stat-card">
            <h3>Turnover Ratio</h3>
            <p className="hr-stat-description">Resignation to New Hire</p>
            <div className="hr-stat-value">{turnoverRate}%</div>
          </div>
        </div>

        <div className="hr-chart-container">
          <h3 className="hr-chart-title">Employee Movement Fluctuation</h3>
          <p className="hr-chart-description">
            Comparison between resignation rates and new hire rates
          </p>
          <div className="hr-chart">
            {/* Chart would be rendered here - in a real implementation, you would use a charting library */}
            <ResponsiveContainer width="100%" height={400}>
              <LineChart
                data={getDataByTimeRange()}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="name" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#121843",
                    borderColor: "#5c30fb",
                    color: "white",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="resignationRate"
                  name="Resignation Rate (%)"
                  stroke="#ff5c8d"
                  activeDot={{ r: 8 }}
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="newHireRate"
                  name="New Hire Rate (%)"
                  stroke="#5c30fb"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="hr-department-breakdown">
            <h3 className="hr-breakdown-title">Department Breakdown</h3>
            <p className="hr-breakdown-description">
              Movement statistics by department
            </p>
            <table className="hr-breakdown-table">
              <thead>
                <tr>
                  <th>Department</th>
                  <th>Headcount</th>
                  <th>Resignation Rate</th>
                  <th>New Hire Rate</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    dept: "Engineering",
                    headcount: 45,
                    resignation: 2.8,
                    newHire: 4.2,
                  },
                  {
                    dept: "Marketing",
                    headcount: 18,
                    resignation: 1.9,
                    newHire: 2.5,
                  },
                  {
                    dept: "Sales",
                    headcount: 32,
                    resignation: 3.2,
                    newHire: 3.8,
                  },
                  { dept: "HR", headcount: 12, resignation: 1.5, newHire: 2.0 },
                  {
                    dept: "Finance",
                    headcount: 15,
                    resignation: 1.8,
                    newHire: 2.2,
                  },
                  { dept: "IT", headcount: 22, resignation: 2.5, newHire: 3.5 },
                ].map((dept, i) => (
                  <tr key={i}>
                    <td>{dept.dept}</td>
                    <td>{dept.headcount}</td>
                    <td>{dept.resignation}%</td>
                    <td>{dept.newHire}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // Function to render the HR Notes
  const renderHRNotes = () => {
    const renderNotesList = (notes) => {
      return (
        <div className="hr-notes-list">
          {notes.map((note) => (
            <div key={note.id} className="hr-note-card">
              <div className="hr-note-header">
                <h3 className="hr-note-title">{note.title}</h3>
                <div className="hr-note-badges">
                  <span className={`hr-note-priority ${note.priority}`}>
                    {note.priority}
                  </span>
                  <span className={`hr-note-status ${note.status}`}>
                    {note.status}
                  </span>
                </div>
              </div>
              <div className="hr-note-meta">
                <span className="hr-note-date">
                  <FiCalendar className="hr-note-icon" /> {note.date}
                </span>
                <span className="hr-note-author">
                  <FiUser className="hr-note-icon" /> {note.author}
                </span>
              </div>
              <div className="hr-note-content">{note.content}</div>
              <div className="hr-note-footer">
                <FiFileText className="hr-note-icon" /> Last updated:{" "}
                {note.date}
              </div>
            </div>
          ))}
        </div>
      );
    };

    return (
      <div className="hr-notes-container">
        <div className="hr-notes-header">
          <h2 className="hr-notes-title">HR Notes & Evaluations</h2>
          <div className="hr-notes-summary">
            <div className="hr-notes-summary-item high">
              <FiAlertTriangle className="hr-notes-summary-icon" /> 3 high
              priority items
            </div>
            <div className="hr-notes-summary-item completed">
              <FiCheckCircle className="hr-notes-summary-icon" /> 4 completed
              items
            </div>
          </div>
        </div>

        <div className="hr-notes-tabs">
          <button
            className={`hr-notes-tab ${
              notesActiveTab === "evaluations" ? "active" : ""
            }`}
            onClick={() => setNotesActiveTab("evaluations")}
          >
            Performance Evaluations
          </button>
          <button
            className={`hr-notes-tab ${
              notesActiveTab === "improvements" ? "active" : ""
            }`}
            onClick={() => setNotesActiveTab("improvements")}
          >
            Improvement Plans
          </button>
          <button
            className={`hr-notes-tab ${
              notesActiveTab === "compliance" ? "active" : ""
            }`}
            onClick={() => setNotesActiveTab("compliance")}
          >
            Compliance Notes
          </button>
        </div>

        <div className="hr-notes-content">
          {notesActiveTab === "evaluations" && renderNotesList(evaluationNotes)}
          {notesActiveTab === "improvements" &&
            renderNotesList(improvementNotes)}
          {notesActiveTab === "compliance" && renderNotesList(complianceNotes)}
        </div>
      </div>
    );
  };

  return (
    <div className="hr-dashboard-layout-report">
      <div className="hr-dashboard-main">
        {/* Phần header - đầu của report */}
        <div className="hr-dashboard-header-report">
          <div className="hr-dashboard-title-report">Report</div>

          {/* Phần hiển thị thông tin nơi làm */}
          <div className="hr-report-details-container">
            <div className="hr-report-details-row">
              <span className="hr-report-details-label">Company name</span>
              <span className="hr-report-details-colon">:</span>
              <span className="hr-report-details-value">FPT Software</span>
            </div>
            <div className="hr-report-details-row">
              <span className="hr-report-details-label">
                Department/Division
              </span>
              <span className="hr-report-details-colon">:</span>
              <span className="hr-report-details-value">Human Resources</span>
            </div>
            <div className="hr-report-details-row">
              <span className="hr-report-details-label">Report date</span>
              <span className="hr-report-details-colon">:</span>
              <span className="hr-report-details-report-date">05/04/2025</span>
            </div>
            <div className="hr-report-details-row">
              <span className="hr-report-details-label">
                Report prepared by
              </span>
              <span className="hr-report-details-colon">:</span>
              <span className="hr-report-details-value">Minh</span>
            </div>
          </div>
        </div>

        {/* Phần hiển thị các mục tùy chọn của report */}
        <div className="hr-tabs-container">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`hr-tab-button ${
                activeTab === tab.label ? "active" : "inactive"
              }`}
              style={{ width: tab.width }}
              onClick={() => setActiveTab(tab.label)}
            >
              {tab.label}
            </div>
          ))}

          <div className="hr-filter-container">
            <button className="hr-refresh-button">
              <MdOutlineRefresh className="hr-refresh-icon" />
            </button>
          </div>
        </div>

        {/* Đường line chia */}
        <div className="hr-line">
          <hr />
        </div>

        {/* Phần hiển thị dữ liệu report */}
        {activeTab === "Overview" && (
          <div className="hr-card-container">
            {cards.map((card, index) => (
              <div
                key={index}
                className="hr-card"
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.02)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                <p className="hr-card-title">{card.title}</p>
                <p className="hr-card-value">{card.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Detail Staff View */}
        {activeTab === "Detail Staff" && renderDetailStaffView()}

        {/* HR Movement Statistics */}
        {activeTab === "HR Movement Statistics" && renderHRMovementStatistics()}

        {/* HR Notes */}
        {activeTab === "Notes" && renderHRNotes()}
      </div>
    </div>
  );
};

HR_Report.defaultProps = {
  style: {},
};

export default HR_Report;
