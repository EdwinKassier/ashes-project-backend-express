import type { Application } from 'express';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import compression from 'compression';
import router from './router.js';
import {
  errorHandler,
  notFoundHandler,
} from './shared/middleware/error-handler.middleware.js';
import { securityMiddleware } from './shared/middleware/security.middleware.js';
import { apiLimiter } from './shared/middleware/rate-limit.middleware.js';
import { corsOptions } from './shared/middleware/cors.middleware.js';
import { morganStream } from './shared/utils/logger.js';
import config from './shared/config/app.config.js';

/**
 * Create and configure Express application
 */
export function createApp(): Application {
  const app = express();

  // 1. SECURITY - First (before any other middleware)
  app.use(helmet());
  app.use(securityMiddleware);

  // 2. CORS - Early
  app.use(cors(corsOptions));

  // 3. COMPRESSION - Before body parsing
  app.use(compression());

  // 4. LOGGING - Before routes
  if (config.nodeEnv !== 'test') {
    app.use(morgan('combined', { stream: morganStream }));
  }

  // 5. BODY PARSING
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // 6. TRUST PROXY (if behind reverse proxy)
  if (config.nodeEnv === 'production') {
    app.set('trust proxy', 1);
  }

  // 7. RATE LIMITING (on API routes only)
  app.use('/api', apiLimiter);

  // 8. ROUTES
  app.use(router);

  // 9. 404 HANDLER - After all routes
  app.use(notFoundHandler);

  // 10. ERROR HANDLER - Last middleware (MUST have 4 parameters)
  app.use(errorHandler);

  return app;
}
