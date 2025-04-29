const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../server");
const User = require("../models/userModel");
const Product = require("../models/productModel");
const jwt = require("jsonwebtoken");
const shortid = require("shortid");

jest.setTimeout(15000);

// Helper function to generate token directly
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// Explicitly set isAdmin: true for the admin user
const adminUser = {
  name: "Admin User Product",
  email: "admin_product@example.com",
  password: "123456",
  userName: "adminuser_product",
  isAdmin: true,
};

const regularUser = {
  name: "Regular User Product",
  email: "user_product@example.com",
  password: "123456",
  userName: "regularuser_product",
  isAdmin: false,
};

// Updated test product to include required fields
const sampleProduct = {
  name: "Ray-Ban Aviator",
  image: "/images/rayban-aviator.jpg",
  brand: "Ray-Ban",
  category: "casual",
  description: "Classic aviator sunglasses with UV protection",
  price: 129.99,
  countInStock: 10,
  gender: "unisex",
  attributes: {
    color: "Black",
    material: "Metal",
  },
  sizes: [
    { size: 40, quantity: 5 },
    { size: 42, quantity: 5 },
  ],
};

let adminToken;
let userToken;
let productId;
let adminId;
let uniqueId = shortid.generate();

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);

  // Clear users and products collections
  await User.deleteMany({});
  await Product.deleteMany({});

  // Create admin and regular user
  const createdAdmin = await User.create(adminUser);
  const createdUser = await User.create(regularUser);

  // Generate tokens directly using our helper
  adminToken = generateToken(createdAdmin._id);
  userToken = generateToken(createdUser._id);
  adminId = createdAdmin._id;

  // Create a test product
  const productData = { ...sampleProduct, user: createdAdmin._id };
  const createdProduct = await Product.create(productData);
  productId = createdProduct._id;
});

afterAll(async () => {
  await User.deleteMany({});
  await Product.deleteMany({});
  await mongoose.connection.close();
});

describe("Product Routes", () => {
  it("should fetch all products", async () => {
    const res = await request(app).get("/api/products");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("should fetch a single product by ID", async () => {
    const res = await request(app).get(`/api/products/${productId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(productId.toString());
    expect(res.body.name).toBe(sampleProduct.name);
  });

  it("should return 404 if product not found", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/products/${fakeId}`);

    expect(res.statusCode).toBe(404);
  });

  it("should create a new product (admin only)", async () => {
    const newProduct = {
      ...sampleProduct,
      name: "New Test Product",
      price: 149.99,
    };

    const res = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(newProduct);

    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe(newProduct.name);
    expect(res.body.price).toBe(newProduct.price);
  });

  it("should return 401 if not an admin", async () => {
    const res = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${userToken}`)
      .send(sampleProduct);

    expect(res.statusCode).toBe(401);
  });

  it("should update an existing product (admin only)", async () => {
    const updatedData = {
      price: 149.99,
    };

    const res = await request(app)
      .put(`/api/products/${productId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send(updatedData);

    expect(res.statusCode).toBe(200);
    expect(res.body.price).toBe(updatedData.price);
  });

  it("should return 401 if not an admin when updating", async () => {
    const res = await request(app)
      .put(`/api/products/${productId}`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ price: 99.99 });

    expect(res.statusCode).toBe(401);
  });

  it("should delete a product (admin only)", async () => {
    const res = await request(app)
      .delete(`/api/products/${productId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Product removed");
  });

  it("should return 401 if not an admin when deleting", async () => {
    const res = await request(app)
      .delete(`/api/products/${productId}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(401);
  });
});
