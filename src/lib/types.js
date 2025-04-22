/**
 * @typedef {'ADMIN' | 'HR_MANAGER' | 'PAYROLL_OFFICER' | 'STAFF'} UserRole
 */

/**
 * @typedef {'VIEW_DASHBOARD' | 'MANAGE_PAYROLL' | 'MANAGE_ATTENDANCE' | 'MANAGE_SCHEDULE' | 'VIEW_REPORTS' | 'MANAGE_SETTINGS'} Permission
 */

/**
 * @typedef {'pending' | 'approved' | 'rejected' | 'paid' | 'unpaid' | 'processing'} PayrollStatus
 */

/**
 * @typedef {'present' | 'absent' | 'late' | 'half-day' | 'on-leave'} AttendanceStatus
 */

/**
 * @typedef {'annual' | 'sick' | 'personal' | 'maternity' | 'paternity' | 'unpaid'} LeaveType
 */

/**
 * @typedef {'regular' | 'early' | 'late'} ShiftType
 */

/**
 * @typedef {Object} Employee
 * @property {string} id
 * @property {string} fullname
 * @property {string} email
 * @property {string} department
 * @property {string} position
 * @property {string} joinDate
 * @property {'active' | 'inactive'} status
 * @property {number} baseSalary
 */

/**
 * @typedef {Object} Department
 * @property {string} id
 * @property {string} name
 * @property {string} manager - Employee ID of department manager
 * @property {number} employeeCount
 */

/**
 * @typedef {Object} SalaryRecord
 * @property {string} id
 * @property {string} employeeId
 * @property {string} month - YYYY-MM format
 * @property {number} baseSalary
 * @property {number} overtime
 * @property {number} bonus
 * @property {Object} deductions
 * @property {number} deductions.tax
 * @property {number} deductions.insurance
 * @property {number} deductions.other
 * @property {number} netSalary
 * @property {PayrollStatus} status
 */

/**
 * @typedef {Object} AttendanceRecord
 * @property {string} id
 * @property {string} employeeId
 * @property {string} date - YYYY-MM-DD format
 * @property {string} checkIn - HH:mm format
 * @property {string} checkOut - HH:mm format
 * @property {AttendanceStatus} status
 * @property {number} totalHours
 * @property {number} overtime
 */

/**
 * @typedef {Object} Schedule
 * @property {ShiftType} shift
 * @property {string} start - HH:mm format
 * @property {string} end - HH:mm format
 * @property {'scheduled' | 'completed' | 'absent'} status
 */

/**
 * @typedef {Object} LeaveRequest
 * @property {string} id
 * @property {string} employeeId
 * @property {LeaveType} type
 * @property {string} startDate - YYYY-MM-DD format
 * @property {string} endDate - YYYY-MM-DD format
 * @property {'pending' | 'approved' | 'rejected'} status
 * @property {string} reason
 */

/**
 * @typedef {Object} Notification
 * @property {string} id
 * @property {string} employeeId
 * @property {'payroll' | 'attendance' | 'leave' | 'system'} type
 * @property {string} message
 * @property {string} date - YYYY-MM-DD format
 * @property {'read' | 'unread'} status
 */

/**
 * @typedef {Object} PayrollSummary
 * @property {number} totalEmployees
 * @property {number} activeEmployees
 * @property {number} totalPayroll
 * @property {number} averageSalary
 * @property {Object.<string, number>} departmentCosts
 * @property {Array<{month: string, total: number}>} monthlyTrends
 */

/**
 * @typedef {Object} Shift
 * @property {string} name
 * @property {string} start - HH:mm format
 * @property {string} end - HH:mm format
 * @property {string} breakTime - HH:mm-HH:mm format
 */

// Enum-like constants for type checking
export const UserRole = {
  ADMIN: "ADMIN",
  HR_MANAGER: "HR_MANAGER",
  PAYROLL_OFFICER: "PAYROLL_OFFICER",
  STAFF: "STAFF",
};

export const NotificationType = {
  PAYROLL: "payroll",
  ATTENDANCE: "attendance",
  LEAVE: "leave",
  SYSTEM: "system",
  ANNIVERSARY: "anniversary",
  LEAVE_EXCEED: "leave_exceed",
  PAYROLL_DISCREPANCY: "payroll_discrepancy",
  PAYROLL_SENT: "payroll_sent",
};

export const PayrollStatus = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
  PAID: "paid",
  UNPAID: "unpaid",
  PROCESSING: "processing",
};

export const AttendanceStatus = {
  PRESENT: "present",
  ABSENT: "absent",
  LATE: "late",
  HALF_DAY: "half-day",
  ON_LEAVE: "on-leave",
};

export const LeaveType = {
  ANNUAL: "annual",
  SICK: "sick",
  PERSONAL: "personal",
  MATERNITY: "maternity",
  PATERNITY: "paternity",
  UNPAID: "unpaid",
};

export const ShiftType = {
  REGULAR: "regular",
  EARLY: "early",
  LATE: "late",
};

// Utility type checking functions
export const isValidUserRole = (role) => Object.values(UserRole).includes(role);
export const isValidPayrollStatus = (status) =>
  Object.values(PayrollStatus).includes(status);
export const isValidAttendanceStatus = (status) =>
  Object.values(AttendanceStatus).includes(status);
export const isValidLeaveType = (type) =>
  Object.values(LeaveType).includes(type);
export const isValidShiftType = (type) =>
  Object.values(ShiftType).includes(type);
