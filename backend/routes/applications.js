const express = require("express");
const router = express.Router();
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

const { protect, workerOnly } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const Application = require("../models/Application");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

router.post("/", protect, workerOnly, upload.single("cv"), async (req, res) => {
  try {
    const { jobId } = req.body;
    if (!jobId) return res.status(400).json({ message: "jobId required" });
    if (!req.file?.buffer) return res.status(400).json({ message: "CV file required (field name: cv)" });

    const exists = await Application.findOne({ job: jobId, applicant: req.user._id });
    if (exists) return res.status(400).json({ message: "You already applied to this job." });

    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "jobportal_cvs", resource_type: "raw" },
      async (error, result) => {
        if (error) return res.status(500).json({ message: error.message || "Cloudinary upload failed" });

        const app = await Application.create({
          job: jobId,
          applicant: req.user._id,
          cvUrl: result.secure_url,
          status: "pending",
        });

        return res.status(201).json(app);
      }
    );

    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: "You already applied to this job." });
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