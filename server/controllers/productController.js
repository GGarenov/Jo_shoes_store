const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

// Create new product   =>   /api/v1/admin/product/new
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
  req.body.user = req.user.id;

  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    product,
  });
});

// Get all products with filters   =>   /api/v1/products
exports.getProducts = catchAsyncErrors(async (req, res, next) => {
  const { gender, category, brand, minPrice, maxPrice, onSale, style } =
    req.query;

  // Build query
  const query = {};

  if (gender) query.gender = gender;
  if (category) query.category = category;
  if (brand) query.brand = brand;
  if (style) query["attributes.style"] = style;
  if (onSale === "true") query.onSale = true;

  // Price filter
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  const products = await Product.find(query);

  res.status(200).json({
    success: true,
    count: products.length,
    products,
  });
});

// Get single product details   =>   /api/v1/product/:id
exports.getSingleProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    product,
  });
});

// Update Product   =>   /api/v1/admin/product/:id
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  // Validate sale price if product is on sale
  if (req.body.onSale && req.body.salePrice >= product.price) {
    return next(
      new ErrorHandler("Sale price must be less than regular price", 400)
    );
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    product,
  });
});

// Delete Product   =>   /api/v1/admin/product/:id
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  await product.deleteOne();

  res.status(200).json({
    success: true,
    message: "Product is deleted.",
  });
});

// Update product stock/size quantity   =>   /api/v1/admin/product/:id/stock
exports.updateStock = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const { sizeUpdates } = req.body;

  if (!sizeUpdates || !Array.isArray(sizeUpdates)) {
    return next(new ErrorHandler("Invalid stock update data", 400));
  }

  sizeUpdates.forEach((update) => {
    const sizeItem = product.sizes.find((s) => s.size === update.size);
    if (sizeItem) {
      sizeItem.quantity = update.quantity;
    }
  });

  await product.save();

  res.status(200).json({
    success: true,
    product,
  });
});

// Toggle sale status   =>   /api/v1/admin/product/:id/toggle-sale
exports.toggleSale = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const { onSale, salePrice } = req.body;

  if (onSale && (!salePrice || salePrice >= product.price)) {
    return next(
      new ErrorHandler(
        "Valid sale price less than regular price is required",
        400
      )
    );
  }

  product.onSale = onSale;
  if (onSale) {
    product.salePrice = salePrice;
  } else {
    product.salePrice = undefined;
  }

  await product.save();

  res.status(200).json({
    success: true,
    product,
  });
});
