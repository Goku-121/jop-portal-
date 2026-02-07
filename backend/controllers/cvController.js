const CV = require("../models/CV");

// Upload or replace CV
exports.uploadCV = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    let cv = await CV.findOne({ user: req.user._id });

    if (cv) {
      cv.cvUrl = req.file.path;
      await cv.save();
      return res.json(cv);
    }

    cv = await CV.create({ user: req.user._id, cvUrl: req.file.path });
    res.json(cv);
  } catch (err) {
    next(err);
  }
};

// Get own CV
exports.getMyCV = async (req, res, next) => {
  try {
    const cv = await CV.findOne({ user: req.user._id });
    res.json(cv);
  } catch (err) {
    next(err);
  }
};
