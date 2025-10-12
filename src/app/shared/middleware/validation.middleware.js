/**
 * Validate request query parameters
 */
export const validateQuery = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      const error = new Error('Validation failed');
      error.isZod = true;
      error.errors = result.error.issues; // Changed from .errors to .issues
      error.zodError = result.error;
      return next(error);
    }

    // Replace query with validated value (stripped & converted)
    req.query = result.data;
    next();
  };
};

/**
 * Validate request body
 */
export const validateBody = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const error = new Error('Validation failed');
      error.isZod = true;
      error.errors = result.error.issues; // Changed from .errors to .issues
      error.zodError = result.error;
      return next(error);
    }

    req.body = result.data;
    next();
  };
};

/**
 * Validate request params
 */
export const validateParams = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.params);

    if (!result.success) {
      const error = new Error('Validation failed');
      error.isZod = true;
      error.errors = result.error.issues; // Changed from .errors to .issues
      error.zodError = result.error;
      return next(error);
    }

    req.params = result.data;
    next();
  };
};
