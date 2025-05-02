const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");

const AdminAPI = require("./Routes/admin-API");
const PayrollAPI = require("./Routes/payroll-API");
const EmployeeAPI = require("./Routes/employee-API");
const { router: AuthAPI } = require("./Auth/auth-API");
const PORT = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/admin", AdminAPI);
app.use("/api/payroll", PayrollAPI);
app.use("/api/admin", EmployeeAPI);
app.use("/api/auth", AuthAPI);

app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
