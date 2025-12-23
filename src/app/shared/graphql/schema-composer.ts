import { buildSchema, type GraphQLSchema } from 'graphql';

/**
 * Compose multiple schema definition strings into a single schema.
 *
 * This enables modular schema design where each domain defines its own types,
 * and they're merged at startup.
 *
 * @example Adding a new domain:
 * ```typescript
 * // In domain/graphql/schemas/user.schema.ts
 * export const userTypeDefs = `
 *   type User {
 *     id: ID!
 *     email: String!
 *   }
 *
 *   extend type Query {
 *     user(id: ID!): User
 *   }
 * `;
 *
 * // In schema-composer usage:
 * const schema = composeSchema([baseTypeDefs, cryptoTypeDefs, userTypeDefs]);
 * ```
 */
export function composeSchema(typeDefs: string[]): GraphQLSchema {
  const mergedTypeDefs = typeDefs.join('\n');
  return buildSchema(mergedTypeDefs);
}

/**
 * Base type definitions shared across all domains.
 * Provides common patterns for consistency.
 */
export const baseTypeDefs = `
  """
  Standard error type for consistent error handling
  """
  type Error {
    message: String!
    code: String!
  }

  """
  Standard response wrapper for operations that may fail
  """
  interface Response {
    success: Boolean!
    error: Error
  }

  """
  Pagination input for list queries
  """
  input PaginationInput {
    page: Int = 1
    limit: Int = 20
  }

  """
  Pagination metadata for list responses
  """
  type PageInfo {
    currentPage: Int!
    totalPages: Int!
    totalItems: Int!
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
  }

  """
  Root Query type - extended by domain schemas
  """
  type Query {
    """
    API health check for GraphQL layer
    """
    _health: String!
  }

  """
  Root Mutation type - extended by domain schemas
  """
  type Mutation {
    """
    Placeholder to allow extension
    """
    _noop: Boolean
  }
`;

/**
 * Base resolvers for shared types
 */
export const baseResolvers = {
  _health: (): string => 'GraphQL API is healthy',
  _noop: (): boolean => true,
};
