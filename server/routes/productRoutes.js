const express = require("express");
const router = express.Router();

const {
  getProducts,
  createProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  updateStock,
  toggleSale,
} = require("../controllers/productController");

// Public Routes
router.route("/products").get(getProducts);
router.route("/product/:id").get(getSingleProduct);

// Admin Routes
router.route("/admin/product/new").post(createProduct);
router.route("/admin/product/:id").put(updateProduct).delete(deleteProduct);
router.route("/admin/product/:id/stock").put(updateStock);
router.route("/admin/product/:id/toggle-sale").put(toggleSale);

module.exports = router;
