const { env } = require('../config/env');
const { logger } = require('../logger/winston');
const { ApiError } = require('../errors/ApiError');
const { errorResponse } = require('../response/apiResponse');

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';
    error = new ApiError(statusCode, message, false, err.stack);
  }

  const { statusCode, message } = error;

  if (env.NODE_ENV !== 'test') {
    logger.error(`${statusCode} - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  }

  res.locals.errorMessage = error.message;

  const responseErrors = env.NODE_ENV === 'development' && !error.isOperational ? error.stack : null;

  return errorResponse(res, statusCode, message, responseErrors);
};

module.exports = { errorHandler };
