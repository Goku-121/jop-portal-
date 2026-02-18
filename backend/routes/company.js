const express = require("express");
const router = express.Router();

const { protect, companyOnly } = require("../middleware/authMiddleware");
const Application = require("../models/Application");
const Job = require("../models/Job");
const Notification = require("../models/Notification"); // ✅ must exist

// ✅ Company নিজের jobs এর applications দেখবে
router.get("/applications", protect, companyOnly, async (req, res) => {
  try {
    const myJobs = await Job.find({ postedBy: req.user._id }).select("_id");
    const jobIds = myJobs.map((j) => j._id);

    const apps = await Application.find({ job: { $in: jobIds } })
      .populate("job", "title")
      .populate("applicant", "name email")
      .sort({ createdAt: -1 });

    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Company accept/reject করবে (pending হলে একবারই)
router.patch("/applications/:id/status", protect, companyOnly, async (req, res) => {
  try {
    const { status } = req.body;

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Status must be accepted or rejected" });
    }

    const app = await Application.findById(req.params.id).populate("job");
    if (!app) return res.status(404).json({ message: "Application not found" });

    // ✅ security: application টা company job এর কিনা
    if (!app.job?.postedBy) return res.status(400).json({ message: "Job missing" });

    if (String(app.job.postedBy) !== String(req.user._id)) {
      return res.status(403).json({ message: "Not allowed (not your job application)" });
    }

    // ✅ lock rule (pending না হলে আর change করা যাবে না)
    if (app.status !== "pending") {
      return res.status(400).json({ message: "Status locked already" });
    }

    app.status = status;
    await app.save();

    // ✅ create notification for worker
    await Notification.create({
      user: app.applicant,
      title: status === "accepted" ? "Accepted ✅" : "Rejected ❌",
      message:
        status === "accepted"
          ? `You are accepted for "${app.job.title}". Company will contact you soon.`
          : `Your application for "${app.job.title}" was rejected. Try next time!`,
      type: status,
      isRead: false,
    });

    res.json({ message: "Status updated", app });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
