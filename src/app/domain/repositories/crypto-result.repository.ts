import type { ModelStatic } from 'sequelize';
import { getSequelize } from '../../database/sequelize';
import { logger } from '../../shared/utils/logger';
import type Result from '../../database/models/result.model';

interface ResultData {
  symbol: string;
  investment: number;
  numberOfCoins: number;
  profit: number;
  growthFactor: number;
  lambos: number;
}

/**
 * Repository for crypto analysis results
 */
export class CryptoResultRepository {
  private Result: ModelStatic<Result> | null = null;

  /**
   * Initialize repository with models
   */
  private init(): void {
    const sequelize = getSequelize();
    this.Result = sequelize.models.Result as ModelStatic<Result>;
  }

  /**
   * Find existing result by symbol and investment
   */
  async findBySymbolAndInvestment(
    symbol: string,
    investment: number
  ): Promise<Record<string, unknown> | null> {
    if (!this.Result) this.init();

    try {
      const result = await this.Result!.findOne({
        where: { symbol, investment },
      });
      return result ? (result.toJSON() as unknown as Record<string, unknown>) : null;
    } catch (error) {
      logger.error('Error finding result', {
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  /**
   * Create new result
   */
  async create(resultData: ResultData): Promise<Record<string, unknown>> {
    if (!this.Result) this.init();

    try {
      const result = await this.Result!.create({
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
      return result.toJSON() as unknown as Record<string, unknown>;
    } catch (error) {
      logger.error('Error creating result', {
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  /**
   * Find all results for a symbol
   */
  async findBySymbol(symbol: string): Promise<Record<string, unknown>[]> {
    if (!this.Result) this.init();

    try {
      const results = await this.Result!.findAll({
        where: { symbol },
        order: [['createdAt', 'DESC']],
      });
      return results.map((r) => r.toJSON() as unknown as Record<string, unknown>);
    } catch (error) {
      logger.error('Error finding results by symbol', {
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }
}

export default new CryptoResultRepository();
