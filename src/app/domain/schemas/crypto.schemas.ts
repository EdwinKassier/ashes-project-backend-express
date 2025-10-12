import { z } from 'zod';
import { CRYPTO_CONSTANTS } from '../constants.js';

/**
 * Validation schema for crypto analysis request
 */
export const cryptoAnalysisSchema = z.object({
  symbol: z
    .string({
      required_error: 'Symbol is required',
      invalid_type_error: 'Symbol must be a string',
    })
    .min(1, { message: 'Symbol is required' })
    .min(CRYPTO_CONSTANTS.VALIDATION.MIN_SYMBOL_LENGTH, {
      message: `Symbol must be at least ${CRYPTO_CONSTANTS.VALIDATION.MIN_SYMBOL_LENGTH} characters`,
    })
    .max(CRYPTO_CONSTANTS.VALIDATION.MAX_SYMBOL_LENGTH, {
      message: `Symbol must be at most ${CRYPTO_CONSTANTS.VALIDATION.MAX_SYMBOL_LENGTH} characters`,
    })
    .transform((val) => val.toUpperCase()),
  investment: z.coerce
    .number({
      required_error: 'Investment amount is required',
      invalid_type_error: 'Investment must be a valid number',
    })
    .positive({
      message: 'Investment must be positive',
    })
    .min(CRYPTO_CONSTANTS.VALIDATION.MIN_INVESTMENT, {
      message: `Investment must be at least ${CRYPTO_CONSTANTS.VALIDATION.MIN_INVESTMENT}`,
    })
    .max(CRYPTO_CONSTANTS.VALIDATION.MAX_INVESTMENT, {
      message: `Investment must be at most ${CRYPTO_CONSTANTS.VALIDATION.MAX_INVESTMENT}`,
    }),
});

/**
 * Validation schema for symbol parameter
 */
export const symbolParamSchema = z.object({
  symbol: z
    .string({
      required_error: 'Symbol is required',
      invalid_type_error: 'Symbol must be a string',
    })
    .min(CRYPTO_CONSTANTS.VALIDATION.MIN_SYMBOL_LENGTH, {
      message: `Symbol must be at least ${CRYPTO_CONSTANTS.VALIDATION.MIN_SYMBOL_LENGTH} characters`,
    })
    .max(CRYPTO_CONSTANTS.VALIDATION.MAX_SYMBOL_LENGTH, {
      message: `Symbol must be at most ${CRYPTO_CONSTANTS.VALIDATION.MAX_SYMBOL_LENGTH} characters`,
    })
    .transform((val) => val.toUpperCase()),
});

// Type inference from Zod schemas
export type CryptoAnalysisQuery = z.infer<typeof cryptoAnalysisSchema>;
export type SymbolParam = z.infer<typeof symbolParamSchema>;
