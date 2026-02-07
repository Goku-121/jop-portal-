const mongoose = require("mongoose");

const cvSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  profession: String,
  cvUrl: String,
});

module.exports = mongoose.model("CV", cvSchema);
