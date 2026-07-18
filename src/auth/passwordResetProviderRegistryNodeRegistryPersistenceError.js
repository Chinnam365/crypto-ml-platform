"use strict";

class PasswordResetProviderRegistryNodeRegistryPersistenceError extends Error {
  constructor(
    message = "Password Reset Provider Registry Node Registry Persistence Error",
    options = {}
  ) {
    super(message);

    Error.captureStackTrace?.(
      this,
      PasswordResetProviderRegistryNodeRegistryPersistenceError
    );

    this.name =
      "PasswordResetProviderRegistryNodeRegistryPersistenceError";

    this.code =
      options.code ||
      "PASSWORD_RESET_PROVIDER_REGISTRY_NODE_REGISTRY_PERSISTENCE_ERROR";

    this.statusCode = Number.isInteger(options.statusCode)
      ? options.statusCode
      : 500;

    this.details = options.details || null;

    this.timestamp = new Date().toISOString();
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      details: this.details,
      timestamp: this.timestamp
    };
  }

  status() {
    return {
      error:
        "PasswordResetProviderRegistryNodeRegistryPersistenceError",
      code: this.code,
      statusCode: this.statusCode,
      timestamp: this.timestamp
    };
  }

  static badRequest(message = "Bad Request", details = null) {
    return new PasswordResetProviderRegistryNodeRegistryPersistenceError(
      message,
      {
        code: "BAD_REQUEST",
        statusCode: 400,
        details
      }
    );
  }

  static unauthorized(message = "Unauthorized", details = null) {
    return new PasswordResetProviderRegistryNodeRegistryPersistenceError(
      message,
      {
        code: "UNAUTHORIZED",
        statusCode: 401,
        details
      }
    );
  }

  static forbidden(message = "Forbidden", details = null) {
    return new PasswordResetProviderRegistryNodeRegistryPersistenceError(
      message,
      {
        code: "FORBIDDEN",
        statusCode: 403,
        details
      }
    );
  }

  static notFound(message = "Not Found", details = null) {
    return new PasswordResetProviderRegistryNodeRegistryPersistenceError(
      message,
      {
        code: "NOT_FOUND",
        statusCode: 404,
        details
      }
    );
  }

  static conflict(message = "Conflict", details = null) {
    return new PasswordResetProviderRegistryNodeRegistryPersistenceError(
      message,
      {
        code: "CONFLICT",
        statusCode: 409,
        details
      }
    );
  }

  static internal(message = "Internal Server Error", details = null) {
    return new PasswordResetProviderRegistryNodeRegistryPersistenceError(
      message,
      {
        code: "INTERNAL_SERVER_ERROR",
        statusCode: 500,
        details
      }
    );
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceError;
