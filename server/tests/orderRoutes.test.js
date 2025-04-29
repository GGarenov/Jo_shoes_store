const mongoose = require("mongoose");
const request = require("supertest");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const path = require("path");
const shortid = require("shortid");

// Load test environment variables
dotenv.config({ path: path.resolve(__dirname, "../.env.test") });

const app = require("../server");
const Order = require("../models/orderModel");
const User = require("../models/userModel");
const Product = require("../models/productModel");

describe("Order Controller", () => {
  let authToken;
  let adminToken;
  let user;
  let adminUser;
  let testProduct;
  let uniqueId = shortid.generate();

  beforeAll(async () => {
    // Connect to the test database
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Create a test user
    user = await User.create({
      name: `Test User ${uniqueId}`,
      email: `test${uniqueId}@example.com`,
      password: "password123",
      userName: `testuser${uniqueId}`,
    });

    // Create an admin user
    adminUser = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: "adminpassword123",
      userName: "adminuser",
      isAdmin: true,
    });

    // Generate tokens manually
    authToken = jwt.sign({ id: user._id.toString() }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    adminToken = jwt.sign(
      { id: adminUser._id.toString() },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    // Create a test product
    testProduct = await Product.create({
      name: "Test Product",
      price: 99.99,
      user: user._id,
      image: "/test-image.jpg",
      brand: "Test Brand",
      attributes: {
        color: "Black",
        material: "Metal",
      },
      gender: "unisex",
      category: "casual",
      countInStock: 10,
      description: "Test Description",
    });
  });

  // Cleanup after all tests
  afterAll(async () => {
    await User.deleteMany({});
    await Order.deleteMany({});
    await Product.deleteMany({});
    await mongoose.connection.close();
  });

  describe("GET /api/orders/myorders", () => {
    beforeEach(async () => {
      // Clear existing orders
      await Order.deleteMany({});

      // Create exactly 2 orders for the test user
      await Order.create([
        {
          user: user._id,
          orderItems: [
            {
              name: testProduct.name,
              qty: 2,
              image: testProduct.image,
              price: testProduct.price,
              product: testProduct._id,
            },
          ],
          shippingAddress: {
            address: "123 Test St",
            city: "Test City",
            postalCode: "12345",
            country: "Test Country",
          },
          paymentMethod: "PayPal",
          taxPrice: 10,
          shippingPrice: 5,
          totalPrice: 214.98,
          isPaid: false,
          isDelivered: false,
        },
        {
          user: user._id,
          orderItems: [
            {
              name: testProduct.name,
              qty: 1,
              image: testProduct.image,
              price: testProduct.price,
              product: testProduct._id,
            },
          ],
          shippingAddress: {
            address: "456 Another St",
            city: "Another City",
            postalCode: "67890",
            country: "Another Country",
          },
          paymentMethod: "Credit Card",
          taxPrice: 5,
          shippingPrice: 3,
          totalPrice: 107.99,
          isPaid: false,
          isDelivered: false,
        },
      ]);
    });

    it("should get user's own orders", async () => {
      const response = await request(app)
        .get("/api/orders/myorders")
        .set("Authorization", `Bearer ${authToken}`);

      console.log("Get My Orders Response:", response.body);
      expect(response.statusCode).toBe(200);
      expect(response.body.length).toBe(2);
    });
  });

  describe("GET /api/orders (admin)", () => {
    beforeEach(async () => {
      // Clear existing orders
      await Order.deleteMany({});

      // Create exactly 2 orders: one for user, one for admin
      await Order.create([
        {
          user: user._id,
          orderItems: [
            {
              name: testProduct.name,
              qty: 2,
              image: testProduct.image,
              price: testProduct.price,
              product: testProduct._id,
            },
          ],
          shippingAddress: {
            address: "123 Test St",
            city: "Test City",
            postalCode: "12345",
            country: "Test Country",
          },
          paymentMethod: "PayPal",
          taxPrice: 10,
          shippingPrice: 5,
          totalPrice: 214.98,
          isPaid: false,
          isDelivered: false,
        },
        {
          user: adminUser._id,
          orderItems: [
            {
              name: testProduct.name,
              qty: 1,
              image: testProduct.image,
              price: testProduct.price,
              product: testProduct._id,
            },
          ],
          shippingAddress: {
            address: "456 Another St",
            city: "Another City",
            postalCode: "67890",
            country: "Another Country",
          },
          paymentMethod: "Credit Card",
          taxPrice: 5,
          shippingPrice: 3,
          totalPrice: 107.99,
          isPaid: false,
          isDelivered: false,
        },
      ]);
    });

    it("should get all orders for admin", async () => {
      const response = await request(app)
        .get("/api/orders")
        .set("Authorization", `Bearer ${adminToken}`);

      console.log("Get All Orders Response:", response.body);
      expect(response.statusCode).toBe(200);
      expect(response.body.length).toBe(2);
    });
  });
});
