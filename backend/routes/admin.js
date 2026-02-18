const express = require("express");
const router = express.Router();

const { protect, adminOnly } = require("../middleware/authMiddleware");
const User = require("../models/User");
const Job = require("../models/Job");
const Application = require("../models/Application");
const bcrypt = require("bcryptjs");

// Admin: list users
router.get("/users", protect, adminOnly, async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

// Admin: list jobs
router.get("/jobs", protect, adminOnly, async (req, res) => {
  const jobs = await Job.find().populate("postedBy", "name email role");
  res.json(jobs);
});

// Admin: list applications
router.get("/applications", protect, adminOnly, async (req, res) => {
  const apps = await Application.find()
    .populate("job")
    .populate("applicant", "name email role");
  res.json(apps);
});

// Admins list (optional)
router.get("/all", protect, adminOnly, async (req, res) => {
  const admins = await User.find({ role: "admin" }).select("-password");
  res.json(admins);
});


// Admin delete user
router.delete("/users/:id", protect, adminOnly, async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  await user.deleteOne();
  res.json({ message: "User deleted" });
});



// Admin delete job
router.delete("/jobs/:id", protect, adminOnly, async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) return res.status(404).json({ message: "Job not found" });

  await job.deleteOne();

  // also delete related applications
  await Application.deleteMany({ job: job._id });

  res.json({ message: "Job deleted" });
});
// Admin delete application
router.delete("/applications/:id", protect, adminOnly, async (req, res) => {
  const app = await Application.findById(req.params.id);
  if (!app) return res.status(404).json({ message: "Application not found" });

  await app.deleteOne();
  res.json({ message: "Application deleted" });
});

// Admin update application status
router.patch("/applications/:id/status", protect, adminOnly, async (req, res) => {
  const { status } = req.body;

  if (!["accepted", "rejected", "pending"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const app = await Application.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );

  res.json(app);
});
// Add admin (optional)
router.post("/add", protect, adminOnly, async (req, res) => {
  const { name, email, password, adminId } = req.body;

  if (!name || !email || !password || !adminId)
    return res.status(400).json({ message: "All fields are required" });

  if (!/^\d{12}$/.test(adminId))
    return res.status(400).json({ message: "Admin ID must be 12 digits" });

  const exists = await User.findOne({ $or: [{ email }, { adminId }] });
  if (exists) return res.status(400).json({ message: "Email or Admin ID already exists" });

  const hashed = await bcrypt.hash(password, 10);
  const admin = await User.create({ name, email, password: hashed, role: "admin", adminId });

  res.status(201).json({ message: "Admin added successfully", admin });
});

module.exports = router;
