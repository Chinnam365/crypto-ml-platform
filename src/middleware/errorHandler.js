"use strict";

const logger = require("../config/logger");
const config = require("../config/environment");
const AppError = require("../utils/AppError");

function errorHandler(err, req, res, next) {
  let error = err;

  if (!(error instanceof AppError)) {
    error = AppError.internal(error.message || "Unexpected server error");
  }

  logger.error(
    {
      requestId: req.id,
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      statusCode: error.statusCode,
      code: error.code,
      stack: err.stack,
      details: error.details
    },
    error.message
  );

  const response = {
    success: false,
    error: {
      code: error.code,
      message: error.message,
      timestamp: error.timestamp
    }
  };

  if (error.details) {
    response.error.details = error.details;
  }

  if (
    config.app.environment !== "production" &&
    err.stack
  ) {
    response.error.stack = err.stack;
  }

  res.status(error.statusCode).json(response);
}

function notFoundHandler(req, res) {
  const error = AppError.notFound(
    `Route '${req.originalUrl}' was not found.`
  );

  res.status(error.statusCode).json({
    success: false,
    error: {
      code: error.code,
      message: error.message,
      timestamp: error.timestamp
    }
  });
}

module.exports = {
  errorHandler,
  notFoundHandler
};
