import { getSequelize } from '../../database/sequelize.js';
import { logger } from '../../shared/utils/logger.js';

/**
 * Repository for opening average data
 */
export class OpeningAverageRepository {
  constructor() {
    this.OpeningAverage = null;
  }

  /**
   * Initialize repository with models
   */
  init() {
    const sequelize = getSequelize();
    this.OpeningAverage = sequelize.models.OpeningAverage;
  }

  /**
   * Find opening average by symbol
   */
  async findBySymbol(symbol) {
    if (!this.OpeningAverage) this.init();

    try {
      const openingAverage = await this.OpeningAverage.findOne({
        where: { symbol },
      });
      return openingAverage ? openingAverage.toJSON() : null;
    } catch (error) {
      logger.error('Error finding opening average', { error: error.message });
      throw error;
    }
  }

  /**
   * Check if opening average exists for symbol
   */
  async exists(symbol) {
    if (!this.OpeningAverage) this.init();

    try {
      const count = await this.OpeningAverage.count({
        where: { symbol },
      });
      return count > 0;
    } catch (error) {
      logger.error('Error checking opening average existence', {
        error: error.message,
      });
      throw error;
    }
  }

  /**
   * Create new opening average
   */
  async create(symbol, average) {
    if (!this.OpeningAverage) this.init();

    try {
      const openingAverage = await this.OpeningAverage.create({
        symbol,
        average,
        generationDate: new Date(),
      });
      logger.info('Opening average saved to database', { symbol });
      return openingAverage.toJSON();
    } catch (error) {
      logger.error('Error creating opening average', { error: error.message });
      throw error;
    }
  }

  /**
   * Update existing opening average
   */
  async update(symbol, average) {
    if (!this.OpeningAverage) this.init();

    try {
      await this.OpeningAverage.update(
        { average, generationDate: new Date() },
        { where: { symbol } }
      );
      logger.info('Opening average updated', { symbol });
    } catch (error) {
      logger.error('Error updating opening average', { error: error.message });
      throw error;
    }
  }
}

export default new OpeningAverageRepository();
