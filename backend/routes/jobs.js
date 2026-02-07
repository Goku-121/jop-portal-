const express = require("express");
const Job = require("../models/Job");
const { protect, companyOnly } = require("../middleware/authMiddleware");
const router = express.Router();

// Company posts job
router.post("/", protect, companyOnly, async (req, res) => {
  const job = await Job.create({ ...req.body, postedBy: req.user.id });
  res.json(job);
});

// Anyone can view jobs
router.get("/", async (_, res) => {
  const jobs = await Job.find();
  res.json(jobs);
});

module.exports = router;
