import jwt from "jsonwebtoken";
import User from "../models/User.js";
import asyncHandler from "express-async-handler";

// Middleware to protect private routes
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Expect token in Authorization header as "Bearer <token>"
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to request (excluding password)
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        res.status(401);
        throw new Error("User not found, token invalid");
      }

      next(); // ✅ Continue to next middleware or controller
    } catch (error) {
      console.error("Auth Error:", error);
      res.status(401);
      throw new Error("Not authorized, token failed or expired");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token provided");
  }
});
