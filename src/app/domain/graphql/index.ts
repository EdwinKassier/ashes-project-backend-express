import {
  composeSchema,
  baseTypeDefs,
  baseResolvers,
  createGraphQLRouter,
} from '../../shared/graphql/index.js';
import { cryptoTypeDefs } from './schemas/crypto.schema.js';
import { cryptoResolvers } from './resolvers/crypto.resolver.js';

/**
 * Compose all domain schemas into final schema.
 *
 * To add a new domain:
 * 1. Import its typeDefs from schemas/
 * 2. Add to the array below
 * 3. Import and spread its resolvers
 */
const schema = composeSchema([
  baseTypeDefs,
  cryptoTypeDefs,
  // Add new domain schemas here:
  // userTypeDefs,
  // orderTypeDefs,
]);

/**
 * Combined resolvers from all domains
 */
const resolvers = {
  ...baseResolvers,
  ...cryptoResolvers,
  // Add new domain resolvers here:
  // ...userResolvers,
  // ...orderResolvers,
};

/**
 * Pre-configured GraphQL router ready for use in main router.
 *
 * @example In router.ts:
 * ```typescript
 * import { graphqlRouter } from './domain/graphql/index.js';
 * router.use(graphqlRouter);
 * ```
 */
export const graphqlRouter = createGraphQLRouter(schema, resolvers);

// Named exports for testing and advanced usage
export { schema, resolvers };
export { cryptoTypeDefs } from './schemas/crypto.schema.js';
export { cryptoResolvers } from './resolvers/crypto.resolver.js';
