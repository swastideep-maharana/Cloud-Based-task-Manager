import jwt from "jsonwebtoken";
import User from "../models/user.js";

// Middleware to protect routes
export const protectRoute = async (req, res, next) => {
  try {
    // Get token from cookies
    const token = req.cookies?.token;
    console.log("Token received:", token);

    // Check if token is present
    if (!token) {
      return res.status(401).json({
        status: false,
        message: "Not authorized. Please log in again.",
      });
    }

    // Verify token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // Check if userId is present in the decoded token
    if (!decodedToken?.userId) {
      return res.status(401).json({
        status: false,
        message: "Not authorized. Invalid token.",
      });
    }

    // Find user by ID and select necessary fields
    const user = await User.findById(decodedToken.userId).select("isAdmin email");

    // Check if user exists
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found.",
      });
    }

    // Attach user data to the request object
    req.user = {
      email: user.email,
      isAdmin: user.isAdmin,
      userId: decodedToken.userId,
    };

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Error in protectRoute:", error);
    return res.status(401).json({
      status: false,
      message: "Not authorized. Please log in again.",
    });
  }
};

// Middleware to check if user is admin
export const isAdminRoute = (req, res, next) => {
  if (req.user?.isAdmin) {
    next(); // User is admin, proceed to the next middleware or route handler
  } else {
    return res.status(403).json({
      status: false,
      message: "Forbidden: Not authorized as admin. Please log in as admin.",
    });
  }
};
