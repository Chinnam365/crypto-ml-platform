"use strict";

const logger = require("../config/logger");

class AuthenticationErrorHandler {
  handle(error, req, res, next) {
    const status =
      error.status || 500;

    const response = {
      success: false,
      error: {
        code:
          error.code ||
          "INTERNAL_SERVER_ERROR",
        message:
          error.message ||
          "An unexpected error occurred."
      },
      timestamp:
        new Date().toISOString()
    };

    if (error.details) {
      response.error.details =
        error.details;
    }

    logger.error({
      message:
        "Authentication error",
      code: response.error.code,
      status,
      error: error.stack,
      path: req.originalUrl,
      method: req.method,
      ip: req.ip
    });

    res.status(status).json(response);
  }

  notFound(req, res) {
    res.status(404).json({
      success: false,
      error: {
        code: "NOT_FOUND",
        message:
          "Authentication endpoint not found."
      },
      timestamp:
        new Date().toISOString()
    });
  }

  methodNotAllowed(req, res) {
    res.status(405).json({
      success: false,
      error: {
        code: "METHOD_NOT_ALLOWED",
        message:
          "HTTP method not allowed."
      },
      timestamp:
        new Date().toISOString()
    });
  }

  unauthorized(res, message) {
    return res.status(401).json({
      success: false,
      error: {
        code: "UNAUTHORIZED",
        message:
          message ||
          "Authentication required."
      },
      timestamp:
        new Date().toISOString()
    });
  }

  forbidden(res, message) {
    return res.status(403).json({
      success: false,
      error: {
        code: "FORBIDDEN",
        message:
          message ||
          "Permission denied."
      },
      timestamp:
        new Date().toISOString()
    });
  }

  validation(res, errors) {
    return res.status(400).json({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message:
          "Validation failed.",
        errors
      },
      timestamp:
        new Date().toISOString()
    });
  }
}

module.exports = new AuthenticationErrorHandler();
