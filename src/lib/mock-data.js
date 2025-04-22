import { NotificationType } from "./types";

// Constants and Enums
export const EMPLOYEE_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  ON_LEAVE: "on-leave",
  SUSPENDED: "suspended",
};

export const ATTENDANCE_STATUS = {
  PRESENT: "present",
  ABSENT: "absent",
  LATE: "late",
  HALF_DAY: "half-day",
  ON_LEAVE: "on-leave",
};

export const SALARY_STATUS = {
  PAID: "paid",
  UNPAID: "unpaid",
  PROCESSING: "processing",
  HOLD: "hold",
};

// Generate a random date within the last 30 days
const getRandomDate = (daysAgo = 30) => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
  return date.toISOString();
};

// Generate a random boolean with a bias towards false (unread)
const getRandomStatus = () => {
  return Math.random() > 0.7;
};

// Employee Data
export const employees = [
  {
    id: "EMP001",
    fullname: "John Smith",
    email: "john.smith@company.com",
    phone: "123-456-7890",
    position: "Software Engineer",
    department: "Engineering",
    joinDate: "2022-01-15",
    status: EMPLOYEE_STATUS.ACTIVE,
  },
  {
    id: "EMP002",
    fullname: "Sarah Johnson",
    email: "sarah.j@company.com",
    phone: "123-456-7891",
    position: "HR Manager",
    department: "Human Resources",
    joinDate: "2021-08-20",
    status: EMPLOYEE_STATUS.ACTIVE,
  },
  {
    id: "EMP003",
    fullname: "Michael Chen",
    email: "michael.c@company.com",
    phone: "123-456-7892",
    position: "Marketing Specialist",
    department: "Marketing",
    joinDate: "2022-03-10",
    status: EMPLOYEE_STATUS.ON_LEAVE,
  },
];

// Generate mock notifications
export const mockNotifications = [
  // Work Anniversary Notifications
  ...Array(5)
    .fill(null)
    .map((_, index) => {
      const employeeName = employees[index % employees.length].fullname;
      const years = Math.floor(Math.random() * 10) + 1;
      return {
        id: `anniversary-${index}`,
        type: NotificationType.ANNIVERSARY,
        message: `🎉 ${employeeName} is reaching their ${years} year work anniversary on ${new Date().toLocaleDateString()}.`,
        date: getRandomDate(15),
        status: getRandomStatus(),
        employeeName,
        details: {
          years,
        },
      };
    }),

  // Leave Exceed Alerts
  ...Array(4)
    .fill(null)
    .map((_, index) => {
      const employeeName = employees[index % employees.length].fullname;
      const daysExceeded = Math.floor(Math.random() * 5) + 1;
      return {
        id: `leave-${index}`,
        type: NotificationType.LEAVE_EXCEED,
        message: `⚠️ ${employeeName} has exceeded the allowed leave days by ${daysExceeded} days.`,
        date: getRandomDate(10),
        status: getRandomStatus(),
        employeeName,
        details: {
          daysExceeded,
        },
      };
    }),

  // Payroll Discrepancy Alerts
  ...Array(3)
    .fill(null)
    .map((_, index) => {
      const employeeName = employees[index % employees.length].fullname;
      const previousAmount = Math.floor(Math.random() * 2000) + 3000;
      const currentAmount = Math.floor(
        previousAmount * (0.7 + Math.random() * 0.1)
      );
      return {
        id: `discrepancy-${index}`,
        type: NotificationType.PAYROLL_DISCREPANCY,
        message: `📉 Major payroll change detected for ${employeeName}: ${currentAmount} vs ${previousAmount}.`,
        date: getRandomDate(7),
        status: getRandomStatus(),
        employeeName,
        details: {
          currentAmount,
          previousAmount,
        },
      };
    }),

  // Monthly Payroll Sent Notifications
  ...Array(8)
    .fill(null)
    .map((_, index) => {
      const employeeName = employees[index % employees.length].fullname;
      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
      ];
      const month = months[Math.floor(Math.random() * months.length)];
      return {
        id: `payroll-${index}`,
        type: NotificationType.PAYROLL_SENT,
        message: `📩 Payroll for ${month} 2023 has been sent to ${employeeName}.`,
        date: getRandomDate(20),
        status: getRandomStatus(),
        employeeName,
        details: {
          month,
        },
      };
    }),
];

// Departments Data
export const departments = [
  {
    id: "DEP001",
    name: "Human Resources",
    description: "HR department handling employee management",
  },
  {
    id: "DEP002",
    name: "Finance",
    description: "Financial planning and accounting",
  },
  {
    id: "DEP003",
    name: "Engineering",
    description: "Software development and technical operations",
  },
  {
    id: "DEP004",
    name: "Marketing",
    description: "Marketing and brand management",
  },
  {
    id: "DEP005",
    name: "Sales",
    description: "Sales and customer relationships",
  },
];

