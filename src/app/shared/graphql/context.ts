import type { Request, Response } from 'express';
import type { GraphQLContext } from './types.js';

/**
 * Create GraphQL execution context from Express request.
 *
 * Extend this to add:
 * - Authentication (extract user from JWT)
 * - Request tracing (add correlation ID)
 * - Database connections
 * - Feature flags
 *
 * @example Adding authentication:
 * ```typescript
 * export function createContext(req: Request, res: Response): GraphQLContext {
 *   const token = req.headers.authorization?.replace('Bearer ', '');
 *   const user = token ? verifyToken(token) : undefined;
 *   return { req, res, user };
 * }
 * ```
 */
export function createContext(req: Request, res: Response): GraphQLContext {
  return {
    req,
    res,
  };
}
