const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../server"); // Adjust the path to your Express app
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

describe("Cart Routes", () => {
  let token;
  let userId;
  let productId;

  // Setup before all tests
  beforeAll(async () => {
    // Connect to the test database
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Create a test user
    const user = await User.create({
      name: "Test User",
      email: "testuser@example.com",
      password: "password123",
      userName: "testuser",
    });
    userId = user._id;

    // Generate a JWT token for the user
    token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Create a test product
    const product = await Product.create({
      user: userId,
      name: "Test Sunglasses",
      image: "/test-image.jpg",
      brand: "Test Brand",
      attributes: {
        color: "Black",
        material: "Metal",
      },
      gender: "unisex",
      category: "casual",
      description: "Test description",
      price: 99.99,
      countInStock: 10,
      rating: 4.5,
      numReviews: 5,
    });
    productId = product._id;
  });

  // Cleanup after all tests
  afterAll(async () => {
    // Remove test data
    await User.deleteMany({});
    await Product.deleteMany({});
    await Cart.deleteMany({});

    // Close mongoose connection
    await mongoose.connection.close();
  });

  // Reset database between tests
  beforeEach(async () => {
    await Cart.deleteMany({});
  });

  describe("POST /:userId/items - Add Item to Cart", () => {
    it("should add an item to the cart", async () => {
      const response = await request(app)
        .post(`/api/carts/${userId}/items`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          productId: productId,
          quantity: 2,
        });

      expect(response.statusCode).toBe(201);
      expect(response.body.cartItems).toHaveLength(1);
      expect(response.body.cartItems[0].product.toString()).toBe(
        productId.toString()
      );
      expect(response.body.cartItems[0].quantity).toBe(2);
      expect(response.body.totalPrice).toBe(199.98);
    });

    it("should increase quantity if item already exists in cart", async () => {
      // First add the item
      await request(app)
        .post(`/api/carts/${userId}/items`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          productId: productId,
          quantity: 2,
        });

      // Add the same item again
      const response = await request(app)
        .post(`/api/carts/${userId}/items`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          productId: productId,
          quantity: 3,
        });

      expect(response.statusCode).toBe(201);
      expect(response.body.cartItems).toHaveLength(1);
      expect(response.body.cartItems[0].quantity).toBe(5);
      expect(response.body.totalPrice).toBe(499.95);
    });
  });

  describe("GET /:userId - Get User Cart", () => {
    it("should retrieve user cart", async () => {
      // First add an item to the cart
      await request(app)
        .post(`/api/carts/${userId}/items`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          productId: productId,
          quantity: 2,
        });

      // Then get the cart
      const response = await request(app)
        .get(`/api/carts/${userId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.cartItems).toHaveLength(1);
      expect(response.body.totalPrice).toBe(199.98);
    });

    it("should return 404 if cart does not exist", async () => {
      // Use mongoose.Types.ObjectId.createFromHexString to create a valid ObjectId
      const nonExistentUserId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .get(`/api/carts/${nonExistentUserId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(404);
    });
  });

  describe("PUT /:userId/items/:itemId - Update Cart Item", () => {
    it("should update item quantity in cart", async () => {
      // First add an item to the cart
      const cartResponse = await request(app)
        .post(`/api/carts/${userId}/items`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          productId: productId,
          quantity: 2,
        });

      const itemId = cartResponse.body.cartItems[0]._id;

      // Update the item quantity
      const response = await request(app)
        .put(`/api/carts/${userId}/items/${itemId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          quantity: 5,
        });

      expect(response.statusCode).toBe(200);
      expect(response.body.cartItems[0].quantity).toBe(5);
      expect(response.body.totalPrice).toBe(499.95);
    });
  });

  describe("DELETE /:userId/items/:itemId - Remove Item from Cart", () => {
    it("should remove an item from the cart", async () => {
      // First add an item to the cart
      const cartResponse = await request(app)
        .post(`/api/carts/${userId}/items`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          productId: productId,
          quantity: 2,
        });

      const itemId = cartResponse.body.cartItems[0]._id;

      // Remove the item
      const response = await request(app)
        .delete(`/api/carts/${userId}/items/${itemId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.cartItems || []).toHaveLength(0);
      expect(response.body.totalPrice || 0).toBe(0);
    });
  });

  describe("DELETE /:userId - Clear Cart", () => {
    it("should clear the entire cart", async () => {
      // First add an item to the cart
      await request(app)
        .post(`/api/carts/${userId}/items`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          productId: productId,
          quantity: 2,
        });

      // Clear the cart
      const response = await request(app)
        .delete(`/api/carts/${userId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe("Cart cleared and deleted");

      // Verify cart is actually deleted
      const cart = await Cart.findOne({ user: userId });
      expect(cart).toBeNull();
    });
  });
});
