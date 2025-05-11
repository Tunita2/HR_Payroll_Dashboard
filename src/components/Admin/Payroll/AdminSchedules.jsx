import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance';

// Reuse styles from Schedules.jsx
const styles = {
  // Layout
  app: {
    fontFamily: 'Arial, sans-serif',
    color: '#e2e8f0',
    minHeight: '100vh',
  },
  header: {
    backgroundColor: '#1e3a8a',
    color: 'white',
    padding: '1rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
  },
  headerTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  mainContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '1rem 0',
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '1.5rem',
  },
  card: {
    backgroundColor: 'rgb(12, 6, 56)',
    borderRadius: '0.375rem',
    padding: '1rem',
    boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
    border: '1px solid #334155',
  },
  section: {
    marginBottom: '1.5rem',
  },
  sectionTitle: {
    fontSize: '1.125rem',
    fontWeight: '600',
    marginBottom: '1rem',
    color: '#94a3b8',
  },

  // Employee List
  employeeList: {
    maxHeight: '16rem',
    overflowY: 'auto',
  },
  employeeButton: {
    width: '100%',
    textAlign: 'left',
    padding: '0.75rem',
    borderRadius: '0.25rem',
    border: 'none',
    cursor: 'pointer',
    marginBottom: '0.5rem',
  },
  employeeButtonActive: {
    backgroundColor: '#1e40af',
    color: '#ffffff',
  },
  employeeButtonInactive: {
    backgroundColor: '#334155',
    color: '#e2e8f0',
  },
  employeeName: {
    fontWeight: '500',
    marginBottom: '0.25rem',
  },
  employeeDetail: {
    fontSize: '0.875rem',
    color: '#94a3b8',
  },

  // Calendar
  calendarHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  calendarTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#e2e8f0',
  },
  button: {
    padding: '0.5rem 1rem',
    backgroundColor: '#334155',
    color: '#e2e8f0',
    border: 'none',
    borderRadius: '0.25rem',
    cursor: 'pointer',
  },
  calendarGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '0.25rem',
  },
  calendarDayHeader: {
    padding: '0.5rem',
    textAlign: 'center',
    fontWeight: '500',
    backgroundColor: '#1e3a8a',
    color: '#e2e8f0',
  },
  calendarDay: {
    padding: '0.5rem',
    minHeight: '3rem',
    border: '1px solid #334155',
  },
  calendarDayPresent: {
    backgroundColor: '#064e3b',
    color: '#d1fae5',
  },
  calendarDayAbsent: {
    backgroundColor: '#7f1d1d',
    color: '#fee2e2',
  },
  calendarDayLeave: {
    backgroundColor: '#78350f',
    color: '#fef3c7',
  },
  calendarDayWeekend: {
    backgroundColor: '#0f172a',
    color: '#64748b',
  },
  calendarDayEmpty: {
    backgroundColor: '#0f172a',
  },
  calendarDayNumber: {
    textAlign: 'right',
    marginBottom: '0.25rem',
  },
  calendarDayStatus: {
    fontSize: '0.75rem',
    textTransform: 'capitalize',
  },

  // Summary
  summaryContainer: {
    backgroundColor: '#1e293b',
    padding: '1rem',
    borderRadius: '0.5rem',
    border: '1px solid #334155',
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '1rem',
  },
  summaryItem: {
    textAlign: 'center',
  },
  summaryItemValueWork: {
    fontSize: '1.875rem',
    fontWeight: '700',
    color: '#3b82f6',
  },
  summaryItemValueAbsent: {
    fontSize: '1.875rem',
    fontWeight: '700',
    color: '#ef4444',
  },
  summaryItemValueLeave: {
    fontSize: '1.875rem',
    fontWeight: '700',
    color: '#f59e0b',
  },
  summaryItemValueRate: {
    fontSize: '1.875rem',
    fontWeight: '700',
    color: '#10b981',
  },
  summaryItemLabel: {
    fontSize: '0.875rem',
    color: '#94a3b8',
  },
};

const mediaStyles = `
  @media (min-width: 768px) {
    .grid-container {
      grid-template-columns: 1fr 2fr;
    }
  }
  
  body {
    background-color: #0f172a;
    margin: 0;
    padding: 0;
  }
`;

// Calendar Component
const Calendar = ({ attendance, month, year, onMonthChange }) => {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  
  const handlePrevMonth = () => {
    const newMonth = month === 0 ? 11 : month - 1;
    const newYear = month === 0 ? year - 1 : year;
    onMonthChange(newMonth, newYear);
  };
  
  const handleNextMonth = () => {
    const newMonth = month === 11 ? 0 : month + 1;
    const newYear = month === 11 ? year + 1 : year;
    onMonthChange(newMonth, newYear);
  };
  
  // Find attendance status for a specific day
  const getAttendanceStatus = (day) => {
    // In a real app, this would check actual records
    // For demo, let's generate some random statuses
    const dayOfWeek = new Date(year, month, day).getDay();
    
    // Weekend
    if (dayOfWeek === 0 || dayOfWeek === 6) return "weekend";
    
    // Mock some absences based on day number
    if (day % 10 === 3) return "absent";
    if (day % 15 === 2) return "leave";
    
    return "present";
  };

  const getDayStyle = (status) => {
    switch(status) {
      case 'present': return styles.calendarDayPresent;
      case 'absent': return styles.calendarDayAbsent;
      case 'leave': return styles.calendarDayLeave;
      case 'weekend': return styles.calendarDayWeekend;
      default: return {};
    }
  };

  return (
    <div style={styles.section}>
      <div style={styles.calendarHeader}>
        <button 
          style={styles.button}
          onClick={handlePrevMonth}
        >
          &lt; Prev
        </button>
        
        <h2 style={styles.calendarTitle}>
          {monthNames[month]} {year}
        </h2>
        
        <button 
          style={styles.button}
          onClick={handleNextMonth}
        >
          Next &gt;
        </button>
      </div>
      
      <div style={styles.calendarGrid}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} style={styles.calendarDayHeader}>
            {day}
          </div>
        ))}
        
        {/* Empty cells for days before the first day of month */}
        {Array.from({ length: firstDayOfMonth }).map((_, index) => (
          <div key={`empty-${index}`} style={{...styles.calendarDay, ...styles.calendarDayEmpty}}></div>
        ))}
        
        {/* Days of the month */}
        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1;
          const status = getAttendanceStatus(day);
          
          return (
            <div 
              key={day} 
              style={{...styles.calendarDay, ...getDayStyle(status)}}
            >
              <div style={styles.calendarDayNumber}>{day}</div>
              {status && status !== 'weekend' && (
                <div style={styles.calendarDayStatus}>{status}</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Add CSS for responsive design
const StyleSheet = () => {
  return (
    <style dangerouslySetInnerHTML={{ __html: mediaStyles }} />
  );
};

const AdminSchedules = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);

  const handleMonthChange = (month, year) => {
    setSelectedMonth(month);
    setSelectedYear(year);
  };

  return (
    <div>
      <div className='main-title'>Schedule Management</div>
      <div style={styles.app}>
        <StyleSheet />
        <main style={styles.mainContainer}>
          <div className="grid-container" style={styles.gridContainer}>
            <div style={styles.card}>
              <Calendar
                month={selectedMonth}
                year={selectedYear}
                onMonthChange={handleMonthChange}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminSchedules;
