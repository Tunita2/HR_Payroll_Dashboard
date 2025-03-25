import React from "react";
import "./AttendanceTable.css";

const AttendanceTable = ({
  data = [
    {
      id: "CEO-01",
      fullName: "Nguyễn Văn An",
      department: "Kinh doanh",
      date: "10/02/2020",
      status: "Present",
      workings: "26",
      absences: "2",
      leaves: "2",
      comment: "",
    },
    {
      id: "CEO-01",
      fullName: "Nguyễn Văn An",
      department: "Kinh doanh",
      date: "10/02/2020",
      status: "Absence",
      workings: "26",
      absences: "2",
      leaves: "2",
      comment: "KP",
    },
    {
      id: "CEO-01",
      fullName: "Nguyễn Văn An",
      department: "Kinh doanh",
      date: "10/02/2020",
      status: "Leave",
      workings: "26",
      absences: "2",
      leaves: "2",
      comment: "P",
    },
  ],
}) => {
  const getStatusStyle = (status) => {
    switch (status.toLowerCase()) {
      case "present":
        return "status-present";
      case "absence":
        return "status-absence";
      case "leave":
        return "status-leave";
      default:
        return "";
    }
  };

  return (
    <div className="attendance-table">
      <div className="table-header">
        <div className="header-cell">ID</div>
        <div className="header-cell">Full name</div>
        <div className="header-cell">Department</div>
        <div className="header-cell">Date</div>
        <div className="header-cell">Status</div>
        <div className="header-cell">Workings</div>
        <div className="header-cell">Absences</div>
        <div className="header-cell">Leaves</div>
        <div className="header-cell">Comment</div>
      </div>

      <div className="table-body">
        {data.map((row, index) => (
          <div key={index} className="table-row">
            <div className="table-cell">{row.id}</div>
            <div className="table-cell">{row.fullName}</div>
            <div className="table-cell">{row.department}</div>
            <div className="table-cell">{row.date}</div>
            <div className="table-cell">
              <span className={`status-badge ${getStatusStyle(row.status)}`}>
                {row.status}
              </span>
            </div>
            <div className="table-cell">{row.workings}</div>
            <div className="table-cell">{row.absences}</div>
            <div className="table-cell">{row.leaves}</div>
            <div className="table-cell">{row.comment}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttendanceTable;
