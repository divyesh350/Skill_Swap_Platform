// authMiddleware.js - JWT authentication middleware
const jwt = require('jsonwebtoken');
const config = require('../config/config');

/**
 * Express middleware to authenticate JWT access token.
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }
  jwt.verify(token, config.jwtSecret, (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expired' });
      }
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
}

module.exports = { authenticateToken }; 