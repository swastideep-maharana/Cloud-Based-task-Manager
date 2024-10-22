import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import { errorHandler, routeNotFound } from "./middlewares/errorMiddleware.js";
import routes from "./routes/index.js";
import { dbConnection } from "./utils/index.js";

// Load environment variables from .env file
dotenv.config();

// Connect to the database
dbConnection();

// Set the port from environment variable or default to 5000
const PORT = process.env.PORT || 5000;

// Create an instance of Express
const app = express();

// CORS middleware configuration
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"], // Allowed origins
    methods: ["GET", "POST", "DELETE", "PUT"], // Allowed methods
    credentials: true, // Enable credentials for cookies
  })
);

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware to parse cookies
app.use(cookieParser());

// Logging middleware for development
app.use(morgan("dev"));

// Define API routes
app.use("/api", routes);

// Error handling middlewares
app.use(routeNotFound);
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
