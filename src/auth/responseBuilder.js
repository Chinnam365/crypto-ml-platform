"use strict";

const HTTP = require("./httpStatus");

class ResponseBuilder {
  success(data = {}, message = "Success") {
    return {
      status: HTTP.OK,
      body: {
        success: true,
        message,
        data,
        timestamp: new Date().toISOString()
      }
    };
  }

  created(data = {}, message = "Created") {
    return {
      status: HTTP.CREATED,
      body: {
        success: true,
        message,
        data,
        timestamp: new Date().toISOString()
      }
    };
  }

  accepted(data = {}, message = "Accepted") {
    return {
      status: HTTP.ACCEPTED,
      body: {
        success: true,
        message,
        data,
        timestamp: new Date().toISOString()
      }
    };
  }

  noContent() {
    return {
      status: HTTP.NO_CONTENT,
      body: null
    };
  }

  error(
    status = HTTP.INTERNAL_SERVER_ERROR,
    code = "ERROR",
    message = "An error occurred.",
    details = null
  ) {
    const response = {
      success: false,
      error: {
        code,
        message
      },
      timestamp: new Date().toISOString()
    };

    if (details !== null) {
      response.error.details = details;
    }

    return {
      status,
      body: response
    };
  }

  validation(errors = []) {
    return this.error(
      HTTP.BAD_REQUEST,
      "VALIDATION_ERROR",
      "Validation failed.",
      errors
    );
  }

  unauthorized(
    message = "Authentication required."
  ) {
    return this.error(
      HTTP.UNAUTHORIZED,
      "UNAUTHORIZED",
      message
    );
  }

  forbidden(
    message = "Permission denied."
  ) {
    return this.error(
      HTTP.FORBIDDEN,
      "FORBIDDEN",
      message
    );
  }

  notFound(
    message = "Resource not found."
  ) {
    return this.error(
      HTTP.NOT_FOUND,
      "NOT_FOUND",
      message
    );
  }

  conflict(
    message = "Conflict."
  ) {
    return this.error(
      HTTP.CONFLICT,
      "CONFLICT",
      message
    );
  }

  tooManyRequests(
    message = "Too many requests."
  ) {
    return this.error(
      HTTP.TOO_MANY_REQUESTS,
      "RATE_LIMIT_EXCEEDED",
      message
    );
  }

  send(res, response) {
    if (response.body === null) {
      return res.sendStatus(response.status);
    }

    return res
      .status(response.status)
      .json(response.body);
  }
}

module.exports = new ResponseBuilder();
