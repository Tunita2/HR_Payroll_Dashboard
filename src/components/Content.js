import { useState } from "react";
import "../styles/Content.css";
import { FaSearch, FaEdit } from "react-icons/fa";

const data = [
  {
    id: 1,
    name: "Bui Le Tuan",
    department: "IT",
    baseSalary: 100,
    bonus: 50,
    deduction: 20,
    netSalary: 150,
    status: "Active",
  },
  {
    id: 2,
    name: "Nguyen Van A",
    department: "HR",
    baseSalary: 120,
    bonus: 40,
    deduction: 30,
    netSalary: 130,
    status: "Inactive",
  },
  {
    id: 3,
    name: "Tran Thi B",
    department: "Finance",
    baseSalary: 130,
    bonus: 45,
    deduction: 25,
    netSalary: 150,
    status: "Active",
  },
];

const Content = () => {
  const [search, setSearch] = useState("");

  // Filter the list based on the search keyword
  const filteredData = data.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.department.toLowerCase().includes(search.toLowerCase()) ||
      item.status.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="content">
      <div className="search-bar">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search by name, department, or status..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Department</th>
            <th>Base Salary</th>
            <th>Bonus</th>
            <th>Deduction</th>
            <th>Net Salary</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.department}</td>
                <td>${item.baseSalary}</td>
                <td>${item.bonus}</td>
                <td>${item.deduction}</td>
                <td>${item.netSalary}</td>
                <td>{item.status}</td>
                <td className="action-column">
                  <FaEdit className="edit-icon" />
                  <span className="view-details">View details</span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="no-data">
                No results found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Content;
