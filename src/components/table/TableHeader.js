import React from 'react';
import '../../styles/table/Table.css';

const TableHeader = () => {
  return (
    <div className="table-header">
      <div className="header-cell id">ID</div>
      <div className="header-cell name">Name</div>
      <div className="header-cell department">Department</div>
      <div className="header-cell base-salary">Base salary</div>
      <div className="header-cell bonuses">Bonuses</div>
      <div className="header-cell deductions">Deductions</div>
      <div className="header-cell net-salary">Net salary</div>
      <div className="header-cell status">Status</div>
      <div className="header-cell action">Edit</div>
    </div>
  );
};

TableHeader.defaultProps = {
  columns: [
    'ID', 'Name', 'Department', 'Base salary', 'Bonuses', 'Deductions', 'Net salary', 'Status', 'Action'
  ]
};

export default TableHeader;

