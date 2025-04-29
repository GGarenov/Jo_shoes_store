const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    image,
    brand,
    category,
    description,
    price,
    countInStock,
    frameType,
    lensType,
    uvProtection,
    featured,
  } = req.body;

  console.log("Request body:", req.body);
  console.log("Admin user ID:", req.user._id);

  const productExists = await Product.findOne({ name });

  if (productExists) {
    res.status(400);
    throw new Error("Product already exists");
  }

  const product = new Product({
    user: req.user._id, // Admin's ID
    name,
    image,
    brand,
    category,
    description,
    price,
    countInStock,
    frameType: frameType || "",
    lensType: lensType || "",
    uvProtection: uvProtection || false,
    featured: featured || false,
    attributes: {
      color: req.body.attributes?.color,
      material: req.body.attributes?.material,
    },
    gender: req.body.gender,
  });

  try {
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error("Error saving product:", error);
    res
      .status(500)
      .json({ message: "Error creating product", error: error.message });
  }
});

// @desc    Update an existing product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    image,
    brand,
    category,
    description,
    price,
    countInStock,
    frameType,
    lensType,
    uvProtection,
    featured,
  } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name || product.name;
    product.image = image || product.image;
    product.brand = brand || product.brand;
    product.category = category || product.category;
    product.description = description || product.description;
    product.price = price || product.price;
    product.countInStock = countInStock || product.countInStock;

    // Only update these if they are explicitly provided
    if (frameType !== undefined) product.frameType = frameType;
    if (lensType !== undefined) product.lensType = lensType;
    if (uvProtection !== undefined) product.uvProtection = uvProtection;
    if (featured !== undefined) product.featured = featured;

    console.log("Updated product data:", product);

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await Product.deleteOne({ _id: req.params.id });
    res.json({ message: "Product removed" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
