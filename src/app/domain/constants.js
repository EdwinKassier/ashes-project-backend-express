/**
 * Domain constants for cryptocurrency analysis
 */

export const CRYPTO_CONSTANTS = {
  // Price of a Lamborghini for calculation
  LAMBO_PRICE: 200000,

  // Default time intervals
  TIME_INTERVALS: {
    SIX_HOURS: 21600,
    ONE_WEEK: 604800,
  },

  // API endpoints
  KRAKEN_API: {
    OHLC: '/OHLC',
  },

  // Data frame columns
  DATAFRAME_COLUMNS: {
    CLOSE_TIME: 'CloseTime',
    OPEN_PRICE: 'OpenPrice',
    HIGH_PRICE: 'HighPrice',
    LOW_PRICE: 'LowPrice',
    CLOSE_PRICE: 'ClosePrice',
    VWAP: 'VWap',
    VOLUME: 'Volume',
    COUNT: 'Count',
  },

  // Cache settings
  CACHE: {
    OPENING_AVERAGE_MONTHS: 1080, // ~20 years in weeks
    CURRENT_DATA_WEEKS: 12,
  },

  // Validation rules
  VALIDATION: {
    MIN_SYMBOL_LENGTH: 2,
    MAX_SYMBOL_LENGTH: 10,
    MIN_INVESTMENT: 0.01,
    MAX_INVESTMENT: 1000000000,
  },
};

export const ERROR_MESSAGES = {
  SYMBOL_NOT_FOUND: "Symbol doesn't exist",
  INVALID_INVESTMENT: 'Invalid investment amount',
  SYMBOL_REQUIRED: 'Symbol is required',
  INVESTMENT_REQUIRED: 'Investment amount is required',
  API_ERROR: 'Failed to fetch data from exchange',
  DATA_PROCESSING_ERROR: 'Failed to process market data',
};
