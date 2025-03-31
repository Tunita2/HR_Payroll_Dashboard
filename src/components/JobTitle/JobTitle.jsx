import React from "react";
import "../../styles//JobTitle/JobTitle.css";

const JobTable = ({ style }) => {
  const job = [
    {
      id: "01",
      jobTitle: "Sale",
      minSalary: "5.000.000",
      maxSalary: "8.000.000",
    },

    // ... other employees
  ];

  return (
    <div>
      <div class="job-table-header">
        <div>Job Title</div>
        <div class="job-search-container">
          <input
            type="text"
            placeholder="Search..."
            // value={searchTerm}
            // onChange={(e) => setSearchTerm(e.target.value)}
            className="table-search-job-input"
          />
          <img
            src="https://dashboard.codeparrot.ai/api/image/Z-kDXwz4-w8v6Rl0/frame-9.png"
            alt="Search"
            className="job-search-bar-icon"
          />
        </div>

        <div className="table-button-container">
          <button className="table-button add">
            <strong>Add</strong>
          </button>
          <button className="table-button">
            <strong>Delete</strong>
          </button>
        </div>
      </div>

      <div className="job-table-container" style={style}>
        <table className="job-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Job name</th>
              <th>Min Salary</th>
              <th>Max Salary</th>
            </tr>
          </thead>
          <tbody>
            {job.map((job, index) => (
              <tr key={index} className="job-table-row">
                <td>{job.id}</td>
                <td>{job.jobTitle}</td>
                <td>{job.minSalary}</td>
                <td>{job.maxSalary}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

JobTable.defaultProps = {
  style: {},
};

export default JobTable;
