/**
 * Shared GraphQL Infrastructure
 *
 * This module provides framework-level GraphQL utilities that can be
 * copied to new projects unchanged. Domain-specific schemas and resolvers
 * live in src/app/domain/graphql/.
 *
 * @example Usage:
 * ```typescript
 * import { createGraphQLRouter, composeSchema, baseTypeDefs } from './shared/graphql/index.js';
 * ```
 */

export { createGraphQLRouter } from './handler.js';
export { composeSchema, baseTypeDefs, baseResolvers } from './schema-composer.js';
export { createContext } from './context.js';
export { formatGraphQLError, GraphQLErrorCode } from './error-handler.js';
export type {
  GraphQLContext,
  ResolverFn,
  ResolverMap,
  GraphQLConfig,
} from './types.js';
