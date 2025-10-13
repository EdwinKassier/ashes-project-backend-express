import type { Response } from 'express';

/**
 * Standard success response formatter
 */
export const successResponse = <T>(
  res: Response,
  data: T,
  message = 'Success',
  statusCode = 200
): Response =>
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });

/**
 * Standard error response formatter
 */
export const errorResponse = (
  res: Response,
  message: string,
  statusCode = 500,
  errors: unknown = null
): Response => {
  const response: {
    success: boolean;
    error: {
      message: string;
      details?: unknown;
    };
  } = {
    success: false,
    error: {
      message,
    },
  };

  if (errors) {
    response.error.details = errors;
  }

  return res.status(statusCode).json(response);
};

/**
 * Pagination response formatter
 */
export const paginatedResponse = <T>(
  res: Response,
  data: T,
  page: number,
  limit: number,
  total: number,
  message = 'Success'
): Response =>
  res.status(200).json({
    success: true,
    message,
    data,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
