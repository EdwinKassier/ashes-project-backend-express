import * as dataForge from 'data-forge';
import config from '../../shared/config/app.config.js';
import { logger } from '../../shared/utils/logger.js';
import {
  ExternalAPIException,
  DataProcessingException,
} from '../exceptions/crypto.exceptions.js';
import { CRYPTO_CONSTANTS } from '../constants.js';

/**
 * Service for fetching and processing cryptocurrency data from external APIs
 */
export class CryptoDataService {
  /**
   * Check if symbol exists on Kraken exchange
   */
  async checkSymbolExists(symbol) {
    try {
      const url = `${config.krakenApiUrl}/OHLC?pair=${symbol}USD&interval=21600&since=1548111600`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.error && data.error.length > 0) {
        logger.debug('Symbol check failed', { symbol, error: data.error });
        return false;
      }

      return true;
    } catch (error) {
      logger.error('Error checking symbol existence', {
        symbol,
        error: error.message,
      });
      throw new ExternalAPIException('Failed to check symbol', error);
    }
  }

  /**
   * Fetch historical data for symbol
   */
  async fetchHistoricalData(symbol) {
    try {
      const url = `${config.krakenApiUrl}/OHLC?pair=${symbol}USD&interval=21600&since=1548111600`;
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok || (data.error && data.error.length > 0)) {
        throw new Error(data.error?.join(', ') || 'API request failed');
      }

      return this.convertToDataFrame(data);
    } catch (error) {
      logger.error('Error fetching historical data', {
        symbol,
        error: error.message,
      });
      throw new ExternalAPIException(
        `Failed to fetch historical data for ${symbol}`,
        error
      );
    }
  }

  /**
   * Fetch current price data
   */
  async fetchCurrentData(symbol) {
    try {
      const url = `${config.krakenApiUrl}/OHLC?pair=${symbol}USD&interval=21600&since=1548111600`;
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok || (data.error && data.error.length > 0)) {
        throw new Error(data.error?.join(', ') || 'API request failed');
      }

      return this.convertToDataFrame(data);
    } catch (error) {
      logger.error('Error fetching current data', {
        symbol,
        error: error.message,
      });
      throw new ExternalAPIException(
        `Failed to fetch current data for ${symbol}`,
        error
      );
    }
  }

  /**
   * Convert API response to data frame
   */
  convertToDataFrame(apiResponse) {
    try {
      // Find the key that contains USD
      const usdKey = Object.keys(apiResponse.result).find((key) => key.includes('USD'));

      if (!usdKey) {
        throw new Error('No USD pair found in response');
      }

      const targetData = apiResponse.result[usdKey];
      const df = new dataForge.DataFrame(targetData);

      // Rename columns
      const renamedDf = df.renameSeries({
        0: CRYPTO_CONSTANTS.DATAFRAME_COLUMNS.CLOSE_TIME,
        1: CRYPTO_CONSTANTS.DATAFRAME_COLUMNS.OPEN_PRICE,
        2: CRYPTO_CONSTANTS.DATAFRAME_COLUMNS.HIGH_PRICE,
        3: CRYPTO_CONSTANTS.DATAFRAME_COLUMNS.LOW_PRICE,
        4: CRYPTO_CONSTANTS.DATAFRAME_COLUMNS.CLOSE_PRICE,
        5: CRYPTO_CONSTANTS.DATAFRAME_COLUMNS.VWAP,
        6: CRYPTO_CONSTANTS.DATAFRAME_COLUMNS.VOLUME,
        7: CRYPTO_CONSTANTS.DATAFRAME_COLUMNS.COUNT,
      });

      // Generate proper dates and parse prices
      const processedDf = renamedDf.generateSeries({
        CloseTime: (row) => new Date(parseInt(row.CloseTime, 10) * 1000).toISOString(),
        ClosePrice: (row) => parseFloat(row.ClosePrice),
      });

      // Convert to array of objects for easier manipulation
      const dataArray = processedDf.toArray().map((row) => ({
        closeTime: row.CloseTime,
        closePrice: row.ClosePrice,
      }));

      return dataArray;
    } catch (error) {
      logger.error('Error converting data to DataFrame', {
        error: error.message,
      });
      throw new DataProcessingException(
        `Failed to process market data: ${error.message}`
      );
    }
  }

  /**
   * Calculate average price from data array
   */
  calculateAverage(dataArray) {
    if (!dataArray || dataArray.length === 0) {
      throw new DataProcessingException('No data to calculate average');
    }

    const sum = dataArray.reduce((acc, item) => acc + item.closePrice, 0);
    return sum / dataArray.length;
  }
}

export default new CryptoDataService();
