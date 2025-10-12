/**
 * Wraps async route handlers to catch errors and pass them to error middleware
 * Usage: router.get('/path', asyncHandler(asyncFunction))
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
