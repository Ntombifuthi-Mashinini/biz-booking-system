const User = require('../models/User');

const authMiddleware = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Access denied. No token provided.'
      });
    }

    // Extract token
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const decoded = User.verifyToken(token);
    
    // Add user info to request
    req.user = decoded;
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({
      error: 'Invalid token'
    });
  }
};

// Optional auth middleware (doesn't fail if no token)
const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = User.verifyToken(token);
      req.user = decoded;
    }
    
    next();
  } catch (error) {
    // Continue without user info if token is invalid
    next();
  }
};

// Role-based authorization middleware
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Access denied. Authentication required.'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Access denied. Insufficient permissions.'
      });
    }

    next();
  };
};

// Business owner authorization middleware
const requireBusinessOwner = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      error: 'Access denied. Authentication required.'
    });
  }

  if (req.user.role !== 'business_owner') {
    return res.status(403).json({
      error: 'Access denied. Business owner access required.'
    });
  }

  next();
};

module.exports = {
  authMiddleware,
  optionalAuth,
  requireRole,
  requireBusinessOwner
}; 