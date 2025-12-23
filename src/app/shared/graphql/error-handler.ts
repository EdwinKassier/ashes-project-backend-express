import { GraphQLError } from 'graphql';
import { logger } from '../utils/logger.js';
import config from '../config/app.config.js';

/**
 * Error codes for GraphQL responses.
 * Aligns with existing domain exception codes.
 */
export enum GraphQLErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
}

/**
 * Type guard for operational errors.
 * Matches the pattern from crypto.exceptions.ts
 */
interface OperationalError extends Error {
  statusCode: number;
  code: string;
  isOperational: boolean;
}

function isOperationalError(error: unknown): error is OperationalError {
  return (
    error instanceof Error &&
    'isOperational' in error &&
    (error as OperationalError).isOperational === true
  );
}

/**
 * Format domain exceptions into GraphQL errors.
 * Preserves error codes and masks internal details in production.
 *
 * @example Usage in resolver:
 * ```typescript
 * try {
 *   return await service.doSomething();
 * } catch (error) {
 *   throw formatGraphQLError(error);
 * }
 * ```
 */
export function formatGraphQLError(error: unknown): GraphQLError {
  // Handle operational errors (domain exceptions)
  if (isOperationalError(error)) {
    logger.warn('GraphQL operational error', {
      code: error.code,
      message: error.message,
    });

    return new GraphQLError(error.message, {
      extensions: {
        code: error.code,
        statusCode: error.statusCode,
      },
    });
  }

  // Handle unknown errors
  logger.error('GraphQL unexpected error', {
    error: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
  });

  // Hide internal details in production
  let message = 'Unknown error';
  if (config.nodeEnv === 'production') {
    message = 'Internal server error';
  } else if (error instanceof Error) {
    message = error.message;
  }

  return new GraphQLError(message, {
    extensions: {
      code: GraphQLErrorCode.INTERNAL_ERROR,
    },
  });
}
