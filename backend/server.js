const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const { errorHandler } = require("./middleware/errorMiddleware"); // optional

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", require("./routes/auth"));           // auth.js
app.use("/api/jobs", require("./routes/jobs"));           // jobs.js
app.use("/api/applications", require("./routes/applications")); // applications.js
app.use("/api/admin", require("./routes/admin"));         // admin.js
app.use("/api/users", require("./routes/users"));         // users.js
app.use("/api/cv", require("./routes/cvRoutes"));         // cvRoutes.js

// Error Handler (optional)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
