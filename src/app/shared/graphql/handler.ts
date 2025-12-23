import { Router } from 'express';
import type { Request, Response } from 'express';
import type { GraphQLSchema } from 'graphql';
import { createHandler } from 'graphql-http/lib/use/express';
import { ruruHTML } from 'ruru/server';
import type { GraphQLConfig, ResolverMap } from './types.js';
import config from '../config/app.config.js';

/**
 * Default GraphQL configuration
 */
const defaultConfig: GraphQLConfig = {
  enableGraphiQL: config.nodeEnv !== 'production',
  endpoint: '/graphql',
  graphiqlEndpoint: '/graphiql',
  enableIntrospection: config.nodeEnv !== 'production',
};

/**
 * Create GraphQL router with all endpoints.
 *
 * @param schema - Compiled GraphQL schema
 * @param resolvers - Resolver map
 * @param options - Optional configuration overrides
 *
 * @example Basic usage:
 * ```typescript
 * const router = createGraphQLRouter(schema, resolvers);
 * app.use(router);
 * ```
 *
 * @example With custom config:
 * ```typescript
 * const router = createGraphQLRouter(schema, resolvers, {
 *   endpoint: '/api/v1/graphql',
 *   enableGraphiQL: false,
 * });
 * ```
 */
export function createGraphQLRouter(
  schema: GraphQLSchema,
  resolvers: ResolverMap,
  options: Partial<GraphQLConfig> = {}
): Router {
  const graphqlConfig = { ...defaultConfig, ...options };
  const router = Router();

  // Main GraphQL endpoint
  // Note: graphql-http handles context internally, we pass resolvers via rootValue
  router.all(
    graphqlConfig.endpoint,
    createHandler({
      schema,
      rootValue: resolvers,
    })
  );

  // GraphiQL IDE (development only)
  if (graphqlConfig.enableGraphiQL) {
    router.get(graphqlConfig.graphiqlEndpoint, (_req: Request, res: Response) => {
      res.type('html');
      res.end(ruruHTML({ endpoint: graphqlConfig.endpoint }));
    });
  }

  return router;
}
