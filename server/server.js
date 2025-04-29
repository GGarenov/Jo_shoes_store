const express = require("express");
const app = express();
const cors = require("cors");
const errorMiddleware = require("./middleware/errors");

// Setting up config
const dotenv = require("dotenv");
dotenv.config();

// Connect to database
const connectDatabase = require("./config/db");
connectDatabase();

app.use(express.json());
app.use(cors());

// Import all routes
const products = require("./routes/productRoutes");
app.use("/api/v1", products);

// Middleware to handle errors
app.use(errorMiddleware);

const server = app.listen(process.env.PORT || 4000, () => {
  console.log(`Server started on PORT: ${process.env.PORT || 4000}`);
});

// Handle Unhandled Promise rejections
process.on("unhandledRejection", (err) => {
  console.log(`ERROR: ${err.message}`);
  console.log("Shutting down the server due to Unhandled Promise rejection");
  server.close(() => {
    process.exit(1);
  });
});
