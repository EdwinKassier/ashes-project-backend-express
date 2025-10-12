import { Sequelize } from 'sequelize';
import config from '../shared/config/app.config.js';
import { logger } from '../shared/utils/logger.js';

let sequelize;

/**
 * Load all models
 */
async function loadModels(sequelizeInstance) {
  const { default: Result } = await import('./models/result.model.js');
  const { default: OpeningAverage } = await import('./models/opening-average.model.js');
  const { default: QueryLog } = await import('./models/query-log.model.js');

  // Initialize models
  Result.init(sequelizeInstance);
  OpeningAverage.init(sequelizeInstance);
  QueryLog.init(sequelizeInstance);

  // Setup associations if needed
  // Result.associate?.(sequelizeInstance.models);
  // OpeningAverage.associate?.(sequelizeInstance.models);

  return sequelizeInstance.models;
}

/**
 * Initialize Sequelize connection
 */
export async function initDatabase() {
  try {
    sequelize = new Sequelize({
      ...config.database,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
      retry: {
        max: 3,
      },
    });

    // Test connection
    await sequelize.authenticate();
    logger.info('Database connection established');

    // Load models
    const models = await loadModels(sequelize);

    // Sync database (only in development)
    if (config.nodeEnv === 'development') {
      await sequelize.sync({ alter: false });
      logger.info('Database synchronized');
    }

    return { sequelize, models };
  } catch (error) {
    logger.error('Unable to connect to database', { error: error.message });
    throw error;
  }
}

/**
 * Get Sequelize instance
 */
export function getSequelize() {
  if (!sequelize) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return sequelize;
}

/**
 * Close database connection
 */
export async function closeDatabase() {
  if (sequelize) {
    await sequelize.close();
    logger.info('Database connection closed');
  }
}
