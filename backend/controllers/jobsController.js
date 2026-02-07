const Job = require("../models/Job");

// Company posts job
exports.createJob = async (req, res, next) => {
  try {
    const job = await Job.create({ ...req.body, postedBy: req.user.id });
    res.json(job);
  } catch (err) {
    next(err);
  }
};

// Get all jobs
exports.getJobs = async (_, res, next) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (err) {
    next(err);
  }
};
