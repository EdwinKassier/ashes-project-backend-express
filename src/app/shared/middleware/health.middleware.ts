// @ts-nocheck
import { getSequelize } from '../../database/sequelize.js';
import config from '../config/app.config.js';

/**
 * Health check endpoint
 */
export const healthCheck = (req, res) => {
  const health = {
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    status: 'healthy',
    service: 'dwml-backend-express',
    version: process.env.npm_package_version || '1.0.0',
    environment: config.nodeEnv,
  };

  res.status(200).json(health);
};

/**
 * Readiness check endpoint (checks dependencies)
 */
export const readinessCheck = async (req, res) => {
  try {
    // Check database connection
    const sequelize = getSequelize();
    await sequelize.authenticate();

    res.status(200).json({
      status: 'ready',
      timestamp: new Date().toISOString(),
      checks: {
        database: 'connected',
      },
    });
  } catch (error) {
    res.status(503).json({
      status: 'not ready',
      timestamp: new Date().toISOString(),
      error: error.message,
    });
  }
};
