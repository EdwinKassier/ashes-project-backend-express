import cryptoAnalysisService from '../../services/crypto-analysis.service.js';
import graphBuilderService from '../../services/graph-builder.service.js';
import { logger } from '../../../shared/utils/logger.js';
import { formatGraphQLError } from '../../../shared/graphql/error-handler.js';
import type { GraphQLContext, ResolverFn } from '../../../shared/graphql/types.js';
import type { CryptoAnalysisData } from '../../types/crypto.types.js';

// ============================================================================
// Resolver Argument Types (exported for module resolution)
// ============================================================================

export interface ProcessRequestArgs {
  symbol: string;
  investment: number;
}

export interface CryptoAnalysisArgs {
  input: {
    symbol: string;
    investment: number;
  };
}

export interface GraphDataArgs {
  symbol: string;
}

// ============================================================================
// Response Types (exported for module resolution)
// ============================================================================

/**
 * Graph data point type matching the actual service output.
 * Note: x is a string (timestamp) from the graph builder service.
 */
export interface GraphDataPoint {
  x: string;
  y: number;
}

export interface ProcessRequestResult {
  result: CryptoAnalysisData | null;
  graphData: GraphDataPoint[] | null;
  error: string | null;
}

// ============================================================================
// Resolvers
// ============================================================================

/**
 * Main resolver matching /process_request endpoint behavior.
 * Maintains backward compatibility with legacy clients.
 */
const processRequest: ResolverFn<ProcessRequestArgs, ProcessRequestResult> = async (
  { symbol, investment },
  _context: GraphQLContext
) => {
  try {
    // Input validation (mirrors legacy endpoint)
    if (!symbol || symbol.trim() === '') {
      return {
        result: null,
        graphData: null,
        error: "Symbol doesn't exist",
      };
    }

    if (!investment || Number.isNaN(investment) || investment <= 0) {
      return {
        result: null,
        graphData: null,
        error: 'Invalid investment amount',
      };
    }

    logger.info('GraphQL: Processing crypto analysis request', { symbol, investment });

    // Use existing domain services
    const result = await cryptoAnalysisService.analyzeCrypto(symbol, investment);
    const graphData = (await graphBuilderService.buildGraphData(
      symbol
    )) as GraphDataPoint[];

    return {
      result,
      graphData,
      error: null,
    };
  } catch (error) {
    logger.error('GraphQL: Error in processRequest', {
      symbol,
      investment,
      error: error instanceof Error ? error.message : String(error),
    });

    // Return legacy-compatible error format
    return {
      result: null,
      graphData: null,
      error: "Symbol doesn't exist",
    };
  }
};

/**
 * Standalone crypto analysis resolver.
 * Throws GraphQL errors for proper client handling.
 */
const cryptoAnalysis: ResolverFn<
  CryptoAnalysisArgs,
  CryptoAnalysisData | null
> = async ({ input }, _context: GraphQLContext) => {
  try {
    logger.info('GraphQL: Processing crypto analysis', input);
    return await cryptoAnalysisService.analyzeCrypto(input.symbol, input.investment);
  } catch (error) {
    throw formatGraphQLError(error);
  }
};

/**
 * Standalone graph data resolver.
 */
const graphData: ResolverFn<GraphDataArgs, GraphDataPoint[] | null> = async (
  { symbol },
  _context: GraphQLContext
) => {
  try {
    logger.info('GraphQL: Fetching graph data', { symbol });
    return (await graphBuilderService.buildGraphData(symbol)) as GraphDataPoint[];
  } catch (error) {
    throw formatGraphQLError(error);
  }
};

// ============================================================================
// Export Resolver Map
// ============================================================================

/**
 * Crypto domain resolvers.
 * Add new resolvers here and reference them in the schema.
 */
export const cryptoResolvers = {
  processRequest,
  cryptoAnalysis,
  graphData,
};
