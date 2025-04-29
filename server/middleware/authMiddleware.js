const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// Add debug logs to verify token and user details
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      console.log("Token received:", token);

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded token:", decoded);

      req.user = await User.findById(decoded.id).select("-password");
      console.log("User found:", req.user);

      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      next();
    } catch (error) {
      console.error("Error decoding token:", error);
      return res.status(401).json({ message: "Not authorized" });
    }
  } else {
    console.warn("No token provided in headers");
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

const admin = (req, res, next) => {
  console.log("Checking admin access for user:", req.user);

  if (req.user && req.user.isAdmin) {
    next();
  } else {
    console.warn("User is not an admin:", req.user);
    return res.status(401).json({ message: "Not authorized as an admin" });
  }
};

module.exports = { protect, admin };
