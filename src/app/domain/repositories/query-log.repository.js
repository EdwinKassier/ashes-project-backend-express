import { getSequelize } from '../../database/sequelize.js';
import { logger } from '../../shared/utils/logger.js';

/**
 * Repository for query logging
 */
export class QueryLogRepository {
  constructor() {
    this.QueryLog = null;
  }

  /**
   * Initialize repository with models
   */
  init() {
    const sequelize = getSequelize();
    this.QueryLog = sequelize.models.QueryLog;
  }

  /**
   * Log a query
   */
  async log(symbol, investment) {
    if (!this.QueryLog) this.init();

    try {
      const log = await this.QueryLog.create({
        symbol,
        investment,
        generationDate: new Date(),
      });
      logger.debug('Query logged', { symbol, investment });
      return log.toJSON();
    } catch (error) {
      // Don't throw - logging should not break the application
      logger.error('Error logging query', { error: error.message });
    }
  }

  /**
   * Get query statistics
   */
  async getStats() {
    if (!this.QueryLog) this.init();

    try {
      const totalQueries = await this.QueryLog.count();
      const uniqueSymbols = await this.QueryLog.count({
        distinct: true,
        col: 'symbol',
      });

      return {
        totalQueries,
        uniqueSymbols,
      };
    } catch (error) {
      logger.error('Error getting query stats', { error: error.message });
      throw error;
    }
  }
}

export default new QueryLogRepository();
