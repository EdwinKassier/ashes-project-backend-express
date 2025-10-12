/* eslint-disable arrow-body-style */
/* eslint-disable consistent-return */
import type { Request, Response, NextFunction } from 'express';
import type { ZodSchema, ZodError } from 'zod';

interface ValidationError extends Error {
  isZod: boolean;
  errors: ZodError['issues'];
  zodError: ZodError;
}

/**
 * Validate request query parameters
 */
export const validateQuery = (schema: ZodSchema) => {
  return function (req: Request, _res: Response, next: NextFunction): void {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      const error = new Error('Validation failed') as ValidationError;
      error.isZod = true;
      error.errors = result.error.issues;
      error.zodError = result.error;
      return next(error);
    }

    // Replace query with validated value (stripped & converted)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    req.query = result.data;
    next();
  };
};

/**
 * Validate request body
 */
export const validateBody = (schema: ZodSchema) => {
  return function (req: Request, _res: Response, next: NextFunction): void {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const error = new Error('Validation failed') as ValidationError;
      error.isZod = true;
      error.errors = result.error.issues;
      error.zodError = result.error;
      return next(error);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    req.body = result.data;
    next();
  };
};

/**
 * Validate request params
 */
export const validateParams = (schema: ZodSchema) => {
  return function (req: Request, _res: Response, next: NextFunction): void {
    const result = schema.safeParse(req.params);

    if (!result.success) {
      const error = new Error('Validation failed') as ValidationError;
      error.isZod = true;
      error.errors = result.error.issues;
      error.zodError = result.error;
      return next(error);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    req.params = result.data;
    next();
  };
};
