import Joi from 'joi';
import { CRYPTO_CONSTANTS } from '../constants.js';

/**
 * Validation schema for crypto analysis request
 */
export const cryptoAnalysisSchema = Joi.object({
  symbol: Joi.string()
    .uppercase()
    .min(CRYPTO_CONSTANTS.VALIDATION.MIN_SYMBOL_LENGTH)
    .max(CRYPTO_CONSTANTS.VALIDATION.MAX_SYMBOL_LENGTH)
    .required()
    .messages({
      'string.empty': 'Symbol is required',
      'string.min': `Symbol must be at least ${CRYPTO_CONSTANTS.VALIDATION.MIN_SYMBOL_LENGTH} characters`,
      'string.max': `Symbol must be at most ${CRYPTO_CONSTANTS.VALIDATION.MAX_SYMBOL_LENGTH} characters`,
      'any.required': 'Symbol is required',
    }),
  investment: Joi.number()
    .positive()
    .min(CRYPTO_CONSTANTS.VALIDATION.MIN_INVESTMENT)
    .max(CRYPTO_CONSTANTS.VALIDATION.MAX_INVESTMENT)
    .required()
    .messages({
      'number.base': 'Investment must be a valid number',
      'number.positive': 'Investment must be positive',
      'number.min': `Investment must be at least ${CRYPTO_CONSTANTS.VALIDATION.MIN_INVESTMENT}`,
      'number.max': `Investment must be at most ${CRYPTO_CONSTANTS.VALIDATION.MAX_INVESTMENT}`,
      'any.required': 'Investment amount is required',
    }),
});

/**
 * Validation schema for symbol parameter
 */
export const symbolParamSchema = Joi.object({
  symbol: Joi.string()
    .uppercase()
    .min(CRYPTO_CONSTANTS.VALIDATION.MIN_SYMBOL_LENGTH)
    .max(CRYPTO_CONSTANTS.VALIDATION.MAX_SYMBOL_LENGTH)
    .required()
    .messages({
      'string.empty': 'Symbol is required',
      'any.required': 'Symbol is required',
    }),
});
