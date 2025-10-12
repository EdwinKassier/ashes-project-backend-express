import { getSequelize } from '../../database/sequelize.js';
import { logger } from '../../shared/utils/logger.js';

/**
 * Repository for crypto analysis results
 */
export class CryptoResultRepository {
  constructor() {
    this.Result = null;
  }

  /**
   * Initialize repository with models
   */
  init() {
    const sequelize = getSequelize();
    this.Result = sequelize.models.Result;
  }

  /**
   * Find existing result by symbol and investment
   */
  async findBySymbolAndInvestment(symbol, investment) {
    if (!this.Result) this.init();

    try {
      const result = await this.Result.findOne({
        where: { symbol, investment },
      });
      return result ? result.toJSON() : null;
    } catch (error) {
      logger.error('Error finding result', { error: error.message });
      throw error;
    }
  }

  /**
   * Create new result
   */
  async create(resultData) {
    if (!this.Result) this.init();

    try {
      const result = await this.Result.create({
        query: `${resultData.symbol}-${resultData.investment}`,
        numberOfCoins: resultData.numberOfCoins,
        profit: resultData.profit,
        growthFactor: resultData.growthFactor,
        lambos: resultData.lambos,
        investment: resultData.investment,
        symbol: resultData.symbol,
        generationDate: new Date(),
      });
      logger.info('Result saved to database', { symbol: resultData.symbol });
      return result.toJSON();
    } catch (error) {
      logger.error('Error creating result', { error: error.message });
      throw error;
    }
  }

  /**
   * Find all results for a symbol
   */
  async findBySymbol(symbol) {
    if (!this.Result) this.init();

    try {
      const results = await this.Result.findAll({
        where: { symbol },
        order: [['createdAt', 'DESC']],
      });
      return results.map((r) => r.toJSON());
    } catch (error) {
      logger.error('Error finding results by symbol', { error: error.message });
      throw error;
    }
  }
}

export default new CryptoResultRepository();
