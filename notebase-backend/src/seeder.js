//src/seeder.js

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

const ConnectDB = require("./config/Database");
const Tenant = require("./models/tenant");
const User = require("./models/user");

dotenv.config();

const seedData = async () => {
  try {
    await ConnectDB();

    // Clear old data
    await Tenant.deleteMany();
    await User.deleteMany();

    // Create tenants
    const acme = await Tenant.create({ name: "Acme", slug: "acme", plan: "free" });
    const globex = await Tenant.create({ name: "Globex", slug: "globex", plan: "free" });

    // Hashed password
    const hashedPassword = await bcrypt.hash("password", 10);

    // Users
    const users = [
      {
        fullName: "Acme Admin",
        email: "admin@acme.test",
        password: hashedPassword,
        userType: "admin",
        tenant: acme._id,
      },
      {
        fullName: "Acme User",
        email: "user@acme.test",
        password: hashedPassword,
        userType: "member",
        tenant: acme._id,
      },
      {
        fullName: "Globex Admin",
        email: "admin@globex.test",
        password: hashedPassword,
        userType: "admin",
        tenant: globex._id,
      },
      {
        fullName: "Globex User",
        email: "user@globex.test",
        password: hashedPassword,
        userType: "member",
        tenant: globex._id,
      },
    ];

    await User.insertMany(users);

    console.log("✅ Seed data inserted successfully!");
    process.exit();
  } catch (error) {
    console.error("❌ Error inserting seed data:", error);
    process.exit(1);
  }
};

seedData();
