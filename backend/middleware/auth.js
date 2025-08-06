// JWT Authentication Middleware
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - General authentication
const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, no token provided'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from token
    const user = await User.findById(decoded.id).populate('company');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, user not found'
      });
    }

    if (user.status !== 'active') {
      return res.status(401).json({
        success: false,
        message: 'Account is inactive'
      });
    }

    req.user = user;
    next();

  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({
      success: false,
      message: 'Not authorized, token failed'
    });
  }
};

// Authorize specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route`
      });
    }
    next();
  };
};

// Check if user is HR and company is active
const hrOnly = async (req, res, next) => {
  try {
    if (req.user.role !== 'hr') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. HR role required.'
      });
    }

    if (!req.user.company) {
      return res.status(403).json({
        success: false,
        message: 'No company associated with this HR account'
      });
    }

    if (req.user.company.status !== 'active') {
      return res.status(403).json({
        success: false,
        message: 'Company account is not active'
      });
    }

    next();
  } catch (error) {
    console.error('HR middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Check if user is candidate
const candidateOnly = (req, res, next) => {
  if (req.user.role !== 'candidate') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Candidate role required.'
    });
  }
  next();
};

// Check if user is admin
const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin role required.'
    });
  }
  next();
};

// Check subscription limits for company
const checkSubscriptionLimits = async (req, res, next) => {
  try {
    if (req.user.role === 'hr' && req.user.company) {
      const company = req.user.company;
      
      // Check if subscription is active
      if (company.subscription.status !== 'active' && company.subscription.status !== 'trial') {
        return res.status(403).json({
          success: false,
          message: 'Subscription is not active. Please upgrade your plan.'
        });
      }

      // Check if subscription has expired
      if (company.subscription.endDate < new Date()) {
        return res.status(403).json({
          success: false,
          message: 'Subscription has expired. Please renew your plan.'
        });
      }

      // Check resume processing limits
      if (company.subscription.resumesProcessed >= company.subscription.resumeLimit) {
        return res.status(403).json({
          success: false,
          message: `Resume processing limit reached (${company.subscription.resumeLimit}). Please upgrade your plan.`
        });
      }
    }

    next();
  } catch (error) {
    console.error('Subscription middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Optional authentication (for public routes that can benefit from user context)
const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).populate('company');
      
      if (user && user.status === 'active') {
        req.user = user;
      }
    }

    next();
  } catch (error) {
    // Don't fail for optional auth, just continue without user
    next();
  }
};

module.exports = {
  protect,
  authorize,
  hrOnly,
  candidateOnly,
  adminOnly,
  checkSubscriptionLimits,
  optionalAuth
};
