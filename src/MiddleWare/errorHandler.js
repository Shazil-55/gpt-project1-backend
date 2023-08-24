function errorHandler(err, req, res, next) {
    console.error(err); // Log the error for debugging purposes
  
    // Check if the error is a known error with a defined status code
    if (err.statusCode) {
      res.status(err.statusCode).json({ error: err.message });
    } else {
      // For unknown errors, return a generic error response
      res.status(500).json({ error: "Internal Server Error" });
      next(); // Call next to proceed to the next middleware or route handler
    }
  }
  
  module.exports = errorHandler;
  