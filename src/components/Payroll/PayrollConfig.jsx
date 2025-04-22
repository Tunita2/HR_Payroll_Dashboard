import {
  FaChartLine,
  FaMoneyBillWave,
  FaUserClock,
  FaCalendarAlt,
  FaChartBar,
  FaCog,
  FaQuestionCircle,
  FaCalendar,
  FaClipboardList
} from 'react-icons/fa';

// Permission definitions
export const permissions = {
  ADMIN: {
    VIEW_DASHBOARD: true,
    MANAGE_PAYROLL: true,
    MANAGE_ATTENDANCE: true,
    MANAGE_SCHEDULE: true,
    VIEW_REPORTS: true,
    MANAGE_SETTINGS: true
  },
  HR_MANAGER: {
    VIEW_DASHBOARD: true,
    MANAGE_PAYROLL: true,
    MANAGE_ATTENDANCE: true,
    MANAGE_SCHEDULE: true,
    VIEW_REPORTS: true,
    MANAGE_SETTINGS: false
  },
  PAYROLL_OFFICER: {
    VIEW_DASHBOARD: true,
    MANAGE_PAYROLL: true,
    MANAGE_ATTENDANCE: true,
    MANAGE_SCHEDULE: false,
    VIEW_REPORTS: true,
    MANAGE_SETTINGS: false
  },
  STAFF: {
    VIEW_DASHBOARD: true,
    MANAGE_PAYROLL: false,
    MANAGE_ATTENDANCE: false,
    MANAGE_SCHEDULE: false,
    VIEW_REPORTS: false,
    MANAGE_SETTINGS: false
  }
};

// Route configurations
export const routes = {
  dashboard: {
    path: '/payroll',
    requiredPermission: 'VIEW_DASHBOARD'
  },
  salaries: {
    path: '/payroll/salary',
    requiredPermission: 'MANAGE_PAYROLL'
  },
  attendance: {
    path: '/payroll/attendance',
    requiredPermission: 'MANAGE_ATTENDANCE'
  },
  schedule: {
    path: '/payroll/schedule',
    requiredPermission: 'MANAGE_SCHEDULE'
  },
  report: {
    path: '/payroll/report',
    requiredPermission: 'VIEW_REPORTS'
  }
};

// Menu items configuration
export const menuConfig = [
  {
    id: 'dashboard',
    text: 'Dashboard',
    path: routes.dashboard.path,
    icon: FaChartLine,
    description: 'Overview of payroll metrics',
    requiredPermission: 'VIEW_DASHBOARD'
  },
  {
    id: 'salaries',
    text: 'Salaries',
    path: routes.salaries.path,
    icon: FaMoneyBillWave,
    description: 'Manage employee salaries',
    requiredPermission: 'MANAGE_PAYROLL'
  },
  {
    id: 'attendance',
    text: 'Attendance',
    path: routes.attendance.path,
    icon: FaUserClock,
    description: 'Track employee attendance',
    requiredPermission: 'MANAGE_ATTENDANCE'
  },
  {
    id: 'schedule',
    text: 'Schedule',
    path: routes.schedule.path,
    icon: FaCalendarAlt,
    description: 'Manage work schedules',
    requiredPermission: 'MANAGE_SCHEDULE'
  },
  {
    id: 'report',
    text: 'Reports',
    path: routes.report.path,
    icon: FaChartBar,
    description: 'View payroll reports',
    requiredPermission: 'VIEW_REPORTS'
  }
];

// Settings menu items
export const settingItems = [
  {
    id: 'settings',
    text: 'Settings',
    path: '/payroll/settings',
    icon: FaCog,
    description: 'System configuration',
    requiredPermission: 'MANAGE_SETTINGS'
  },
  {
    id: 'help',
    text: 'Help',
    path: '/payroll/help',
    icon: FaQuestionCircle,
    description: 'Get help and support'
  }
];

// Payroll calculation constants
export const payrollConstants = {
  WORKING_DAYS_PER_MONTH: 22,
  OVERTIME_RATE: 1.5,
  TAX_RATE: 0.2,
  SOCIAL_SECURITY_RATE: 0.045,
  HEALTH_INSURANCE_RATE: 0.015
};

// Status definitions
export const statusTypes = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  PAID: 'paid',
  UNPAID: 'unpaid',
  PROCESSING: 'processing'
};

// Attendance status types
export const attendanceStatus = {
  PRESENT: 'present',
  ABSENT: 'absent',
  LATE: 'late',
  HALF_DAY: 'half-day',
  ON_LEAVE: 'on-leave'
};

// Leave types
export const leaveTypes = {
  ANNUAL: 'annual',
  SICK: 'sick',
  PERSONAL: 'personal',
  MATERNITY: 'maternity',
  PATERNITY: 'paternity',
  UNPAID: 'unpaid'
};

