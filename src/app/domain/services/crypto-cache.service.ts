// @ts-nocheck
import cryptoResultRepository from '../repositories/crypto-result.repository.js';
import openingAverageRepository from '../repositories/opening-average.repository.js';
import queryLogRepository from '../repositories/query-log.repository.js';
import { logger } from '../../shared/utils/logger.js';

/**
 * Service for caching cryptocurrency data
 */
export class CryptoCacheService {
  /**
   * Log a query (for analytics)
   */
  async logQuery(symbol, investment) {
    try {
      await queryLogRepository.log(symbol, investment);
    } catch (error) {
      // Don't throw - logging should not break the application
      logger.warn('Failed to log query', { error: error.message });
    }
  }

  /**
   * Check if cached result exists
   */
  async hasResult(symbol, investment) {
    try {
      const result = await cryptoResultRepository.findBySymbolAndInvestment(
        symbol,
        investment
      );
      return result !== null;
    } catch (error) {
      logger.error('Error checking cached result', { error: error.message });
      return false;
    }
  }

  /**
   * Get cached result
   */
  async getResult(symbol, investment) {
    try {
      return await cryptoResultRepository.findBySymbolAndInvestment(symbol, investment);
    } catch (error) {
      logger.error('Error getting cached result', { error: error.message });
      return null;
    }
  }

  /**
   * Save result to cache
   */
  async saveResult(resultData) {
    try {
      await cryptoResultRepository.create(resultData);
      logger.info('Result cached successfully', { symbol: resultData.symbol });
    } catch (error) {
      // Don't throw - caching failure should not break the application
      logger.warn('Failed to cache result', { error: error.message });
    }
  }

  /**
   * Check if opening average exists
   */
  async hasOpeningAverage(symbol) {
    try {
      return await openingAverageRepository.exists(symbol);
    } catch (error) {
      logger.error('Error checking opening average', { error: error.message });
      return false;
    }
  }

  /**
   * Get opening average
   */
  async getOpeningAverage(symbol) {
    try {
      return await openingAverageRepository.findBySymbol(symbol);
    } catch (error) {
      logger.error('Error getting opening average', { error: error.message });
      return null;
    }
  }

  /**
   * Save opening average
   */
  async saveOpeningAverage(symbol, average) {
    try {
      await openingAverageRepository.create(symbol, average);
      logger.info('Opening average cached successfully', { symbol });
    } catch (error) {
      // Don't throw - caching failure should not break the application
      logger.warn('Failed to cache opening average', { error: error.message });
    }
  }
}

export default new CryptoCacheService();
