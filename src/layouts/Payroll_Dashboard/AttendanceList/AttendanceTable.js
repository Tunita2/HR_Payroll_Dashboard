import React from "react";
import "./AttendanceTable.css";

const AttendanceTable = ({ style }) => {
  const tableData = [
    {
      id: 1,
      name: "Bui Le Tuan",
      workingDay: 22,
      workStatus: "Present",
      absences: 3,
      presents: 21,
      leaveDays: 2,
      idEmployee: 1,
      statusColor: "#01ea2b",
    },
    {
      id: 2,
      name: "Bui Le Tuan",
      workingDay: 22,
      workStatus: "Absences",
      absences: 3,
      presents: 22,
      leaveDays: 2,
      idEmployee: 1,
      statusColor: "#ea0101",
    },
    {
      id: 3,
      name: "Bui Le Tuan",
      workingDay: 22,
      workStatus: "IT",
      absences: 1,
      presents: 12,
      leaveDays: 2,
      idEmployee: 1,
    },
    {
      id: 4,
      name: "Bui Le Tuan",
      workingDay: 22,
      workStatus: "IT",
      absences: 4,
      presents: 12,
      leaveDays: 2,
      idEmployee: 1,
    },
    {
      id: 5,
      name: "Bui Le Tuan",
      workingDay: 22,
      workStatus: "IT",
      absences: 3,
      presents: 12,
      leaveDays: 2,
      idEmployee: 1,
    },
    {
      id: 6,
      name: "Bui Le Tuan",
      workingDay: 22,
      workStatus: "IT",
      absences: 3,
      presents: 12,
      leaveDays: 3,
      idEmployee: 1,
    },
    {
      id: 7,
      name: "Bui Le Tuan",
      workingDay: 22,
      workStatus: "IT",
      absences: 1,
      presents: 12,
      leaveDays: 1,
      idEmployee: 1,
    },
    {
      id: 8,
      name: "Bui Le Tuan",
      workingDay: 22,
      workStatus: "IT",
      absences: 2,
      presents: 12,
      leaveDays: 4,
      idEmployee: 1,
    },
    {
      id: 9,
      name: "Bui Le Tuan",
      workingDay: 22,
      workStatus: "IT",
      absences: 2,
      presents: 12,
      leaveDays: 0,
      idEmployee: 1,
    },
    {
      id: 10,
      name: "Bui Le Tuan",
      workingDay: 22,
      workStatus: "IT",
      absences: 2,
      presents: 12,
      leaveDays: 0,
      idEmployee: 1,
    },
  ];

  return (
    <div className="attendance-table" style={style}>
      <table>
        <thead>
          <tr>
            <th>STT</th>
            <th className="text-left">Name</th>
            <th>Working day</th>
            <th>Work status</th>
            <th>Absences</th>
            <th>Presents</th>
            <th>Leave Days</th>
            <th>ID Employee</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((row) => (
            <tr key={row.id}>
              <td>{row.id}</td>
              <td className="text-left">{row.name}</td>
              <td>{row.workingDay}</td>
              <td>
                {row.statusColor ? (
                  <div
                    className="status-badge"
                    style={{ backgroundColor: row.statusColor }}
                  >
                    {row.workStatus}
                  </div>
                ) : (
                  row.workStatus
                )}
              </td>
              <td>{row.absences}</td>
              <td>{row.presents}</td>
              <td>{row.leaveDays}</td>
              <td>{row.idEmployee}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

AttendanceTable.defaultProps = {
  style: {
    flexGrow: 1,
    height: "auto",
  },
};

export default AttendanceTable;
