const asyncHandler = require("express-async-handler");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");

// @desc    Get user cart
// @route   GET /api/carts/:userId
// @access  Private
const getUserCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.params.userId });

  if (cart) {
    res.json(cart);
  } else {
    res.status(404);
    throw new Error("Cart not found");
  }
});

// @desc    Add item to cart
// @route   POST /api/carts/:userId/items
// @access  Private
const addItemToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;

  const product = await Product.findById(productId);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // Find the user's cart or create one if not exists
  let cart = await Cart.findOne({ user: req.params.userId });

  if (!cart) {
    // If the user doesn't have a cart, create one
    cart = new Cart({
      user: req.params.userId,
      cartItems: [],
      totalPrice: 0,
    });
  }

  // Check if the product is already in the cart
  const existingItemIndex = cart.cartItems.findIndex(
    (item) => item.product.toString() === productId
  );

  if (existingItemIndex >= 0) {
    // Product exists in the cart, update quantity
    cart.cartItems[existingItemIndex].quantity += quantity;
  } else {
    // Product does not exist in the cart, add it
    cart.cartItems.push({
      product: productId,
      name: product.name,
      image: product.image,
      price: product.price,
      quantity,
    });
  }

  // Recalculate the total price of the cart
  cart.totalPrice = cart.cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  // Save the updated cart
  await cart.save();

  res.status(201).json(cart);
});

// @desc    Update item quantity in the cart
// @route   PUT /api/carts/:userId/items/:itemId
// @access  Private
const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const { userId, itemId } = req.params;

  // Find the user's cart
  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    res.status(404);
    throw new Error("Cart not found");
  }

  // Find the cart item
  const cartItem = cart.cartItems.find(
    (item) => item._id.toString() === itemId
  );

  if (!cartItem) {
    res.status(404);
    throw new Error("Cart item not found");
  }

  // Update quantity
  cartItem.quantity = quantity;

  // Recalculate the total price
  cart.totalPrice = cart.cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  // Save the updated cart
  await cart.save();

  res.json(cart);
});

// @desc    Remove item from cart
// @route   DELETE /api/carts/:userId/items/:itemId
// @access  Private
const removeItemFromCart = asyncHandler(async (req, res) => {
  const { userId, itemId } = req.params;

  // Find the user's cart
  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    res.status(404);
    throw new Error("Cart not found");
  }

  // Filter out the item to be removed
  const updatedCartItems = cart.cartItems.filter(
    (item) => item._id.toString() !== itemId
  );

  // Update the cart items
  cart.cartItems = updatedCartItems;

  if (updatedCartItems.length === 0) {
    // If no items left, delete the entire cart
    await Cart.deleteOne({ user: userId });
    res.json({ message: "Cart is empty and has been deleted" });
  } else {
    // If still items left, update total price and save
    cart.totalPrice = updatedCartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    await cart.save();
    res.json(cart);
  }
});

// @desc    Clear all items in cart
// @route   DELETE /api/carts/:userId
// @access  Private
const clearCart = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  // Find the user's cart
  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    res.status(404);
    throw new Error("Cart not found");
  }

  // Delete the cart entirely if it exists
  await Cart.deleteOne({ user: userId });

  res.json({ message: "Cart cleared and deleted" });
});

module.exports = {
  getUserCart,
  addItemToCart,
  updateCartItem,
  removeItemFromCart,
  clearCart,
};
