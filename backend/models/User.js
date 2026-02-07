const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, sparse: true }, // allow null for admin ID login
  password: String,
  role: {
    type: String,
    enum: ["admin", "worker", "company"],
    default: "worker",
  },
  adminId: { type: String, unique: true, sparse: true }, // 12-digit admin ID
  googleAuth: { type: Boolean, default: false },
});

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
