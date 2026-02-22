const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const { errorHandler } = require("./middleware/errorMiddleware");

dotenv.config();
connectDB();

const app = express();

// Enable CORS for allowed origins (local dev and live frontend)
app.use(
  cors({
    origin: [
      "http://localhost:5173",          // Local Vite dev server
      "http://localhost:5174",          // Alternative local port if used
      "http://localhost:3000",          // Common local frontend port
      "https://jop-portal-8ibjnntp7-shuvos-projects-cf52e1e3.vercel.app",  // Live frontend URL
      "*"                               // Allow all origins temporarily (remove in production for security)
    ],
    credentials: true,                  // Allow cookies/credentials
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],  // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"]      // Allowed request headers
  })
);

// Handle OPTIONS preflight requests explicitly (this fixes 500 error on OPTIONS requests)
app.options("*", cors());

app.use(express.json());

// Serve static files from uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Root route - simple health check / welcome message
app.get('/', (req, res) => {
  res.json({
    message: "Job Portal Backend is LIVE! 🚀",
    status: "running",
    version: "1.0.0"
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

// Global error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));