// Positions Data
export const positions = [
  { id: "POS001", name: "HR Manager", department: "DEP001", baseSalary: 75000 },
  {
    id: "POS002",
    name: "Software Engineer",
    department: "DEP003",
    baseSalary: 85000,
  },
  {
    id: "POS003",
    name: "Marketing Specialist",
    department: "DEP004",
    baseSalary: 65000,
  },
  {
    id: "POS004",
    name: "Financial Analyst",
    department: "DEP002",
    baseSalary: 70000,
  },
  {
    id: "POS005",
    name: "Sales Representative",
    department: "DEP005",
    baseSalary: 60000,
  },
];

// Attendance Records
export const attendanceRecords = [
  {
    id: "ATT001",
    employeeId: "EMP001",
    date: "2025-04-21",
    checkIn: "09:00",
    checkOut: "17:30",
    status: ATTENDANCE_STATUS.PRESENT,
    totalHours: 8.5,
    overtime: 0.5,
  },
  {
    id: "ATT002",
    employeeId: "EMP002",
    date: "2025-04-21",
    checkIn: "08:45",
    checkOut: "17:00",
    status: ATTENDANCE_STATUS.PRESENT,
    totalHours: 8.25,
    overtime: 0.25,
  },
  {
    id: "ATT003",
    employeeId: "EMP003",
    date: "2025-04-21",
    status: ATTENDANCE_STATUS.ON_LEAVE,
  },
];

// Salary Records
export const salaryRecords = [
  {
    id: "SAL001",
    employeeId: "EMP001",
    month: "2025-04",
    baseSalary: 85000,
    overtime: 1250,
    bonus: 2000,
    deductions: 8925,
    netSalary: 79325,
    status: SALARY_STATUS.PROCESSING,
  },
  {
    id: "SAL002",
    employeeId: "EMP002",
    month: "2025-04",
    baseSalary: 75000,
    overtime: 800,
    bonus: 1500,
    deductions: 7730,
    netSalary: 69570,
    status: SALARY_STATUS.PROCESSING,
  },
];

export const leaveRequests = [
  {
    id: "LR101",
    employeeId: "EMP001",
    type: "annual",
    startDate: "2025-04-25",
    endDate: "2025-04-26",
    status: "pending",
    reason: "Family vacation",
  },
  {
    id: "LR102",
    employeeId: "EMP002",
    type: "sick",
    startDate: "2025-04-23",
    endDate: "2025-04-23",
    status: "approved",
    reason: "Medical appointment",
  },
];

export const notifications = [
  {
    id: "NOT101",
    employeeId: "EMP001",
    type: "payroll",
    message: "Your salary for April 2025 has been processed",
    date: "2025-04-21",
    status: "unread",
  },
  {
    id: "NOT102",
    employeeId: "EMP002",
    type: "leave",
    message: "Your leave request has been approved",
    date: "2025-04-21",
    status: "unread",
  },
];

export const payrollSummary = {
  totalEmployees: 156,
  activeEmployees: 150,
  totalPayroll: 780000,
  averageSalary: 5200,
  departmentCosts: {
    Engineering: 320000,
    "Human Resources": 150000,
    Marketing: 180000,
    Finance: 130000,
  },
  monthlyTrends: [
    { month: "Jan", total: 720000 },
    { month: "Feb", total: 740000 },
    { month: "Mar", total: 760000 },
    { month: "Apr", total: 780000 },
  ],
};

// Shift Definitions
export const shifts = {
  regular: {
    name: "Regular",
    startTime: "09:00",
    endTime: "17:00",
    breakDuration: 60,
    color: "#3b82f6",
  },
  early: {
    name: "Early",
    startTime: "06:00",
    endTime: "14:00",
    breakDuration: 60,
    color: "#10b981",
  },
  late: {
    name: "Late",
    startTime: "14:00",
    endTime: "22:00",
    breakDuration: 60,
    color: "#f59e0b",
  },
};

// Schedule Data
export const schedules = {
  EMP001: {
    "2025-04-22": { shift: "Regular", start: "09:00", end: "17:00" },
    "2025-04-23": { shift: "Regular", start: "09:00", end: "17:00" },
    "2025-04-24": { shift: "Early", start: "06:00", end: "14:00" },
    "2025-04-25": { shift: "Regular", start: "09:00", end: "17:00" },
  },
  EMP002: {
    "2025-04-22": { shift: "Late", start: "14:00", end: "22:00" },
    "2025-04-23": { shift: "Late", start: "14:00", end: "22:00" },
    "2025-04-24": { shift: "Regular", start: "09:00", end: "17:00" },
    "2025-04-25": { shift: "Late", start: "14:00", end: "22:00" },
  },
};
