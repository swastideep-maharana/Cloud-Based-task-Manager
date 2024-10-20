import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export const dbConnection = async () => {
  try {
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    await mongoose.connect(process.env.MONGODB_URI, options);
    console.log("DB connection established");
  } catch (error) {
    console.error("DB Error: ", error.message); // Log error message
  }
};

export const createJWT = (res, userId, additionalData = {}) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  const token = jwt.sign(
    { userId, ...additionalData },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );

  // Change sameSite from strict to none when you deploy your app
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict", // Prevent CSRF attack
    maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
    path: "/", // Cookie path
  });
};
