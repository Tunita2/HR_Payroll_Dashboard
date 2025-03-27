import React, { useState } from "react";
import "./FilterSection.css";

const FilterSection = ({ style = {} }) => {
  const [selectedMonth, setSelectedMonth] = useState("March 2025");
  const [selectedDepartment, setSelectedDepartment] =
    useState("All departments");

  const months = [
    "January 2025",
    "February 2025",
    "March 2025",
    "April 2025",
    "May 2025",
    "June 2025",
  ];

  const departments = [
    "All departments",
    "Sales",
    "Marketing",
    "Engineering",
    "Finance",
    "HR",
  ];

  return (
    <div className="filter-section" style={style}>
      <div className="filter-container">
        <button
          className="filter-button"
          onClick={() => {
            const dropdown = document.getElementById("monthDropdown");
            dropdown.style.display =
              dropdown.style.display === "none" ? "block" : "none";
          }}
        >
          {selectedMonth}
        </button>
        <div
          id="monthDropdown"
          className="dropdown-content"
          style={{ display: "none" }}
        >
          {months.map((month) => (
            <div
              key={month}
              className="dropdown-item"
              onClick={() => {
                setSelectedMonth(month);
                document.getElementById("monthDropdown").style.display = "none";
              }}
            >
              {month}
            </div>
          ))}
        </div>

        <button
          className="filter-button"
          onClick={() => {
            const dropdown = document.getElementById("deptDropdown");
            dropdown.style.display =
              dropdown.style.display === "none" ? "block" : "none";
          }}
        >
          {selectedDepartment}
        </button>
        <div
          id="deptDropdown"
          className="dropdown-content"
          style={{ display: "none" }}
        >
          {departments.map((dept) => (
            <div
              key={dept}
              className="dropdown-item"
              onClick={() => {
                setSelectedDepartment(dept);
                document.getElementById("deptDropdown").style.display = "none";
              }}
            >
              {dept}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterSection;
