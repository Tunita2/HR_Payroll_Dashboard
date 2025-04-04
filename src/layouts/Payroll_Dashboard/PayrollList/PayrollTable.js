import React from "react";
import { FaRegEdit } from "react-icons/fa";
import TableHeader from "../../../components/table/TableHeader"
import TableRow from "../../../components/table/TableRow"
import "./PayrollTable.css";

const EmployeeTable = () => {
  

  return (
    <div className="table-container">
      <TableHeader></TableHeader>
      <TableRow></TableRow>
    </div>
  );
};

export default EmployeeTable;
