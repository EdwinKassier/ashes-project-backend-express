import cryptoDataService from './crypto-data.service.js';
import cryptoCacheService from './crypto-cache.service.js';
import { logger } from '../../shared/utils/logger.js';
import { SymbolNotFoundException } from '../exceptions/crypto.exceptions.js';
import { CRYPTO_CONSTANTS } from '../constants.js';
import type {
  CryptoAnalysisData,
  ICryptoAnalysisService,
} from '../types/crypto.types.js';

/**
 * Main service for cryptocurrency investment analysis
 */
export class CryptoAnalysisService implements ICryptoAnalysisService {
  /**
   * Analyze cryptocurrency investment returns
   * @param symbol - Cryptocurrency symbol
   * @param investment - Investment amount
   * @returns Analysis result with profit calculations
   */
  async analyzeCrypto(symbol: string, investment: number): Promise<CryptoAnalysisData> {
    try {
      // Log the query for analytics
      await cryptoCacheService.logQuery(symbol, investment);

      // Check if symbol exists on exchange
      const symbolExists = await cryptoDataService.checkSymbolExists(symbol);
      if (!symbolExists) {
        throw new SymbolNotFoundException(symbol);
      }

      logger.info('Starting crypto analysis', { symbol, investment });

      // Get or calculate opening average price
      let averageStartPrice: number;
      const hasCache = await cryptoCacheService.hasOpeningAverage(symbol);

      if (hasCache) {
        logger.debug('Using cached opening average', { symbol });
        const cachedAverage = await cryptoCacheService.getOpeningAverage(symbol);
        averageStartPrice = cachedAverage?.average ?? 0;
      } else {
        logger.debug('Calculating new opening average', { symbol });
        const historicalData = await cryptoDataService.fetchHistoricalData(symbol);

        // Take first 4 data points (approximately first month)
        const startPeriodData = historicalData.slice(0, 4);
        averageStartPrice = cryptoDataService.calculateAverage(startPeriodData);

        // Cache the opening average for future use
        await cryptoCacheService.saveOpeningAverage(symbol, averageStartPrice);
      }

      // Get current price data
      const currentData = await cryptoDataService.fetchCurrentData(symbol);
      const averageEndPrice = cryptoDataService.calculateAverage(currentData);

      // Calculate investment returns
      const result = this.calculateInvestmentReturn(
        investment,
        averageStartPrice,
        averageEndPrice,
        symbol
      );

      // Cache the result
      await cryptoCacheService.saveResult(result);

      logger.info('Crypto analysis completed', {
        symbol,
        investment,
        profit: result.profit,
      });

      return result;
    } catch (error) {
      if (error instanceof SymbolNotFoundException) {
        throw error;
      }
      logger.error('Error analyzing crypto', {
        symbol,
        investment,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  /**
   * Calculate investment return metrics
   * @private
   */
  calculateInvestmentReturn(
    investment: number,
    startPrice: number,
    endPrice: number,
    symbol: string
  ): CryptoAnalysisData {
    const numberOfCoins = investment / startPrice;
    const currentValue = numberOfCoins * endPrice;
    const profit = parseFloat((currentValue - investment).toFixed(2));
    const growthFactor = parseFloat((profit / investment).toFixed(2));
    const lambos = parseFloat((profit / CRYPTO_CONSTANTS.LAMBO_PRICE).toFixed(2));

    return {
      symbol,
      investment,
      numberOfCoins: parseFloat(numberOfCoins.toFixed(8)),
      profit,
      growthFactor,
      lambos,
      generatedAt: new Date().toISOString(),
    };
  }
}

export default new CryptoAnalysisService();
