const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { protect, admin } = require("../middleware/authMiddleware");
const {
  registerUser,
  authUser,
  getUserProfile,
  updateUserProfile,
  deleteUser,
} = require("../controllers/userController");

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
router.post("/", registerUser);

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
router.post("/login", authUser);

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
router.get("/profile", protect, getUserProfile);

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
router.put("/profile", protect, updateUserProfile);

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
console.log("User Routes Loaded");
router.get("/", protect, admin, async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// @desc    Delete user (admin only)
// @route   DELETE /api/users/:id
// @access  Private/Admin
router.delete("/:id", protect, admin, deleteUser);

module.exports = router;
