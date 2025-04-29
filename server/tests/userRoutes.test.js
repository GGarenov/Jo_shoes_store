const request = require("supertest");
const app = require("../server");
const mongoose = require("mongoose");
const User = require("../models/userModel");

jest.setTimeout(15000);

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

afterEach(async () => {
  await User.deleteMany({ email: "test@example.com" });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("User Routes", () => {
  it("should register a new user", async () => {
    const res = await request(app).post("/api/users").send({
      name: "Test User",
      email: "test@example.com",
      password: "123456",
      userName: "testuser123", // Add this line
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("token");
    expect(res.body.email).toBe("test@example.com");
  });
});
