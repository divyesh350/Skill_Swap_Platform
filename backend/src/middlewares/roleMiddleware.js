// roleMiddleware.js - Role-based access control middleware
/**
 * Middleware to require a user to have one of the specified roles.
 * Usage: router.get('/admin', authenticateToken, requireRole('admin'), ...)
 * @param {...string} roles - Allowed roles
 * @returns {Function}
 */
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden: insufficient role' });
    }
    next();
  };
}

module.exports = { requireRole }; 