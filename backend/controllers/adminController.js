const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Get all admins
exports.getAllAdmins = async (req, res, next) => {
  try {
    const admins = await User.find({ role: "admin" }).select("-password");
    res.json(admins);
  } catch (err) {
    next(err);
  }
};

// Add new admin
exports.addAdmin = async (req, res, next) => {
  const { name, email, password, adminId } = req.body;

  try {
    if (!name || !email || !password || !adminId)
      return res.status(400).json({ message: "All fields are required" });

    if (!/^\d{12}$/.test(adminId))
      return res.status(400).json({ message: "Admin ID must be 12 digits" });

    const exists = await User.findOne({ $or: [{ email }, { adminId }] });
    if (exists) return res.status(400).json({ message: "Email or Admin ID already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const admin = await User.create({ name, email, password: hashed, role: "admin", adminId });

    res.status(201).json({ message: "Admin added successfully", admin });
  } catch (err) {
    next(err);
  }
};

// Delete admin
exports.deleteAdmin = async (req, res, next) => {
  try {
    const admin = await User.findById(req.params.id);
    if (!admin || admin.role !== "admin")
      return res.status(404).json({ message: "Admin not found" });

    await admin.remove();
    res.json({ message: "Admin deleted successfully" });
  } catch (err) {
    next(err);
  }
};
