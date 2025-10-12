/* eslint-disable max-classes-per-file */

/**
 * Base exception class for crypto domain
 */
export class CryptoException extends Error {
  constructor(message, statusCode = 500, code = 'CRYPTO_ERROR') {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Symbol not found on exchange
 */
export class SymbolNotFoundException extends CryptoException {
  constructor(symbol) {
    super(`Symbol '${symbol}' not found on exchange`, 404, 'SYMBOL_NOT_FOUND');
  }
}

/**
 * Invalid investment amount
 */
export class InvalidInvestmentException extends CryptoException {
  constructor(message = 'Invalid investment amount') {
    super(message, 400, 'INVALID_INVESTMENT');
  }
}

/**
 * External API error
 */
export class ExternalAPIException extends CryptoException {
  constructor(message = 'External API error', originalError = null) {
    super(message, 502, 'EXTERNAL_API_ERROR');
    this.originalError = originalError;
  }
}

/**
 * Data processing error
 */
export class DataProcessingException extends CryptoException {
  constructor(message = 'Data processing error') {
    super(message, 500, 'DATA_PROCESSING_ERROR');
  }
}

/**
 * Cache error
 */
export class CacheException extends CryptoException {
  constructor(message = 'Cache operation failed') {
    super(message, 500, 'CACHE_ERROR');
  }
}
