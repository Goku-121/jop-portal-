// backend/routes/applications.js
const express = require("express");
const router = express.Router();

const { protect, workerOnly } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const Application = require("../models/Application");

router.post("/", protect, workerOnly, upload.single("cv"), async (req, res) => {
  try {
    const { jobId } = req.body;

    if (!jobId) return res.status(400).json({ message: "jobId required" });
    if (!req.file) return res.status(400).json({ message: "CV file required (field name: cv)" });

    // ✅ duplicate prevent (extra safety even with unique index)
    const exists = await Application.findOne({ job: jobId, applicant: req.user._id });
    if (exists) return res.status(400).json({ message: "You already applied to this job." });

    const app = await Application.create({
      job: jobId,
      applicant: req.user._id,
      cvUrl: `/uploads/${req.file.filename}`,
      status: "pending",
    });

    return res.status(201).json(app);
  } catch (err) {
    // unique index error fallback
    if (err.code === 11000) {
      return res.status(400).json({ message: "You already applied to this job." });
    }
    return res.status(500).json({ message: err.message });
  }
});

router.get("/", protect, workerOnly, async (req, res) => {
  try {
    const apps = await Application.find({ applicant: req.user._id })
      .populate("job")
      .sort({ createdAt: -1 });

    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
