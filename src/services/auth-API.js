const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { conn, sql } = require("./sqlServerConfig");

const JWT_SECRET = "your_jwt_secret_key_here";

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    const pool = await conn;

    console.log('Login attempt:', { username });

    const result = await pool.request()
      .input("username", sql.VarChar, username)
      .query(`
        SELECT a.AccountID, a.Username, a.PasswordHash, a.EmployeeID, a.Role
        FROM Accounts a
        WHERE a.Username = @username
      `);

    console.log('Query result:', result.recordset);

    const user = result.recordset[0];

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    let isPasswordValid = false;

    if (user.PasswordHash.startsWith('$2a$')) {
      isPasswordValid = await bcrypt.compare(password, user.PasswordHash);
    } else {
      isPasswordValid = user.PasswordHash === password;
    }

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        userId: user.AccountID,
        employeeId: user.EmployeeID,
        role: user.Role
      },
      JWT_SECRET,
      { expiresIn: "8h" }
    );

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

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1]; 

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

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
