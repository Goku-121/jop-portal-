const express = require("express");
const { protect, workerOnly } = require("../middleware/authMiddleware");
const Application = require("../models/Application");
const multer = require("multer");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Worker applies
router.post("/", protect, workerOnly, upload.single("cv"), async (req, res) => {
  const app = await Application.create({
    job: req.body.jobId,
    user: req.user.id,
    cvUrl: req.file.path,
  });
  res.json(app);
});

// Worker views own applications
router.get("/", protect, workerOnly, async (req, res) => {
  const apps = await Application.find({ user: req.user.id }).populate("job");
  res.json(apps);
});

module.exports = router;
