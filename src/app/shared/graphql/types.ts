import type { Request, Response } from 'express';

/**
 * GraphQL execution context passed to all resolvers.
 * Extend this interface when adding authentication, tracing, etc.
 *
 * @example Adding authentication:
 * ```typescript
 * export interface GraphQLContext {
 *   req: Request;
 *   res: Response;
 *   user?: AuthenticatedUser;  // Add auth info
 *   requestId: string;         // Add tracing
 * }
 * ```
 */
export interface GraphQLContext {
  req: Request;
  res: Response;
  // Index signature required for graphql-http compatibility
  [key: string]: unknown;
}

/**
 * Generic resolver function signature.
 * Args type should match GraphQL schema arguments.
 */
export type ResolverFn<TArgs, TResult> = (
  args: TArgs,
  context: GraphQLContext
) => Promise<TResult> | TResult;

/**
 * Resolver map type for type safety.
 * Keys are query/mutation names, values are resolver functions.
 */
export interface ResolverMap {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: ResolverFn<any, any>;
}

/**
 * GraphQL configuration options
 */
export interface GraphQLConfig {
  /** Enable GraphiQL IDE */
  enableGraphiQL: boolean;
  /** GraphQL endpoint path */
  endpoint: string;
  /** GraphiQL endpoint path */
  graphiqlEndpoint: string;
  /** Enable introspection (disable in production for security) */
  enableIntrospection: boolean;
}
