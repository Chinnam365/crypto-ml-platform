"use strict";

class AppError extends Error {
  constructor({
    message,
    statusCode = 500,
    code = "INTERNAL_SERVER_ERROR",
    details = null,
    operational = true
  }) {
    super(message);

    Error.captureStackTrace(this, this.constructor);

    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.operational = operational;
    this.timestamp = new Date().toISOString();
  }

  toJSON() {
    return {
      error: {
        code: this.code,
        message: this.message,
        details: this.details,
        timestamp: this.timestamp
      }
    };
  }

  static badRequest(message, details = null) {
    return new AppError({
      message,
      statusCode: 400,
      code: "BAD_REQUEST",
      details
    });
  }

  static unauthorized(message = "Unauthorized") {
    return new AppError({
      message,
      statusCode: 401,
      code: "UNAUTHORIZED"
    });
  }

  static forbidden(message = "Forbidden") {
    return new AppError({
      message,
      statusCode: 403,
      code: "FORBIDDEN"
    });
  }

  static notFound(message = "Resource not found") {
    return new AppError({
      message,
      statusCode: 404,
      code: "NOT_FOUND"
    });
  }

  static conflict(message, details = null) {
    return new AppError({
      message,
      statusCode: 409,
      code: "CONFLICT",
      details
    });
  }

  static validation(message, details = null) {
    return new AppError({
      message,
      statusCode: 422,
      code: "VALIDATION_ERROR",
      details
    });
  }

  static rateLimited(message = "Too many requests") {
    return new AppError({
      message,
      statusCode: 429,
      code: "RATE_LIMIT_EXCEEDED"
    });
  }

  static internal(message = "Internal server error") {
    return new AppError({
      message,
      statusCode: 500,
      code: "INTERNAL_SERVER_ERROR",
      operational: false
    });
  }

  static serviceUnavailable(message = "Service unavailable") {
    return new AppError({
      message,
      statusCode: 503,
      code: "SERVICE_UNAVAILABLE"
    });
  }
}

module.exports = AppError;
