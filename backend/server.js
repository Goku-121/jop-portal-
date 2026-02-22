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

/* CORS */
app.use(
  cors({
    origin: true, // temporary allow all origins (for testing)
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.options("*", cors());

/* Static */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* Routes */
app.get("/", (req, res) => {
  res.json({ ok: true, message: "Backend running", time: new Date().toISOString() });
});

app.use("/api/auth", require("./routes/auth"));
app.use("/api/jobs", require("./routes/jobs"));
app.use("/api/applications", require("./routes/applications"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/users", require("./routes/users"));
app.use("/api/cv", require("./routes/cvRoutes"));
app.use("/api/company", require("./routes/company"));
app.use("/api/notifications", require("./routes/notifications"));

app.use(errorHandler);

/* ✅ Connect DB (don’t crash serverless) */
connectDB().catch((err) => console.error("MongoDB connection failed:", err));

/* ✅ IMPORTANT: no app.listen() on Vercel */
module.exports = app;