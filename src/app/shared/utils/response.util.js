/**
 * Standard success response formatter
 */
export const successResponse = (res, data, message = 'Success', statusCode = 200) =>
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });

/**
 * Standard error response formatter
 */
export const errorResponse = (res, message, statusCode = 500, errors = null) => {
  const response = {
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
export const paginatedResponse = (res, data, page, limit, total, message = 'Success') =>
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
