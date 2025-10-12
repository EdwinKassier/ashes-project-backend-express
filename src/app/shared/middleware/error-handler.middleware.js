import { logger } from '../utils/logger.js';

/**
 * Global error handler
 * MUST have 4 parameters for Express to recognize it as error middleware
 */
// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  // Log error
  logger.error({
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userId: req.user?.id,
  });

  // Handle operational errors (custom domain exceptions)
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        message: err.message,
        code: err.code,
      },
    });
  }

  // Handle validation errors (Zod)
  if (err.isZod) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Validation error',
        details: err.errors.map((error) => ({
          message: error.message,
          path: error.path.join('.'),
          code: error.code,
        })),
      },
    });
  }

  // Handle Sequelize errors
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Database validation error',
        details: err.errors.map((e) => e.message),
      },
    });
  }

  if (err.name === 'SequelizeDatabaseError') {
    return res.status(500).json({
      success: false,
      error: {
        message: 'Database error',
      },
    });
  }

  // Default error (hide details in production)
  return res.status(err.statusCode || 500).json({
    success: false,
    error: {
      message:
        process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
      ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
    },
  });
};

/**
 * 404 handler for routes that don't exist
 */
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: 'Resource not found',
      path: req.originalUrl,
    },
  });
};
