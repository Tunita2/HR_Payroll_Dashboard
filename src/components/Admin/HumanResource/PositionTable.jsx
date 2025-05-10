import React from 'react';
import HRPositionTable from "../../HumanResource/HR_PositionTable";  
const PositionTable = () => {
  // const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");
  return (
    <HRPositionTable token={token}/>
  );
};

export default PositionTable;