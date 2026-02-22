const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const { errorHandler } = require("./middleware/errorMiddleware");

dotenv.config();

// Log environment variables for debugging (remove sensitive info in production)
console.log("MONGO_URI:", process.env.MONGO_URI ? "Set" : "Not set");
console.log("JWT_SECRET:", process.env.JWT_SECRET ? "Set" : "Not set");
console.log("FRONTEND_URL:", process.env.FRONTEND_URL || "Not set");

connectDB().catch((err) => {
  console.error("MongoDB connection failed:", err.message);
  process.exit(1); // Exit if DB connection fails
});

const app = express();

// CORS configuration - allow your frontend, local dev, and temporarily all origins
app.use(
  cors({
    origin: [
      "http://localhost:5173",          // Local Vite dev server
      "http://localhost:5174",          // Alternative local port
      "http://localhost:3000",          // Other local frontend ports
      "https://jop-portal-8ibjnntp7-shuvos-projects-cf52e1e3.vercel.app",  // Your live frontend URL
      "*"                               // Allow all for testing (remove in production)
    ],
    credentials: true,                  // Allow cookies, auth headers
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],  // All needed methods
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    exposedHeaders: ["Content-Length", "X-Content-Type-Options"],
    optionsSuccessStatus: 204           // For legacy browsers
  })
);

// Handle OPTIONS preflight requests explicitly (fixes 500 on OPTIONS)
app.options("*", cors());

// Parse JSON bodies
app.use(express.json());

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Root route - health check / welcome
app.get("/", (req, res) => {
  res.json({
    message: "Job Portal Backend is LIVE! 🚀",
    status: "running",
    version: "1.0.0",
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/jobs", require("./routes/jobs"));
app.use("/api/applications", require("./routes/applications"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/users", require("./routes/users"));
app.use("/api/cv", require("./routes/cvRoutes"));
app.use("/api/company", require("./routes/company"));
app.use("/api/notifications", require("./routes/notifications"));

// Global error handler - must be last
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});