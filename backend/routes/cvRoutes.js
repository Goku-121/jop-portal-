const express = require("express");
const router = express.Router();
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

const upload = require("../middleware/uploadMiddleware");
const { protect } = require("../middleware/authMiddleware");
const User = require("../models/User");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

router.get("/me", protect, async (req, res) => {
  const me = await User.findById(req.user._id).select("cvUrl");
  res.json({ cvUrl: me?.cvUrl || null });
});

router.post("/", protect, upload.single("cv"), async (req, res) => {
  try {
    if (!req.file?.buffer) return res.status(400).json({ message: "No file upload" });

    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "jobportal_cvs", resource_type: "raw" },
      async (error, result) => {
        if (error) return res.status(500).json({ message: error.message || "Cloudinary upload failed" });

        await User.findByIdAndUpdate(req.user._id, { cvUrl: result.secure_url });
        return res.json({ cvUrl: result.secure_url });
      }
    );

    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
  } catch (err) {
    res.status(500).json({ message: err.message || "CV upload failed" });
  }
});

module.exports = router;