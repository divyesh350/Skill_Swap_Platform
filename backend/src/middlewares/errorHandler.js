// errorHandler.js - Global error handling middleware
const winston = require('winston');

/**
 * Express error handler middleware.
 * @param {Error} err - Error object
 * @param {Request} req - Express request
 * @param {Response} res - Express response
 * @param {Function} next - Next middleware
 */
function errorHandler(err, req, res, next) {
  winston.error(err.stack);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation failed',
      details: err.errors
    });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      error: 'Unauthorized access'
    });
  }

  res.status(500).json({
    error: 'Internal server error'
  });
}

module.exports = { errorHandler }; 