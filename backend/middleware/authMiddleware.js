// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

exports.roleCheck = (role) => (req, res, next) => {
  if (req.user.role !== role)
    return res.status(403).json({ message: `${role} only access` });
  next();
};

exports.adminOnly = exports.roleCheck("admin");
exports.workerOnly = exports.roleCheck("worker");
exports.companyOnly = exports.roleCheck("company");
