import React from 'react';
import './TableLayout.css';
import TableHeader from '../../components/table/TableHeader';
import TableRow from '../../components/table/TableRow';

const TableLayout = () => {
  return (
    <div className="table-container">
      <TableHeader />
      <TableRow />
    </div>
  );
};

export default TableLayout;

