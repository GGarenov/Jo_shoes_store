const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  addItemToCart,
  getUserCart,
  updateCartItem,
  removeItemFromCart,
  clearCart,
} = require("../controllers/cartController");

// @desc    Add item to cart
// @route   POST /api/carts/:userId/items
// @access  Private
router.post("/:userId/items", protect, addItemToCart);

// @desc    Get user's cart
// @route   GET /api/carts/:userId
// @access  Private
router.get("/:userId", protect, getUserCart);

// @desc    Update quantity of an item in the cart
// @route   PUT /api/carts/:userId/items/:itemId
// @access  Private
router.put("/:userId/items/:itemId", protect, updateCartItem);

// @desc    Remove an item from the cart
// @route   DELETE /api/carts/:userId/items/:itemId
// @access  Private
router.delete("/:userId/items/:itemId", protect, removeItemFromCart);

// @desc    Clear the entire cart
// @route   DELETE /api/carts/:userId
// @access  Private
router.delete("/:userId", protect, clearCart);

module.exports = router;
