/* eslint-disable max-classes-per-file */

/**
 * Base exception class for crypto domain
 */
export class CryptoException extends Error {
  public readonly statusCode: number;

  public readonly code: string;

  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = 500,
    code: string = 'CRYPTO_ERROR'
  ) {
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
  constructor(symbol: string) {
    super(`Symbol '${symbol}' not found on exchange`, 404, 'SYMBOL_NOT_FOUND');
  }
}

/**
 * Invalid investment amount
 */
export class InvalidInvestmentException extends CryptoException {
  constructor(message: string = 'Invalid investment amount') {
    super(message, 400, 'INVALID_INVESTMENT');
  }
}

/**
 * External API error
 */
export class ExternalAPIException extends CryptoException {
  public readonly originalError: Error | null;

  constructor(
    message: string = 'External API error',
    originalError: Error | null = null
  ) {
    super(message, 502, 'EXTERNAL_API_ERROR');
    this.originalError = originalError;
  }
}

/**
 * Data processing error
 */
export class DataProcessingException extends CryptoException {
  constructor(message: string = 'Data processing error') {
    super(message, 500, 'DATA_PROCESSING_ERROR');
  }
}

/**
 * Cache error
 */
export class CacheException extends CryptoException {
  constructor(message: string = 'Cache operation failed') {
    super(message, 500, 'CACHE_ERROR');
  }
}
