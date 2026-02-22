// backend/routes/applications.js
const express = require("express");
const router = express.Router();
const streamifier = require("streamifier");
const cloudinary = require("cloudinary").v2;

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
    if (!req.file) return res.status(400).json({ message: "CV file required (field name: cv)" });

    // prevent duplicate apply
    const exists = await Application.findOne({ job: jobId, applicant: req.user._id });
    if (exists) return res.status(400).json({ message: "You already applied to this job." });

    // upload to cloudinary (buffer -> stream)
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: "auto", folder: "jobportal_cvs" },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );

      streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
    });

    const app = await Application.create({
      job: jobId,
      applicant: req.user._id,
      cvUrl: uploadResult.secure_url, // ✅ full url
      status: "pending",
    });

    return res.status(201).json(app);
  } catch (err) {
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