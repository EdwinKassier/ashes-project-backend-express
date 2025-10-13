// @ts-nocheck
import { Router } from 'express';
import cryptoRoutes from './domain/routes/crypto.routes.js';
import { healthCheck, readinessCheck } from './shared/middleware/health.middleware.js';

const router = Router();

/**
 * Health check endpoints
 */
router.get('/health', healthCheck);
router.get('/ready', readinessCheck);

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
router.get('/api', (req, res) => {
  res.json({
    message: 'DWML Backend Express API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      ready: '/ready',
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
