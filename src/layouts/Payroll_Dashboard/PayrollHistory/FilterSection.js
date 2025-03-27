import React, { useState } from "react";
import "./FilterSection.css";

const FilterSection = ({
  defaultYear = "2025",
  defaultMonth = "Filter by month",
  onYearChange = () => {},
  onMonthChange = () => {},
}) => {
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [selectedYear, setSelectedYear] = useState(defaultYear);
  const [selectedMonth, setSelectedMonth] = useState(defaultMonth);

  const years = ["2025", "2024", "2023", "2022"];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const handleYearClick = () => {
    setShowYearDropdown(!showYearDropdown);
    setShowMonthDropdown(false);
  };

  const handleMonthClick = () => {
    setShowMonthDropdown(!showMonthDropdown);
    setShowYearDropdown(false);
  };

  const handleYearSelect = (year) => {
    setSelectedYear(year);
    setShowYearDropdown(false);
    onYearChange(year);
  };

  const handleMonthSelect = (month) => {
    setSelectedMonth(month);
    setShowMonthDropdown(false);
    onMonthChange(month);
  };

  return (
    <div className="filter-section">
      <div className="filter-container">
        <button
          className="filter-button"
          onClick={handleMonthClick}
          aria-label="Select month"
        >
          {selectedMonth}
        </button>
        {showMonthDropdown && (
          <div className="dropdown-menu">
            {months.map((month) => (
              <div
                key={month}
                className="dropdown-item"
                onClick={() => handleMonthSelect(month)}
              >
                {month}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="filter-container">
        <button
          className="filter-button"
          onClick={handleYearClick}
          aria-label="Select year"
        >
          {selectedYear}
        </button>
        {showYearDropdown && (
          <div className="dropdown-menu">
            {years.map((year) => (
              <div
                key={year}
                className="dropdown-item"
                onClick={() => handleYearSelect(year)}
              >
                {year}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterSection;
