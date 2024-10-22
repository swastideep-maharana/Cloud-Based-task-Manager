import jwt from "jsonwebtoken";
import mongoose from "mongoose";

// Function to establish a database connection
export const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("DB connection established");
  } catch (error) {
    console.error("DB Error: ", error.message); // Log error message
  }
};

// Function to create a JWT token
export const createJWT = (res, userId) => {
  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is not defined in environment variables.");
    return;
  }

  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  console.log(`JWT created with length: ${token.length}`);

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Only set secure in production
    sameSite: "Strict", // Prevent CSRF attack
    maxAge: 1 * 24 * 60 * 60 * 1000, // Cookie expiration time: 1 day
    path: "/", // Cookie path
  });
};