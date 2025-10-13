import { Sequelize, type ModelStatic, type Model } from 'sequelize';
import config from '../shared/config/app.config.js';
import { logger } from '../shared/utils/logger.js';
import Result from './models/result.model.js';
import OpeningAverage from './models/opening-average.model.js';
import QueryLog from './models/query-log.model.js';

let sequelize: Sequelize | null = null;

interface Models {
  Result: typeof Result;
  OpeningAverage: typeof OpeningAverage;
  QueryLog: typeof QueryLog;
  [key: string]: ModelStatic<Model>;
}

/**
 * Load all models
 */
function loadModels(sequelizeInstance: Sequelize): Models {
  // Initialize models
  Result.initModel(sequelizeInstance);
  OpeningAverage.initModel(sequelizeInstance);
  QueryLog.initModel(sequelizeInstance);

  // Setup associations if needed
  // Result.associate?.(sequelizeInstance.models);
  // OpeningAverage.associate?.(sequelizeInstance.models);

  return sequelizeInstance.models as unknown as Models;
}

/**
 * Initialize Sequelize connection
 */
export async function initDatabase(): Promise<{
  sequelize: Sequelize;
  models: Models;
}> {
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
    const models = loadModels(sequelize);

    // Sync database (only in development)
    if (config.nodeEnv === 'development') {
      await sequelize.sync({ alter: false });
      logger.info('Database synchronized');
    }

    logger.info('Database initialized');

    return { sequelize, models };
  } catch (error) {
    logger.error('Unable to connect to database', {
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}

/**
 * Get Sequelize instance
 */
export function getSequelize(): Sequelize {
  if (!sequelize) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return sequelize;
}

/**
 * Close database connection
 */
export async function closeDatabase(): Promise<void> {
  if (sequelize) {
    await sequelize.close();
    logger.info('Database connection closed');
  }
}
