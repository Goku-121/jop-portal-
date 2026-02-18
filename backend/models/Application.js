// backend/models/Application.js
const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true, index: true },
    applicant: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },

    cvUrl: { type: String, required: true },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
      index: true,
    },
  },
  { timestamps: true }
);

// ✅ Prevent duplicate apply: same applicant cannot apply same job twice
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

module.exports =
  mongoose.models.Application || mongoose.model("Application", applicationSchema);
