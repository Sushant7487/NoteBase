// src/controllers/tenantController.js
const Tenant = require("../models/tenant");

// Helper to return tenant with capitalized plan for frontend consistency
function normalizeTenant(t) {
  if (!t) return t;
  const obj = t.toObject ? t.toObject() : { ...t };
  if (obj.plan && typeof obj.plan === "string") {
    obj.plan = obj.plan.charAt(0).toUpperCase() + obj.plan.slice(1).toLowerCase(); // "free" -> "Free", "pro" -> "Pro"
  }
  return obj;
}

// GET /api/tenants
const getTenants = async (req, res) => {
  try {
    const tenants = await Tenant.find();
    const normalized = tenants.map(normalizeTenant);
    return res.json(normalized);
  } catch (error) {
    console.error("getTenants error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// POST /api/tenants/:slug/upgrade  (protected)
const upgradeTenant = async (req, res) => {
  try {
    const { slug } = req.params;

    const tenant = await Tenant.findOne({ slug });
    if (!tenant) return res.status(404).json({ message: "Tenant not found" });

    // Ensure req.user exists and userType is admin (case-insensitive)
    if (!req.user || String(req.user.userType || "").toLowerCase() !== "admin") {
      return res.status(403).json({ message: "Only Admin can upgrade" });
    }

    tenant.plan = "pro";
    await tenant.save();

    // Return normalized tenant object (frontend expects tenant object)
    return res.json(normalizeTenant(tenant));
  } catch (error) {
    console.error("upgradeTenant error:", error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { getTenants, upgradeTenant };
