const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Worker / Company registration
exports.registerUser = async (req, res, next) => {
  const { name, email, password, role } = req.body;

  try {
    if (!name || !email || !password || !role)
      return res.status(400).json({ message: "All fields are required" });

    if (role === "admin")
      return res.status(403).json({ message: "Cannot register as admin here" });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, role });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.status(201).json({ _id: user._id, name, email, role, token });
  } catch (err) {
    next(err);
  }
};

// Admin registration
exports.registerAdmin = async (req, res, next) => {
  const { name, email, password, confirmPassword, adminId } = req.body;

  try {
    if (!name || !email || !password || !confirmPassword || !adminId)
      return res.status(400).json({ message: "All fields are required" });

    if (password !== confirmPassword)
      return res.status(400).json({ message: "Passwords do not match" });

    if (!/^\d{12}$/.test(adminId))
      return res.status(400).json({ message: "Admin ID must be 12 digits" });

    const exists = await User.findOne({ $or: [{ email }, { adminId }] });
    if (exists) return res.status(400).json({ message: "Email or Admin ID already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, role: "admin", adminId });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.status(201).json({ _id: user._id, name, email, role: user.role, adminId, token });
  } catch (err) {
    next(err);
  }
};

// Login (email or adminId)
exports.loginUser = async (req, res, next) => {
  const { identifier, password } = req.body;

  try {
    const user = await User.findOne({ $or: [{ email: identifier }, { adminId: identifier }] });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      adminId: user.adminId,
      token,
    });
  } catch (err) {
    next(err);
  }
};
