import cryptoAnalysisService from '../services/crypto-analysis.service.js';
import graphBuilderService from '../services/graph-builder.service.js';
import { successResponse } from '../../shared/utils/response.util.js';
import { logger } from '../../shared/utils/logger.js';

/**
 * Analyze cryptocurrency investment
 * @route GET /api/v1/crypto/analysis
 */
export const analyzeCrypto = async (req, res, next) => {
  try {
    const { symbol, investment } = req.query;

    logger.info('Processing crypto analysis request', { symbol, investment });

    const result = await cryptoAnalysisService.analyzeCrypto(
      symbol,
      parseFloat(investment)
    );

    return successResponse(res, result, 'Analysis completed successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get graph data for cryptocurrency
 * @route GET /api/v1/crypto/graph/:symbol
 */
export const getGraphData = async (req, res, next) => {
  try {
    const { symbol } = req.params;

    logger.info('Processing graph data request', { symbol });

    const graphData = await graphBuilderService.buildGraphData(symbol);

    return successResponse(res, graphData, 'Graph data retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Legacy endpoint for backward compatibility
 * @route GET /process_request
 */
// eslint-disable-next-line @typescript-eslint/require-await, no-unused-vars
export const processRequest = async (req, res, _next) => {
  try {
    const { symbol, investment } = req.query;

    // Handle empty params like the old implementation
    if (!symbol || symbol === '') {
      return res.status(200).json({
        result: "Symbol doesn't exist",
        graph_data: "Symbol doesn't exist",
      });
    }

    if (!investment || investment === '' || Number.isNaN(parseFloat(investment))) {
      return res.status(200).json({
        result: 'Invalid investment amount',
        graph_data: 'Invalid investment amount',
      });
    }

    // Process the request using the new service
    const result = await cryptoAnalysisService.analyzeCrypto(
      symbol,
      parseFloat(investment)
    );
    const graphData = await graphBuilderService.buildGraphData(symbol);

    return res.status(200).json({
      result,
      graph_data: JSON.stringify(graphData),
    });
  } catch (error) {
    // Return error in old format
    return res.status(200).json({
      result: "Symbol doesn't exist",
      graph_data: "Symbol doesn't exist",
    });
  }
};

/**
 * Home/status endpoint
 * @route GET /
 */
// eslint-disable-next-line @typescript-eslint/require-await
export const home = async (req, res) =>
  res.status(200).json({
    result: 'Express server is running',
    status: true,
  });
