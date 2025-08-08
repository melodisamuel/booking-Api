// src/middleware/errorHandler.js
function errorHandler(err, req, res, next) {
    console.error(err); // Optional: log full error stack for debugging
  
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
  
    res.status(statusCode).json({ message });
  }
  
  module.exports = errorHandler;
  