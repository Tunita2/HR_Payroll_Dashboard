import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { payrollConstants } from "../components/Payroll/PayrollConfig";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Date formatting utilities
export const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatTime = (time) => {
  if (!time) return "";
  return new Date(`2000-01-01T${time}`).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

export const formatDateTime = (dateTime) => {
  if (!dateTime) return "";
  const date = new Date(dateTime);
  return `${formatDate(date)} ${formatTime(date.toTimeString().slice(0, 5))}`;
};

export const getWeekDays = (date) => {
  const result = [];
  const curr = new Date(date);
  curr.setDate(curr.getDate() - curr.getDay()); // Get Sunday

  for (let i = 0; i < 7; i++) {
    const day = new Date(curr);
    day.setDate(curr.getDate() + i);
    result.push(day);
  }

  return result;
};

// Currency formatting
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

// Number formatting
export const formatNumber = (number, decimals = 2) => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(number);
};

// Percentage formatting
export const formatPercentage = (value, decimals = 1) => {
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100);
};

// Time calculations
export const calculateWorkHours = (checkIn, checkOut) => {
  const [checkInHour, checkInMinute] = checkIn.split(":").map(Number);
  const [checkOutHour, checkOutMinute] = checkOut.split(":").map(Number);

  let hours = checkOutHour - checkInHour;
  let minutes = checkOutMinute - checkInMinute;

  if (minutes < 0) {
    hours -= 1;
    minutes += 60;
  }

  return hours + minutes / 60;
};

export const calculateOvertime = (scheduledHours, actualHours) => {
  return Math.max(0, actualHours - scheduledHours);
};

export const calculateDuration = (start, end) => {
  if (!start || !end) return 0;

  const startTime = new Date(`2000-01-01T${start}`);
  const endTime = new Date(`2000-01-01T${end}`);

  return (endTime - startTime) / (1000 * 60 * 60); // Convert to hours
};

// Salary calculations
export const calculateGrossSalary = (baseSalary, overtime = 0, bonus = 0) => {
  const overtimePay =
    overtime *
    (baseSalary / payrollConstants.WORKING_DAYS_PER_MONTH / 8) *
    payrollConstants.OVERTIME_RATE;
  return baseSalary + overtimePay + bonus;
};

export const calculateDeductions = (grossSalary) => {
  const tax = grossSalary * payrollConstants.TAX_RATE;
  const socialSecurity = grossSalary * payrollConstants.SOCIAL_SECURITY_RATE;
  const healthInsurance = grossSalary * payrollConstants.HEALTH_INSURANCE_RATE;

  return {
    tax,
    socialSecurity,
    healthInsurance,
    total: tax + socialSecurity + healthInsurance,
  };
};

export const calculateNetSalary = (grossSalary, deductions) => {
  return grossSalary - deductions.total;
};

// Array utilities
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const groupKey = typeof key === "function" ? key(item) : item[key];
    (result[groupKey] = result[groupKey] || []).push(item);
    return result;
  }, {});
};

export const sumBy = (array, key) => {
  return array.reduce(
    (sum, item) => sum + (typeof key === "function" ? key(item) : item[key]),
    0
  );
};

export const averageBy = (array, key) => {
  return array.length ? sumBy(array, key) / array.length : 0;
};

// Status color mapping
export const getStatusColor = (status, theme) => {
  const statusColors = {
    active: theme.colors.success,
    inactive: theme.colors.error,
    pending: theme.colors.warning,
    approved: theme.colors.success,
    rejected: theme.colors.error,
    processing: theme.colors.info,
  };

  return statusColors[status.toLowerCase()] || theme.colors.secondary;
};

// Input validation
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidDate = (dateString) => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
};

export const isValidTime = (timeString) => {
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(timeString);
};

// Data transformation
export const transformForChart = (data, labelKey, valueKey) => {
  return data.map((item) => ({
    label: item[labelKey],
    value: item[valueKey],
  }));
};

// File handling
export const downloadCSV = (data, filename) => {
  const csvContent =
    "data:text/csv;charset=utf-8," +
    data.map((row) => Object.values(row).join(",")).join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Error handling
export class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = "ApiError";
  }
}

export const handleError = (error) => {
  console.error("Error:", error);
  return {
    message: error.message || "An unexpected error occurred",
    code: error.code || "UNKNOWN_ERROR",
    details: error.details || null,
  };
};

// Search and filter helpers
export const filterBySearchTerm = (items, searchTerm, fields) => {
  if (!searchTerm) return items;

  const term = searchTerm.toLowerCase();
  return items.filter((item) =>
    fields.some((field) =>
      String(item[field] || "")
        .toLowerCase()
        .includes(term)
    )
  );
};

export const sortByField = (items, field, direction = "asc") => {
  return [...items].sort((a, b) => {
    const aValue = a[field];
    const bValue = b[field];

    if (typeof aValue === "string") {
      return direction === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return direction === "asc" ? aValue - bValue : bValue - aValue;
  });
};

// Data transformation helpers
export const calculateSummaryStatistics = (items, numberFields) => {
  return numberFields.reduce((stats, field) => {
    const values = items.map((item) => Number(item[field]) || 0);
    stats[field] = {
      total: values.reduce((sum, val) => sum + val, 0),
      average: values.reduce((sum, val) => sum + val, 0) / values.length,
      min: Math.min(...values),
      max: Math.max(...values),
    };
    return stats;
  }, {});
};

// Form validation helpers
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validatePhone = (phone) => {
  const regex = /^\+?[\d\s-]{10,}$/;
  return regex.test(phone);
};

export const validateRequired = (value) => {
  return value !== null && value !== undefined && value !== "";
};
