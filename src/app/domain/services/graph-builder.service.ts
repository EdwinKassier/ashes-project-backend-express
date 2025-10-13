// @ts-nocheck
import cryptoDataService from './crypto-data.service.js';
import { logger } from '../../shared/utils/logger.js';
import { SymbolNotFoundException } from '../exceptions/crypto.exceptions.js';

/**
 * Service for building graph data for frontend visualization
 */
export class GraphBuilderService {
  /**
   * Build graph data for a cryptocurrency symbol
   */
  async buildGraphData(symbol) {
    try {
      // Check if symbol exists
      const symbolExists = await cryptoDataService.checkSymbolExists(symbol);
      if (!symbolExists) {
        throw new SymbolNotFoundException(symbol);
      }

      // Fetch historical data
      const historicalData = await cryptoDataService.fetchHistoricalData(symbol);

      // Transform data for frontend (x, y coordinates)
      const graphData = historicalData.map((item) => ({
        x: item.closeTime,
        y: item.closePrice,
      }));

      logger.info('Graph data built successfully', {
        symbol,
        dataPoints: graphData.length,
      });

      return graphData;
    } catch (error) {
      if (error instanceof SymbolNotFoundException) {
        throw error;
      }
      logger.error('Error building graph data', {
        symbol,
        error: error.message,
      });
      throw error;
    }
  }
}

export default new GraphBuilderService();
