import cryptoResultRepository from '../repositories/crypto-result.repository.js';
import openingAverageRepository from '../repositories/opening-average.repository.js';
import queryLogRepository from '../repositories/query-log.repository.js';
import { logger } from '../../shared/utils/logger.js';
import type { CryptoAnalysisData } from '../types/crypto.types.js';

/**
 * Cached opening average data structure
 */
interface CachedOpeningAverage {
  symbol: string;
  average: number;
}

/**
 * Service for caching cryptocurrency data
 */
export class CryptoCacheService {
  /**
   * Log a query (for analytics)
   */
  async logQuery(symbol: string, investment: number): Promise<void> {
    try {
      await queryLogRepository.log(symbol, investment);
    } catch (error) {
      // Don't throw - logging should not break the application
      logger.warn('Failed to log query', {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * Check if cached result exists
   */
  async hasResult(symbol: string, investment: number): Promise<boolean> {
    try {
      const result = await cryptoResultRepository.findBySymbolAndInvestment(
        symbol,
        investment
      );
      return result !== null;
    } catch (error) {
      logger.error('Error checking cached result', {
        error: error instanceof Error ? error.message : String(error),
      });
      return false;
    }
  }

  /**
   * Get cached result
   */
  async getResult(
    symbol: string,
    investment: number
  ): Promise<Record<string, unknown> | null> {
    try {
      return await cryptoResultRepository.findBySymbolAndInvestment(symbol, investment);
    } catch (error) {
      logger.error('Error getting cached result', {
        error: error instanceof Error ? error.message : String(error),
      });
      return null;
    }
  }

  /**
   * Save result to cache
   */
  async saveResult(resultData: CryptoAnalysisData): Promise<void> {
    try {
      await cryptoResultRepository.create(resultData);
      logger.info('Result cached successfully', { symbol: resultData.symbol });
    } catch (error) {
      // Don't throw - caching failure should not break the application
      logger.warn('Failed to cache result', {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * Check if opening average exists
   */
  async hasOpeningAverage(symbol: string): Promise<boolean> {
    try {
      return await openingAverageRepository.exists(symbol);
    } catch (error) {
      logger.error('Error checking opening average', {
        error: error instanceof Error ? error.message : String(error),
      });
      return false;
    }
  }

  /**
   * Get opening average
   */
  async getOpeningAverage(symbol: string): Promise<CachedOpeningAverage | null> {
    try {
      return (await openingAverageRepository.findBySymbol(
        symbol
      )) as CachedOpeningAverage | null;
    } catch (error) {
      logger.error('Error getting opening average', {
        error: error instanceof Error ? error.message : String(error),
      });
      return null;
    }
  }

  /**
   * Save opening average
   */
  async saveOpeningAverage(symbol: string, average: number): Promise<void> {
    try {
      await openingAverageRepository.create(symbol, average);
      logger.info('Opening average cached successfully', { symbol });
    } catch (error) {
      // Don't throw - caching failure should not break the application
      logger.warn('Failed to cache opening average', {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
}

export default new CryptoCacheService();
