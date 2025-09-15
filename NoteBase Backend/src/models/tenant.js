//src/models/tenant.js

const mongoose = require("mongoose");

const tenantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true }, // e.g. Acme, Globex
    slug: { type: String, required: true, unique: true }, // url-safe identifier
    plan: {
      type: String,
      enum: ["free", "pro"],
      default: "free",
    },
  },
  { timestamps: true }
);

const Tenant = mongoose.model("Tenant", tenantSchema);
module.exports = Tenant;
