const mongoose = require("mongoose");

const cvSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    profession: String,
    cvUrl: String,
  },
  { timestamps: true }
);

module.exports = mongoose.models.CV || mongoose.model("CV", cvSchema);