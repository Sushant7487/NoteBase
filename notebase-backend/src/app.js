//src/app.js

const express = require("express");
const dotenv = require("dotenv");
const ConnectDB = require("./config/Database");
const cors = require("cors"); // ⭐️ CORS import

// Routes
const userRoutes = require("./routes/userRoutes");
const noteRoutes = require("./routes/noteRoutes");
const tenantRoutes = require("./routes/tenantRoutes");
const authRoutes = require("./routes/authRoutes");

dotenv.config();
const app = express();

// ⭐️ CORS Middleware
app.use(
  cors({
    origin: ["http://localhost:5173"], // frontend ka origin (Vite default port)
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

// Health Check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/tenants", tenantRoutes);

// Database + Server
ConnectDB()
  .then(() => {
    console.log("Database Connection is Established Successfully");
    app.listen(process.env.PORT || 5000, () => {
      console.log(`✅ Server is Successfully Running on Port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => {
    console.error("❌ DB Connection Error:", err);
  });


module.exports = app;
