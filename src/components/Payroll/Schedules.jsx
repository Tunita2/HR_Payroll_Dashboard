// import React from 'react';
// import "../../styles/PayrollStyles/schedule.css"

// const Schedules = ({ employeeData }) => {
//     const [selectedWeek, setSelectedWeek] = useState(getStartOfWeek(new Date()));
//     const [scheduleData, setScheduleData] = useState(generateMockScheduleData(employeeData));
  
//     // Các hàm helper
//     function getStartOfWeek(date) {
//       const newDate = new Date(date);
//       const day = newDate.getDay();
//       const diff = newDate.getDate() - day + (day === 0 ? -6 : 1); // Điều chỉnh nếu là Chủ nhật
//       newDate.setDate(diff);
//       return newDate;
//     }
  
//     function formatDate(date) {
//       const d = new Date(date);
//       return d.toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit' });
//     }
  
//     function addDays(date, days) {
//       const newDate = new Date(date);
//       newDate.setDate(newDate.getDate() + days);
//       return newDate;
//     }
  
//     function generateMockScheduleData(employees) {
//       const shifts = ['Sáng', 'Chiều', 'Cả ngày', 'Nghỉ'];
//       const schedule = {};
  
//       employees.forEach(emp => {
//         schedule[emp.EmployeeID] = {
//           employeeName: emp.FullName,
//           department: emp.DepartmentID,
//           status: emp.Status,
//           shifts: []
//         };
  
//         // Tạo lịch làm việc ngẫu nhiên cho 7 ngày
//         for (let i = 0; i < 7; i++) {
//           const shiftIndex = emp.Status === 'Active' ? 
//             Math.floor(Math.random() * (shifts.length - 1)) : 
//             shifts.length - 1; // Inactive thì luôn nghỉ
            
//           schedule[emp.EmployeeID].shifts.push({
//             date: addDays(getStartOfWeek(new Date()), i),
//             shift: shifts[shiftIndex],
//             notes: ''
//           });
//         }
//       });
  
//       return schedule;
//     }
  
//     const moveWeek = (weeks) => {
//       const newDate = new Date(selectedWeek);
//       newDate.setDate(newDate.getDate() + (7 * weeks));
//       setSelectedWeek(newDate);
//       // Trong ứng dụng thực tế, chúng ta sẽ gọi API để lấy dữ liệu cho tuần mới
//     };
  
//     const weekDates = Array(7).fill().map((_, i) => addDays(selectedWeek, i));
//   return (
//     <div className="card mb-6">
//       <h2>Lịch làm việc</h2>
      
//       <div className="schedule-controls">
//         <button className="btn btn-secondary" onClick={() => moveWeek(-1)}>
//           Tuần trước
//         </button>
//         <div className="schedule-week">
//           {formatDate(weekDates[0])} - {formatDate(weekDates[6])}
//         </div>
//         <button className="btn btn-secondary" onClick={() => moveWeek(1)}>
//           Tuần sau
//         </button>
//       </div>
      
//       <div className="table-container">
//         <table className="schedule-table">
//           <thead>
//             <tr>
//               <th>Nhân viên</th>
//               {weekDates.map((date, i) => (
//                 <th key={i} className={new Date(date).getDay() === 0 || new Date(date).getDay() === 6 ? 'weekend' : ''}>
//                   {formatDate(date)}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {Object.values(scheduleData).map((employee) => (
//               <tr key={employee.employeeName} className={employee.status === 'Inactive' ? 'inactive-row' : ''}>
//                 <td className="employee-name">{employee.employeeName}</td>
//                 {employee.shifts.map((shift, idx) => (
//                   <td 
//                     key={idx}
//                     className={`shift-cell ${shift.shift === 'Nghỉ' ? 'off-day' : ''} ${new Date(shift.date).getDay() === 0 || new Date(shift.date).getDay() === 6 ? 'weekend' : ''}`}
//                   >
//                     <div className={`shift-badge ${shift.shift.toLowerCase().replace(' ', '-')}`}>
//                       {shift.shift}
//                     </div>
//                     {shift.notes && <div className="shift-note">{shift.notes}</div>}
//                   </td>
//                 ))}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
      
//       <div className="schedule-legend">
//         <div className="legend-item">
//           <span className="shift-badge sang">Sáng</span>
//           <span>7:30 - 11:30</span>
//         </div>
//         <div className="legend-item">
//           <span className="shift-badge chiều">Chiều</span>
//           <span>13:00 - 17:00</span>
//         </div>
//         <div className="legend-item">
//           <span className="shift-badge cả-ngày">Cả ngày</span>
//           <span>7:30 - 17:00</span>
//         </div>
//         <div className="legend-item">
//           <span className="shift-badge nghỉ">Nghỉ</span>
//           <span>Không làm việc</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Schedules;