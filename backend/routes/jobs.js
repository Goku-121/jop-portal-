const express = require("express");
const Job = require("../models/Job");
const { protect, companyOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// Company posts job
router.post("/", protect, companyOnly, async (req, res) => {
  try {
    const job = await Job.create({ ...req.body, postedBy: req.user._id });
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get jobs list with filter + pagination
router.get("/", async (req, res) => {
  try {
    const q = (req.query.q || "").trim();
    const location = (req.query.location || "").trim();

    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || "12", 10), 1), 100);
    const skip = (page - 1) * limit;

    const filter = {};
    if (q) filter.title = { $regex: q, $options: "i" };
    if (location) filter.location = { $regex: location, $options: "i" };

    const [items, total] = await Promise.all([
      Job.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Job.countDocuments(filter),
    ]);

    res.json({
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single job by id
router.get("/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate("postedBy", "name email role");
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (err) {
    res.status(400).json({ message: "Invalid job id" });
  }
});

module.exports = router;
