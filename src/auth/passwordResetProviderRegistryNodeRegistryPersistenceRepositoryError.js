"use strict";

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryError extends Error {
  constructor(message, options = {}) {
    super(message);

    this.name =
      "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryError";

    this.code = options.code || "PERSISTENCE_REPOSITORY_ERROR";
    this.statusCode = options.statusCode || 500;
    this.details = options.details || null;
    this.cause = options.cause;
    this.timestamp = new Date().toISOString();

    Error.captureStackTrace?.(
      this,
      PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryError
    );
  }

  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      statusCode: this.statusCode,
      details: this.details,
      timestamp: this.timestamp
    };
  }

  static validation(message, details = null) {
    return new PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryError(
      message,
      {
        code: "VALIDATION_ERROR",
        statusCode: 400,
        details
      }
    );
  }

  static notFound(message, details = null) {
    return new PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryError(
      message,
      {
        code: "NOT_FOUND",
        statusCode: 404,
        details
      }
    );
  }

  static conflict(message, details = null) {
    return new PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryError(
      message,
      {
        code: "CONFLICT",
        statusCode: 409,
        details
      }
    );
  }

  static internal(message, details = null) {
    return new PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryError(
      message,
      {
        code: "INTERNAL_ERROR",
        statusCode: 500,
        details
      }
    );
  }

  status() {
    return this.toJSON();
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryError;
