const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");

const AdminAPI = require("./admin-API");
const PayrollAPI = require("./payroll-API");
const PORT = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

app.use("/api/payroll", PayrollAPI);
app.use("/api/admin", AdminAPI);

// Mock data for alerts
const alertsData = [
  {
    id: 1,
    employeeName: "John Smith",
    employeeId: "EMP001",
    department: "IT",
    allowedDays: 12,
    usedDays: 15,
    daysExceeded: 3,
    date: "04/15/2025",
  },
  {
    id: 2,
    employeeName: "Sarah Johnson",
    employeeId: "EMP002",
    department: "HR",
    allowedDays: 12,
    usedDays: 18,
    daysExceeded: 6,
    date: "04/16/2025",
  },
  {
    id: 3,
    employeeName: "Michael Lee",
    employeeId: "EMP003",
    department: "Finance",
    allowedDays: 15,
    usedDays: 16,
    daysExceeded: 1,
    date: "04/14/2025",
  },
];

// Alerts API endpoints
app.get("/api/alerts", (req, res) => {
  res.json(alertsData);
});

app.delete("/api/alerts/:id", (req, res) => {
  const alertId = parseInt(req.params.id);
  const index = alertsData.findIndex((alert) => alert.id === alertId);

  if (index !== -1) {
    alertsData.splice(index, 1);
    res.json({ message: "Alert dismissed successfully" });
  } else {
    res.status(404).json({ error: "Alert not found" });
  }
});

app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
