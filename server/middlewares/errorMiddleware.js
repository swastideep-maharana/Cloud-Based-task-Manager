// Middleware to handle routes that are not found
const routeNotFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Global error handler middleware
const errorHandler = (err, req, res, next) => {
  // If the status code is still 200 (OK), change it to 500 (server error)
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Handle specific error types (e.g., invalid ObjectId)
  if (err.name === "CastError" && err.kind === "ObjectId") {
    statusCode = 404;
    message = "Resource not found";
  }

  // Send error response with the appropriate status code and message
  res.status(statusCode).json({
    status: false,
    message: message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack, // Hide stack in production
  });
};

export { routeNotFound, errorHandler };
