
// src/controllers/userController.js
const User = require("../models/user");
const jwt = require("jsonwebtoken"); // <-- 1. Import 'jsonwebtoken'

// NOTE: We are no longer using generateToken.js

// Register User (for public signup)
const registerUser = async (req, res) => {
  try {
    const { fullName, email, password, tenant } = req.body;

    if (!fullName || !email || !password || !tenant) {
      return res.status(400).json({ message: "Please provide all required fields." });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    const user = await User.create({
      fullName,
      email,
      password,
      tenant,
      userType: "member",
    });
    
    await user.populate('tenant');

    // 2. FIX: Create the token directly, just like in the login controller
    const token = jwt.sign(
      {
        userId: user._id,
        tenantId: user.tenant._id,
        role: user.userType,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({
      message: "Registration successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.userType,
        tenant: user.tenant,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all users (protected for Admin)
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).populate('tenant', 'name');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, getUsers };