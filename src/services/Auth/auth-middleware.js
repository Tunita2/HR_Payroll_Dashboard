const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// JWT Secret Key - in a production environment, this should be stored in environment variables
const JWT_SECRET = "123456";

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

// Role-based authorization middleware
const authorize = (roles = []) => {
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return [
    verifyToken,
    (req, res, next) => {
      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({ error: "Access forbidden. Insufficient permissions." });
      }
      next();
    }
  ];
};

module.exports = {
  verifyToken,
  authorize
};
