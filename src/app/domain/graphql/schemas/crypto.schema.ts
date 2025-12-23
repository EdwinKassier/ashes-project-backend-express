/**
 * Crypto Domain GraphQL Schema
 *
 * This file defines all GraphQL types and operations for the crypto domain.
 * Note: Uses `extend type Query` to add to the base Query type.
 *
 * To add a new domain:
 * 1. Create new schema file (e.g., user.schema.ts)
 * 2. Define types and extend Query/Mutation
 * 3. Add to composeSchema() call in index.ts
 */

export const cryptoTypeDefs = `
  """
  Cryptocurrency investment analysis result.
  Maps to CryptoAnalysisData type in domain/types/crypto.types.ts
  """
  type CryptoAnalysis {
    symbol: String!
    investment: Float!
    numberOfCoins: Float!
    profit: Float!
    growthFactor: Float!
    lambos: Float!
    generatedAt: String
  }

  """
  Price data point for graph visualization.
  Used for charting historical price data.
  """
  type GraphDataPoint {
    x: String!
    y: Float!
  }

  """
  Combined response matching legacy /process_request endpoint.
  Maintains backward compatibility with existing clients.
  """
  type ProcessRequestResult {
    result: CryptoAnalysis
    graphData: [GraphDataPoint!]
    error: String
  }

  """
  Input for crypto analysis request.
  Validated at resolver level using Zod schemas.
  """
  input CryptoAnalysisInput {
    symbol: String!
    investment: Float!
  }

  extend type Query {
    """
    Process cryptocurrency investment analysis request.
    Mirrors the legacy /process_request REST endpoint.
    
    Example:
    \`\`\`graphql
    query {
      processRequest(symbol: "ETH", investment: 1000) {
        result { profit }
        graphData { x y }
      }
    }
    \`\`\`
    """
    processRequest(symbol: String!, investment: Float!): ProcessRequestResult!
    
    """
    Get cryptocurrency analysis only (without graph data).
    More efficient for clients that don't need visualization.
    """
    cryptoAnalysis(input: CryptoAnalysisInput!): CryptoAnalysis
    
    """
    Get historical graph data for a cryptocurrency symbol.
    Returns price points for charting.
    """
    graphData(symbol: String!): [GraphDataPoint!]
  }
`;
