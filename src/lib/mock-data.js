import { NotificationType } from "./types";

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

// List of employee names
const employees = [
  "John Smith",
  "Emma Johnson",
  "Michael Williams",
  "Sophia Brown",
  "William Jones",
  "Olivia Davis",
  "James Miller",
  "Ava Wilson",
  "Alexander Moore",
  "Isabella Taylor",
  "Benjamin Anderson",
  "Mia Thomas",
  "Ethan Jackson",
  "Charlotte White",
  "Daniel Harris",
];

// Generate mock notifications
export const mockNotifications = [
  // Work Anniversary Notifications
  ...Array(5)
    .fill(null)
    .map((_, index) => {
      const employeeName = employees[index];
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
      const employeeName = employees[index + 5];
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
      const employeeName = employees[index + 9];
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
      const employeeName = employees[index];
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
