import type { Request, Response } from 'express';
import { Router } from 'express';
import cryptoRoutes from './domain/routes/crypto.routes.js';
import { graphqlRouter } from './domain/graphql/index.js';
import { healthCheck, readinessCheck } from './shared/middleware/health.middleware.js';

const router: Router = Router();

/**
 * Health check endpoints
 */
router.get('/health', healthCheck);
router.get('/ready', readinessCheck);

/**
 * GraphQL API
 * Endpoint: POST /graphql
 * IDE: GET /graphiql (development only)
 */
router.use(graphqlRouter);

/**
 * Legacy routes (backward compatibility)
 */
router.use('/', cryptoRoutes);

/**
 * API version 1 routes
 */
router.use('/api/v1/crypto', cryptoRoutes);

/**
 * API information endpoint
 */
router.get('/api', (_req: Request, res: Response) => {
  res.json({
    message: 'DWML Backend Express API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      ready: '/ready',
      graphql: '/graphql',
      graphiql: '/graphiql',
      v1: {
        crypto: '/api/v1/crypto',
      },
      legacy: {
        processRequest: '/process_request',
      },
    },
  });
});

export default router;
