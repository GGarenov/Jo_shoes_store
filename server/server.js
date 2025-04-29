const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const path = require("path");
const multer = require("multer");

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Make uploads folder static
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// Basic route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Error middleware
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

app.use((err, req, res, next) => {
  // Check for multer errors
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      res.status(400);
      return res.json({ message: "File too large. Max size is 5MB." });
    }
    res.status(400);
    return res.json({ message: err.message });
  }

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () =>
    console.log(`Server running in development mode on port ${PORT}`)
  );
}

module.exports = app;
