// src/routes/tenantRoutes.js
const express = require("express");
const { getTenants, upgradeTenant } = require("../controllers/tenantController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// Public: List tenants
router.get("/", getTenants);

// Protected: Upgrade tenant (Admin only)
router.post("/:slug/upgrade", protect, upgradeTenant);

module.exports = router;
