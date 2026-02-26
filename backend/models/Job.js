const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    location: String,
    salary: String,

    imageUrl: { type: String, default: "" }, 

    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Job || mongoose.model("Job", jobSchema);