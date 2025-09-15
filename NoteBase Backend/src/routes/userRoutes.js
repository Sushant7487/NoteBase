// const express = require("express");
// const { registerUser, loginUser, getUsers } = require("../controllers/userController");
// const { protect } = require("../middlewares/authMiddleware");

// const router = express.Router();

// // Routes
// router.post("/register", registerUser);
// router.post("/login", loginUser);
// router.get("/", protect, getUsers); // protected route

// module.exports = router;

















// src/routes/userRoutes.js
const express = require("express");
// **FIX**: Removed 'loginUser' from the import
const { registerUser, getUsers } = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// Public route for new user registration
router.post("/register", registerUser);

// Protected route for admins to get a list of all users
router.get("/", protect, getUsers);

module.exports = router;
