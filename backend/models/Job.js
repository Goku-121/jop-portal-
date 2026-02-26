const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true },
    description: { type: String, trim: true },
    location: { type: String, trim: true },
    salary: { type: String, trim: true },

    
    imageUrl: { type: String, default: "" },

    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Job || mongoose.model("Job", jobSchema);