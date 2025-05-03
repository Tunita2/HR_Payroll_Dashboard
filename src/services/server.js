const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");

const AdminAPI = require("./admin-API");
const PayrollAPI = require("./payroll-API");
const EmployeeAPI = require("./employee-API");
const PORT = 3001;

// Middlewarew
app.use(cors());
app.use(bodyParser.json());

app.use("/api/admin", AdminAPI);
app.use("/api/payroll", PayrollAPI);
app.use("/api/employee", EmployeeAPI);

app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
