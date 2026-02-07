const express = require("express");
const router = express.Router();
const CV = require("../models/CV");
const upload = require("../middleware/uploadMiddleware");
const { protect, workerOnly } = require("../middleware/authMiddleware");

// Upload or replace CV
router.post(
  "/",
  protect,
  workerOnly,
  upload.single("cv"),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    let cv = await CV.findOne({ user: req.user._id });

    if (cv) {
      cv.cvUrl = req.file.path;
      await cv.save();
      return res.json(cv);
    }

    cv = await CV.create({
      user: req.user._id,
      cvUrl: req.file.path,
    });

    res.json(cv);
  }
);

// Get own CV
router.get("/me", protect, workerOnly, async (req, res) => {
  const cv = await CV.findOne({ user: req.user._id });
  res.json(cv);
});

module.exports = router;
