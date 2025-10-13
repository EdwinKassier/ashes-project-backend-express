import type { ModelStatic } from 'sequelize';
import { getSequelize } from '../../database/sequelize';
import { logger } from '../../shared/utils/logger';
import type QueryLog from '../../database/models/query-log.model';

interface QueryStats {
  totalQueries: number;
  uniqueSymbols: number;
}

/**
 * Repository for query logging
 */
export class QueryLogRepository {
  private QueryLog: ModelStatic<QueryLog> | null = null;

  /**
   * Initialize repository with models
   */
  private init(): void {
    const sequelize = getSequelize();
    this.QueryLog = sequelize.models.QueryLog as ModelStatic<QueryLog>;
  }

  /**
   * Log a query
   */
  async log(
    symbol: string,
    investment: number
  ): Promise<Record<string, unknown> | undefined> {
    if (!this.QueryLog) this.init();

    try {
      const log = await this.QueryLog!.create({
        symbol,
        investment,
        generationDate: new Date(),
      });
      logger.debug('Query logged', { symbol, investment });
      return log.toJSON() as unknown as Record<string, unknown>;
    } catch (error) {
      // Don't throw - logging should not break the application
      logger.error('Error logging query', {
        error: error instanceof Error ? error.message : String(error),
      });
      return undefined;
    }
  }

  /**
   * Get query statistics
   */
  async getStats(): Promise<QueryStats> {
    if (!this.QueryLog) this.init();

    try {
      const totalQueries = await this.QueryLog!.count();
      const uniqueSymbols = await this.QueryLog!.count({
        distinct: true,
        col: 'symbol',
      });

      return {
        totalQueries,
        uniqueSymbols,
      };
    } catch (error) {
      logger.error('Error getting query stats', {
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }
}

export default new QueryLogRepository();
