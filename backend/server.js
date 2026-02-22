const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");
const { errorHandler } = require("./middleware/errorMiddleware");

dotenv.config();

const app = express();

/* Body parsers */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ✅ CORS (Vercel-safe, JWT header based) */
const corsOptions = {
  origin: true, // temporary allow all origins
  credentials: false, // ✅ IMPORTANT: you are NOT using cookies, only Authorization header
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions)); // ✅ FIX: don't use "*"

/* Static */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* Routes */
app.get("/", (req, res) => {
  res.json({
    ok: true,
    message: "Backend running",
    time: new Date().toISOString(),
  });
});

app.use("/api/auth", require("./routes/auth"));
app.use("/api/jobs", require("./routes/jobs"));
app.use("/api/applications", require("./routes/applications"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/users", require("./routes/users"));
app.use("/api/cv", require("./routes/cvRoutes"));
app.use("/api/company", require("./routes/company"));
app.use("/api/notifications", require("./routes/notifications"));

/* Error handler */
app.use(errorHandler);

/* ✅ Connect DB (don’t crash serverless cold start) */
connectDB().catch((err) => console.error("MongoDB connection failed:", err));

/* ✅ IMPORTANT: no app.listen() on Vercel */
module.exports = app;