import React from "react";
import "./EmployeeStatistics.css";

const EmployeeStatistics = ({ birthdays = [], anniversaries = [] }) => {
  return (
    <div className="statistics-container">
      <div className="statistics-card">
        <h2>Upcoming Birthdays</h2>
        <div className="employee-list">
          {birthdays.map((employee, index) => (
            <div key={index} className="employee-item">
              <img
                src={employee.image}
                alt={employee.name}
                className="employee-image"
              />
              <div className="employee-info">
                <h3>{employee.name}</h3>
                <p>{`${employee.role} • ${employee.date}`}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="statistics-card">
        <h2>Work Anniversaries</h2>
        <div className="employee-list">
          {anniversaries.map((employee, index) => (
            <div key={index} className="employee-item">
              <img
                src={employee.image}
                alt={employee.name}
                className="employee-image"
              />
              <div className="employee-info">
                <h3>{employee.name}</h3>
                <p>{`${employee.role} • ${employee.years}`}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmployeeStatistics;
