import type { ModelStatic } from 'sequelize';
import { getSequelize } from '../../database/sequelize.js';
import { logger } from '../../shared/utils/logger.js';
import type OpeningAverage from '../../database/models/opening-average.model.js';

/**
 * Repository for opening average data
 */
export class OpeningAverageRepository {
  private OpeningAverage: ModelStatic<OpeningAverage> | null = null;

  /**
   * Initialize repository with models
   */
  private init(): void {
    const sequelize = getSequelize();
    this.OpeningAverage = sequelize.models
      .OpeningAverage as ModelStatic<OpeningAverage>;
  }

  /**
   * Find opening average by symbol
   */
  async findBySymbol(symbol: string): Promise<Record<string, unknown> | null> {
    if (!this.OpeningAverage) this.init();

    try {
      const openingAverage = await this.OpeningAverage!.findOne({
        where: { symbol },
      });
      return openingAverage
        ? (openingAverage.toJSON() as unknown as Record<string, unknown>)
        : null;
    } catch (error) {
      logger.error('Error finding opening average', {
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  /**
   * Check if opening average exists for symbol
   */
  async exists(symbol: string): Promise<boolean> {
    if (!this.OpeningAverage) this.init();

    try {
      const count = await this.OpeningAverage!.count({
        where: { symbol },
      });
      return count > 0;
    } catch (error) {
      logger.error('Error checking opening average existence', {
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  /**
   * Create new opening average
   */
  async create(symbol: string, average: number): Promise<Record<string, unknown>> {
    if (!this.OpeningAverage) this.init();

    try {
      const openingAverage = await this.OpeningAverage!.create({
        symbol,
        average,
        generationDate: new Date(),
      });
      logger.info('Opening average saved to database', { symbol });
      return openingAverage.toJSON() as unknown as Record<string, unknown>;
    } catch (error) {
      logger.error('Error creating opening average', {
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  /**
   * Update existing opening average
   */
  async update(symbol: string, average: number): Promise<void> {
    if (!this.OpeningAverage) this.init();

    try {
      await this.OpeningAverage!.update(
        { average, generationDate: new Date() },
        { where: { symbol } }
      );
      logger.info('Opening average updated', { symbol });
    } catch (error) {
      logger.error('Error updating opening average', {
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }
}

export default new OpeningAverageRepository();
