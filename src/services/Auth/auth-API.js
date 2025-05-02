const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { conn, sql } = require("../config/mssql");

// JWT Secret Key - in a production environment, this should be stored in environment variables
const JWT_SECRET = "123456";

// Login endpoint
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    // Connect to SQL Server
    const pool = await conn;

    // Query to find the user by username
    const result = await pool.request()
      .input("username", sql.VarChar, username)
      .query(`
        SELECT a.AccountID, a.Username, a.PasswordHash, a.EmployeeID, a.Role
        FROM Accounts a
        WHERE a.Username = @username
      `);

    const user = result.recordset[0];

    // Check if user exists
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Compare passwords
    // Check if the password is already hashed (starts with $2a$ for bcryptjs)
    let isPasswordValid = false;

    if (user.PasswordHash.startsWith('$2a$')) {
      // For properly hashed passwords, use bcrypt.compare
      isPasswordValid = await bcrypt.compare(password, user.PasswordHash);
    } else {
      // For plain text passwords (during development/testing)
      isPasswordValid = user.PasswordHash === password;
    }

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.AccountID,
        employeeId: user.EmployeeID,
        role: user.Role
      },
      JWT_SECRET,
      { expiresIn: "8h" }
    );

    // Return success response with token
    res.json({
      message: "Login successful",
      token,
      employeeId: user.EmployeeID,
      role: user.Role
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1]; // Bearer TOKEN format

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// Protected route example
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const pool = await conn;

    const result = await pool.request()
      .input("employeeId", sql.Int, req.user.employeeId)
      .query(`
        SELECT e.EmployeeID, e.FullName, e.Email, e.PhoneNumber,
               d.DepartmentName, p.PositionName, e.Status
        FROM Employees e
        JOIN Departments d ON e.DepartmentID = d.DepartmentID
        JOIN Positions p ON e.PositionID = p.PositionID
        WHERE e.EmployeeID = @employeeId
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.json(result.recordset[0]);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = {
  router,
  verifyToken
};
