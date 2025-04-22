const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");

const AdminAPI = require("./admin-API");
const PayrollAPI = require("./payroll-API");
const { router: AuthAPI } = require("./auth-API");
const PORT = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

app.use("/api/payroll", PayrollAPI);
app.use("/api/admin", AdminAPI);
app.use("/api/auth", AuthAPI);

app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
