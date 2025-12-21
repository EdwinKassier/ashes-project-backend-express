import * as dataForge from 'data-forge';
import config from '../../shared/config/app.config.js';
import { logger } from '../../shared/utils/logger.js';
import {
  ExternalAPIException,
  DataProcessingException,
} from '../exceptions/crypto.exceptions.js';
import { CRYPTO_CONSTANTS } from '../constants.js';

/**
 * Price data point from processed OHLC data
 */
export interface PriceDataPoint {
  closeTime: string;
  closePrice: number;
}

/**
 * Kraken API response structure
 */
interface KrakenApiResponse {
  error: string[];
  result: Record<string, unknown[][]>;
}

/**
 * DataFrame row structure after processing
 */
interface DataFrameRow {
  CloseTime: string;
  ClosePrice: number;
}

/**
 * Service for fetching and processing cryptocurrency data from external APIs
 */
export class CryptoDataService {
  /**
   * Check if symbol exists on Kraken exchange
   */
  async checkSymbolExists(symbol: string): Promise<boolean> {
    try {
      const url = `${config.krakenApiUrl}/OHLC?pair=${symbol}USD&interval=21600&since=1548111600`;
      const response = await fetch(url);
      const data = (await response.json()) as KrakenApiResponse;

      if (data.error && data.error.length > 0) {
        logger.debug('Symbol check failed', { symbol, error: data.error });
        return false;
      }

      return true;
    } catch (error) {
      logger.error('Error checking symbol existence', {
        symbol,
        error: error instanceof Error ? error.message : String(error),
      });
      throw new ExternalAPIException(
        'Failed to check symbol',
        error instanceof Error ? error : null
      );
    }
  }

  /**
   * Fetch historical data for symbol
   */
  async fetchHistoricalData(symbol: string): Promise<PriceDataPoint[]> {
    try {
      const url = `${config.krakenApiUrl}/OHLC?pair=${symbol}USD&interval=21600&since=1548111600`;
      const response = await fetch(url);
      const data = (await response.json()) as KrakenApiResponse;

      if (!response.ok || (data.error && data.error.length > 0)) {
        throw new Error(data.error?.join(', ') || 'API request failed');
      }

      return this.convertToDataFrame(data);
    } catch (error) {
      logger.error('Error fetching historical data', {
        symbol,
        error: error instanceof Error ? error.message : String(error),
      });
      throw new ExternalAPIException(
        `Failed to fetch historical data for ${symbol}`,
        error instanceof Error ? error : null
      );
    }
  }

  /**
   * Fetch current price data
   */
  async fetchCurrentData(symbol: string): Promise<PriceDataPoint[]> {
    try {
      const url = `${config.krakenApiUrl}/OHLC?pair=${symbol}USD&interval=21600&since=1548111600`;
      const response = await fetch(url);
      const data = (await response.json()) as KrakenApiResponse;

      if (!response.ok || (data.error && data.error.length > 0)) {
        throw new Error(data.error?.join(', ') || 'API request failed');
      }

      return this.convertToDataFrame(data);
    } catch (error) {
      logger.error('Error fetching current data', {
        symbol,
        error: error instanceof Error ? error.message : String(error),
      });
      throw new ExternalAPIException(
        `Failed to fetch current data for ${symbol}`,
        error instanceof Error ? error : null
      );
    }
  }

  /**
   * Convert API response to data frame
   */
  convertToDataFrame(apiResponse: KrakenApiResponse): PriceDataPoint[] {
    try {
      // Find the key that contains USD
      const usdKey = Object.keys(apiResponse.result).find((key) => key.includes('USD'));

      if (!usdKey) {
        throw new Error('No USD pair found in response');
      }

      const targetData = apiResponse.result[usdKey];
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
      const df = new dataForge.DataFrame(targetData);

      // Rename columns
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
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
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const processedDf = renamedDf.generateSeries({
        CloseTime: (row: Record<string, string>) =>
          new Date(parseInt(row.CloseTime, 10) * 1000).toISOString(),
        ClosePrice: (row: Record<string, string>) => parseFloat(row.ClosePrice),
      });

      // Convert to array of objects for easier manipulation
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      const rawArray = processedDf.toArray() as unknown as DataFrameRow[];
      const dataArray: PriceDataPoint[] = rawArray.map((row) => ({
        closeTime: row.CloseTime,
        closePrice: row.ClosePrice,
      }));

      return dataArray;
    } catch (error) {
      logger.error('Error converting data to DataFrame', {
        error: error instanceof Error ? error.message : String(error),
      });
      throw new DataProcessingException(
        `Failed to process market data: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Calculate average price from data array
   */
  calculateAverage(dataArray: PriceDataPoint[]): number {
    if (!dataArray || dataArray.length === 0) {
      throw new DataProcessingException('No data to calculate average');
    }

    const sum = dataArray.reduce((acc, item) => acc + item.closePrice, 0);
    return sum / dataArray.length;
  }
}

export default new CryptoDataService();
