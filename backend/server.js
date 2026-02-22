const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");
const { errorHandler } = require("./middleware/errorMiddleware");

dotenv.config();

const app = express();

/* ✅ JSON */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ✅ CORS: allow both frontend + admin */
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",

  // ✅ তোমার Admin panel domain (screenshot)
  "https://job-portal-g1rn-75qxn8x37-shuvos-projects-cf52e1e3.vercel.app",

  // ✅ তোমার Main frontend domain (Kaj Kormo) — এটা domain ঠিকটা বসাও
  "https://job-portal-g1rn-2rcxsanvu-shuvos-projects-cf52e1e3.vercel.app",
];

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      if (allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error("CORS blocked: " + origin));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.options("*", cors());

/* ✅ Static */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ✅ Health */
app.get("/", async (req, res) => {
  res.json({
    message: "Job Portal Backend is LIVE! 🚀",
    ok: true,
    time: new Date().toISOString(),
  });
});

/* ✅ Routes */
app.use("/api/auth", require("./routes/auth"));
app.use("/api/jobs", require("./routes/jobs"));
app.use("/api/applications", require("./routes/applications"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/users", require("./routes/users"));
app.use("/api/cv", require("./routes/cvRoutes"));
app.use("/api/company", require("./routes/company"));
app.use("/api/notifications", require("./routes/notifications"));

/* ✅ Error handler */
app.use(errorHandler);

/* ✅ Connect DB once per cold start (serverless safe) */
connectDB()
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection failed:", err));

/* ✅ IMPORTANT: Vercel serverless => do NOT app.listen() */
module.exports = app;