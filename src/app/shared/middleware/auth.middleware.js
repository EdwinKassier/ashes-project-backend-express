import jwt from 'jsonwebtoken';
import config from '../config/app.config.js';

/**
 * Verify JWT token middleware
 */
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: {
        message: 'Access token required',
      },
    });
  }

  jwt.verify(token, config.jwtSecret, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Invalid or expired token',
        },
      });
    }

    req.user = user;
    next();
  });
};

/**
 * Optional authentication (doesn't fail if no token)
 */
export const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next();
  }

  jwt.verify(token, config.jwtSecret, (err, user) => {
    if (!err) {
      req.user = user;
    }
    next();
  });
};
