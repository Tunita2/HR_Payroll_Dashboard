import React from 'react';
import "../../styles/PayrollStyles/tableSalaries.css"

const SalaryTable = () => {
  const list_salary = [
    {
      id: "01",
      employee_id: "101",
      fullname: "Văn An",
      position: "Manager",
      department: "Marketing",
      SalaryMonth: "200",
      BaseSalary: "19",
      Bonus: "19",
      Deductions: "900",
      NetSalary: "900",
    },
    {
      id: "01",
      employee_id: "101",
      fullname: "Văn An",
      position: "Manager",
      department: "Marketing",
      SalaryMonth: "200",
      BaseSalary: "19",
      Bonus: "19",
      Deductions: "800",
      NetSalary: "800",
    },
    {
      id: "01",
      employee_id: "101",
      fullname: "Văn An",
      position: "Manager",
      department: "Marketing",
      SalaryMonth: "200",
      BaseSalary: "19",
      Bonus: "19",
      Deductions: "700",
      NetSalary: "700",
    },
    {
      id: "01",
      employee_id: "101",
      fullname: "Văn An",
      position: "Manager",
      department: "Marketing",
      SalaryMonth: "200",
      BaseSalary: "19",
      Bonus: "19",
      Deductions: "700",
      NetSalary: "700",
    },
    {
      id: "01",
      employee_id: "101",
      fullname: "Văn An",
      position: "Manager",
      department: "Marketing",
      SalaryMonth: "200",
      BaseSalary: "19",
      Bonus: "19",
      Deductions: "900",
      NetSalary: "900",
    },
  ];
  return (
    <div>
      <div class="appli-table-header">
        <div>Salary list</div>
        <div className="button-group">
            <div className="history">Salaries history</div>
            <img src="https://dashboard.codeparrot.ai/api/image/Z-oMCgz4-w8v6Rpi/refresh.png" alt="Refresh" style={{ width: '30px', height: '30px', marginRight: '10px' }} />
        </div>
      </div>

      {/* Bảng Dữ liệu attendance */}
      <div>
        <table className="appli-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Employee ID</th>
              <th>Full name</th>
              <th>Department</th>
              <th>Position</th>
              <th>Salary month</th>
              <th>Base salary</th>
              <th>Bonus</th>
              <th>Deductions</th>
              <th>Net salary</th>
            </tr>
          </thead>
          <tbody>
            {list_salary.map((employee, index) => (
              <tr key={index} className="appli-table-row">
                <td>{employee.id}</td>
                <td>{employee.employee_id}</td>
                <td>{employee.fullname}</td>
                <td>{employee.department}</td>
                <td>{employee.position}</td>
                <td>{employee.SalaryMonth}</td>
                <td>{employee.BaseSalary}</td>
                <td>{employee.Bonus}</td>
                <td>{employee.Deductions}</td>
                <td>{employee.NetSalary}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalaryTable;