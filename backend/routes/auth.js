const express = require("express");
const router = express.Router();
const { registerUser, loginUser, registerAdmin } = require("../controllers/authController");

// Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/admin-register", registerAdmin);

module.exports = router;
