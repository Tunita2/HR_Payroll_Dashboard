import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../../styles/PayrollStyles/Schedules.css';

const Schedules = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [schedules, setSchedules] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const shifts = [
    { id: 1, name: 'Morning', color: '#4ade80', hours: '6:00 AM - 2:00 PM' },
    { id: 2, name: 'Afternoon', color: '#fb923c', hours: '2:00 PM - 10:00 PM' },
    { id: 3, name: 'Night', color: '#6366f1', hours: '10:00 PM - 6:00 AM' },
  ];

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setShowModal(true);
  };

  const handleAddSchedule = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const newSchedule = {
      date: selectedDate,
      shiftId: parseInt(formData.get('shift')),
      employeeId: parseInt(formData.get('employee')),
    };
    setSchedules([...schedules, newSchedule]);
    setShowModal(false);
  };

  return (
    <div className="schedules-container">
      <div className="schedules-header">
        <h2>Work Schedules</h2>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => setShowModal(true)}
        >
          Add Schedule
        </button>
      </div>

      <div className="schedule-calendar">
        <Calendar
          onChange={handleDateClick}
          value={selectedDate}
          tileContent={({ date }) => {
            const schedule = schedules.find(
              (s) => s.date.toDateString() === date.toDateString()
            );
            if (schedule) {
              const shift = shifts.find((s) => s.id === schedule.shiftId);
              return (
                <div
                  className="shift-color"
                  style={{ backgroundColor: shift.color }}
                />
              );
            }
          }}
        />
      </div>

      <div className="shift-legend">
        {shifts.map((shift) => (
          <div key={shift.id} className="shift-item">
            <div
              className="shift-color"
              style={{ backgroundColor: shift.color }}
            />
            <span>{shift.name} ({shift.hours})</span>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg schedule-modal">
            <h3 className="text-lg font-medium mb-4">Add Schedule</h3>
            <form onSubmit={handleAddSchedule} className="schedule-form">
              <div className="form-group">
                <label>Date</label>
                <input
                  type="text"
                  value={selectedDate.toDateString()}
                  disabled
                />
              </div>
              <div className="form-group">
                <label>Shift</label>
                <select name="shift" required>
                  {shifts.map((shift) => (
                    <option key={shift.id} value={shift.id}>
                      {shift.name} ({shift.hours})
                    </option>
                  ))}
                </select>
              </div>
              <div className="schedule-actions">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Schedules;