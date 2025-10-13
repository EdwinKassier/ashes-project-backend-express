// @ts-nocheck
import http from 'http';
import { createApp } from './app.js';
import { initDatabase, closeDatabase } from './database/sequelize.js';
import { logger } from './shared/utils/logger.js';
import config from './shared/config/app.config.js';

let server;

/**
 * Stop server gracefully
 */
async function stopServer() {
  if (!server) return;

  logger.info('Shutting down server...');

  return new Promise((resolve) => {
    server.close(async () => {
      logger.info('HTTP server closed');
      await closeDatabase();
      resolve();
    });

    // Force close after 10 seconds
    setTimeout(() => {
      logger.warn('Forcing server shutdown');
      resolve();
    }, 10000);
  });
}

/**
 * Setup graceful shutdown handlers
 */
function setupGracefulShutdown() {
  const signals = ['SIGTERM', 'SIGINT'];

  signals.forEach((signal) => {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    process.on(signal, async () => {
      logger.info(`${signal} received`);
      await stopServer();
      process.exit(0);
    });
  });

  // Handle uncaught errors
  process.on('uncaughtException', (error) => {
    logger.error('Uncaught exception', {
      error: error.message,
      stack: error.stack,
    });
    process.exit(1);
  });

  process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled rejection', { reason, promise });
    process.exit(1);
  });
}

/**
 * Start HTTP server
 */
export async function startServer() {
  try {
    // Initialize database
    await initDatabase();
    logger.info('Database initialized');

    // Create Express app
    const app = createApp();

    // Create HTTP server
    server = http.createServer(app);

    // Start listening
    await new Promise((resolve, reject) => {
      server.listen(config.port, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    logger.info({
      message: 'Server started successfully',
      port: config.port,
      env: config.nodeEnv,
      pid: process.pid,
    });

    // Setup graceful shutdown
    setupGracefulShutdown();

    return server;
  } catch (error) {
    logger.error('Failed to start server', { error: error.message });
    process.exit(1);
  }
}
