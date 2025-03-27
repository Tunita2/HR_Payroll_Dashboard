import React from "react";
import "./Calendar.css";

const Calendar = ({ style }) => {
  return (
    <div className="calendar" style={style}>
      <div className="calendar-header">
        <button className="calendar-nav">&lt;</button>
        <h2>March 2025</h2>
        <button className="calendar-nav">&gt;</button>
      </div>
      <div className="calendar-grid">
        <div className="calendar-day">S</div>
        <div className="calendar-day">M</div>
        <div className="calendar-day">T</div>
        <div className="calendar-day">W</div>
        <div className="calendar-day">T</div>
        <div className="calendar-day">F</div>
        <div className="calendar-day">S</div>
        {[...Array(31)].map((_, i) => (
          <div
            key={i}
            className={`calendar-date ${
              i === 4 || i === 18 ? "highlight" : ""
            }`}
          >
            {i + 1}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
