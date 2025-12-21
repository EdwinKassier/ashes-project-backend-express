import type { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import type { ZodError } from 'zod';
import { logger } from '../utils/logger.js';

/**
 * Operational error interface for domain exceptions
 */
interface OperationalError extends Error {
  isOperational: boolean;
  statusCode: number;
  code: string;
}

/**
 * Zod validation error interface
 */
interface ZodValidationError extends Error {
  isZod: boolean;
  errors: ZodError['issues'];
}

/**
 * Sequelize error interface
 */
interface SequelizeError extends Error {
  errors: Array<{ message: string }>;
}

/**
 * Extended request with optional user
 */
interface AuthenticatedRequest extends Request {
  user?: { id: string | number };
}

/**
 * Type guard for operational errors
 */
function isOperationalError(err: Error): err is OperationalError {
  return 'isOperational' in err && (err as OperationalError).isOperational === true;
}

/**
 * Type guard for Zod validation errors
 */
function isZodError(err: Error): err is ZodValidationError {
  return 'isZod' in err && (err as ZodValidationError).isZod === true;
}

/**
 * Global error handler
 * MUST have 4 parameters for Express to recognize it as error middleware
 */
export const errorHandler: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void => {
  const authReq = req as AuthenticatedRequest;

  // Log error
  logger.error({
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userId: authReq.user?.id,
  });

  // Handle operational errors (custom domain exceptions)
  if (isOperationalError(err)) {
    res.status(err.statusCode).json({
      success: false,
      error: {
        message: err.message,
        code: err.code,
      },
    });
    return;
  }

  // Handle validation errors (Zod)
  if (isZodError(err)) {
    res.status(400).json({
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
    return;
  }

  // Handle Sequelize errors
  if (err.name === 'SequelizeValidationError') {
    const seqErr = err as SequelizeError;
    res.status(400).json({
      success: false,
      error: {
        message: 'Database validation error',
        details: seqErr.errors.map((e) => e.message),
      },
    });
    return;
  }

  if (err.name === 'SequelizeDatabaseError') {
    res.status(500).json({
      success: false,
      error: {
        message: 'Database error',
      },
    });
    return;
  }

  // Default error (hide details in production)
  const statusCode = (err as OperationalError).statusCode || 500;
  res.status(statusCode).json({
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
export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    error: {
      message: 'Resource not found',
      path: req.originalUrl,
    },
  });
};
