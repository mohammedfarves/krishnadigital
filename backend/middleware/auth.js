import { verifyToken } from '../utils/jwt.js';
import { User } from '../models/index.js';

/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request
 */
export const authenticate = async (req, res, next) => {
  try {
    // Get token from header, body, or cookie
    let token = req.headers.authorization || req.body.token || req.query.token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.substring(7);
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    // Verify token
    const decoded = verifyToken(token);
    
    // Check if user still exists
    const user = await User.findByPk(decoded.userId);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User no longer exists.'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated.'
      });
    }

    // Attach user to request
    req.user = {
      id: user.id,
      phone: user.phone,
      slug: user.slug,
      role: user.role,
      isVerified: user.isVerified
    };
    
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token.'
    });
  }
};

/**
 * Optional authentication middleware
 * Doesn't fail if no token, but attaches user if valid token exists
 */
export const optionalAuthenticate = async (req, res, next) => {
  try {
    // Get token from header, body, or cookie
    let token = req.headers.authorization || req.body.token || req.query.token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.substring(7);
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return next(); // No token, continue without user
    }

    // Verify token
    const decoded = verifyToken(token);
    
    // Check if user still exists
    const user = await User.findByPk(decoded.userId);
    
    if (user && user.isActive) {
      // Attach user to request
      req.user = {
        id: user.id,
        phone: user.phone,
        slug: user.slug,
        role: user.role,
        isVerified: user.isVerified
      };
    }
    
    next();
  } catch (error) {
    // Invalid token, continue without user
    next();
  }
};

/**
 * Check if user is verified
 */
export const requireVerified = (req, res, next) => {
  if (!req.user || !req.user.isVerified) {
    return res.status(403).json({
      success: false,
      message: 'Account verification required.'
    });
  }
  next();
};

/**
 * Customer middleware
 * Checks if user has customer role
 */
export const requireCustomer = (req, res, next) => {
  if (!req.user || req.user.role !== 'customer') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Customer account required.'
    });
  }
  next();
};

/**
 * Verified customer middleware
 */
export const requireVerifiedCustomer = (req, res, next) => {
  if (!req.user || req.user.role !== 'customer') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Customer account required.'
    });
  }

  if (!req.user.isVerified) {
    return res.status(403).json({
      success: false,
      message: 'Account verification required.'
    });
  }
  next();
};

/**
 * Admin middleware
 * Checks if user has admin role
 */
export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.'
    });
  }
  next();
};