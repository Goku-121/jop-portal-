const Application = require("../models/Application");

// Apply to job
exports.applyJob = async (req, res, next) => {
  try {
    const app = await Application.create({
      job: req.body.jobId,
      user: req.user.id,
      cvUrl: req.file.path,
    });
    res.json(app);
  } catch (err) {
    next(err);
  }
};

// Get own applications
exports.getMyApplications = async (req, res, next) => {
  try {
    const apps = await Application.find({ user: req.user.id }).populate("job");
    res.json(apps);
  } catch (err) {
    next(err);
  }
};
