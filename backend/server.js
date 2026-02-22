const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const { errorHandler } = require("./middleware/errorMiddleware");

dotenv.config();

// Debug env
console.log("MONGO_URI:", process.env.MONGO_URI ? "Set" : "Not set");
console.log("JWT_SECRET:", process.env.JWT_SECRET ? "Set" : "Not set");
console.log("PORT:", process.env.PORT || 5000);

// Connect DB
connectDB()
  .then(() => console.log("MongoDB connected successfully"))
  .catch(err => {
    console.error("MongoDB connection failed:", err.message || err);
    process.exit(1);
  });

const app = express();

// CORS configuration for development and production
app.use(cors({
  origin: true,                     
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204
}));

app.use(express.json());

// Static uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Root route 
app.get("/", (req, res) => {
  res.json({
    message: "Job Portal Backend is LIVE! 🚀",
    status: "running",
    version: "1.0.0",
    timestamp: new Date().toISOString()
  });
});

// All routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/jobs", require("./routes/jobs"));
app.use("/api/applications", require("./routes/applications"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/users", require("./routes/users"));
app.use("/api/cv", require("./routes/cvRoutes"));
app.use("/api/company", require("./routes/company"));
app.use("/api/notifications", require("./routes/notifications"));

// Error handler 
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});