// Export functions for calculations
export const calculateNetSalary = (baseSalary, deductions = 0, bonus = 0) => {
  return baseSalary + bonus - deductions;
};

export const calculateTax = (amount) => {
  return amount * payrollConstants.TAX_RATE;
};

export const calculateOvertime = (hours, hourlyRate) => {
  return hours * hourlyRate * payrollConstants.OVERTIME_RATE;
};

export const calculateDeductions = (baseSalary) => {
  const socialSecurity = baseSalary * payrollConstants.SOCIAL_SECURITY_RATE;
  const healthInsurance = baseSalary * payrollConstants.HEALTH_INSURANCE_RATE;
  return {
    socialSecurity,
    healthInsurance,
    total: socialSecurity + healthInsurance
  };
};

// Date formatting helper
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const payrollMenu = [
  {
    id: 'schedules',
    title: 'Schedules',
    path: '/payroll/schedules',
    icon: FaCalendar,
    permissions: ['view_schedules', 'manage_schedules']
  },
  {
    id: 'attendance',
    title: 'Attendance',
    path: '/payroll/attendance',
    icon: FaClipboardList,
    permissions: ['view_attendance', 'manage_attendance']
  },
  {
    id: 'salary',
    title: 'Salary',
    path: '/payroll/salary',
    icon: FaMoneyBillWave,
    permissions: ['view_salary', 'manage_salary']
  },
  {
    id: 'reports',
    title: 'Reports',
    path: '/payroll/reports',
    icon: FaChartBar,
    permissions: ['view_reports']
  }
];

export const scheduleConfig = {
  defaultView: 'week',
  shifts: {
    regular: {
      name: 'Regular Shift',
      start: '09:00',
      end: '17:00',
      color: '#3b82f6'
    },
    early: {
      name: 'Early Shift',
      start: '06:00',
      end: '14:00',
      color: '#10b981'
    },
    late: {
      name: 'Late Shift',
      start: '14:00',
      end: '22:00',
      color: '#f59e0b'
    }
  },
  breakDuration: 60, // minutes
  minRestBetweenShifts: 11, // hours
  maxConsecutiveDays: 6,
  overtimeThreshold: 8, // hours
  permissions: {
    create: ['admin', 'payroll_manager'],
    edit: ['admin', 'payroll_manager'],
    delete: ['admin']
  }
};

export const attendanceConfig = {
  statuses: {
    present: { label: 'Present', color: '#10b981' },
    absent: { label: 'Absent', color: '#ef4444' },
    late: { label: 'Late', color: '#f59e0b' },
    earlyLeave: { label: 'Early Leave', color: '#f59e0b' },
    halfDay: { label: 'Half Day', color: '#6366f1' }
  },
  lateThreshold: 15, // minutes
  earlyLeaveThreshold: 15, // minutes
  halfDayThreshold: 4, // hours
  graceTime: 5 // minutes
};

export const salaryConfig = {
  paymentFrequency: 'monthly',
  paymentDay: 25, // day of month
  currency: 'USD',
  components: {
    basic: { label: 'Basic Salary', type: 'fixed' },
    overtime: { label: 'Overtime', type: 'variable' },
    bonus: { label: 'Bonus', type: 'variable' },
    allowance: { label: 'Allowance', type: 'fixed' },
    deductions: { label: 'Deductions', type: 'variable' }
  },
  deductions: {
    tax: { label: 'Tax', rate: 0.2 },
    socialSecurity: { label: 'Social Security', rate: 0.045 },
    healthInsurance: { label: 'Health Insurance', rate: 0.015 }
  }
};

export const permissionConfig = {
  roles: {
    payrollAdmin: {
      label: 'Payroll Administrator',
      permissions: [
        'view_schedules',
        'manage_schedules',
        'view_attendance',
        'manage_attendance',
        'view_salary',
        'manage_salary',
        'view_reports',
        'manage_reports'
      ]
    },
    payrollManager: {
      label: 'Payroll Manager',
      permissions: [
        'view_schedules',
        'manage_schedules',
        'view_attendance',
        'view_salary',
        'manage_salary',
        'view_reports'
      ]
    },
    payrollClerk: {
      label: 'Payroll Clerk',
      permissions: [
        'view_schedules',
        'view_attendance',
        'view_salary',
        'view_reports'
      ]
    }
  }
};

export const reportConfig = {
  types: {
    attendance: {
      label: 'Attendance Report',
      metrics: ['present', 'absent', 'late', 'earlyLeave'],
      period: ['daily', 'weekly', 'monthly']
    },
    salary: {
      label: 'Salary Report',
      metrics: ['basic', 'overtime', 'bonus', 'deductions', 'net'],
      period: ['monthly', 'quarterly', 'yearly']
    },
    schedule: {
      label: 'Schedule Report',
      metrics: ['shifts', 'hours', 'overtime'],
      period: ['weekly', 'monthly']
    }
  },
  exportFormats: ['pdf', 'excel', 'csv']
};
