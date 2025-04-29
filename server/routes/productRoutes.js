const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
router.get("/", getProducts);

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
router.get("/:id", getProductById);

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Admin
router.post("/", protect, admin, createProduct);

// @desc    Update an existing product
// @route   PUT /api/products/:id
// @access  Private/Admin
router.put("/:id", protect, admin, updateProduct);

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
router.delete("/:id", protect, admin, deleteProduct);

module.exports = router;
