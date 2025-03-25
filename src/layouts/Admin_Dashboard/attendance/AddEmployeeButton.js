import React from "react";
import "./AddEmployeeButton.css";

const AddEmployeeButton = ({
  onClick = () => console.log("Add employee clicked"),
}) => {
  return (
    <button className="add-employee-button" onClick={onClick}>
      Add employee
    </button>
  );
};

export default AddEmployeeButton;
