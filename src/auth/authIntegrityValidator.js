"use strict";

const logger = require("../config/logger");

class AuthIntegrityValidator {
  constructor({
    authRepository,
    authService,
    authMetrics,
    authTelemetry
  }) {
    this.authRepository = authRepository;
    this.authService = authService;
    this.authMetrics = authMetrics;
    this.authTelemetry = authTelemetry;
  }

  async validate() {
    const errors = [];

    this.assertDependency(
      "authRepository",
      this.authRepository,
      errors
    );

    this.assertDependency(
      "authService",
      this.authService,
      errors
    );

    this.assertDependency(
      "authMetrics",
      this.authMetrics,
      errors
    );

    this.assertDependency(
      "authTelemetry",
      this.authTelemetry,
      errors
    );

    if (errors.length > 0) {
      logger.error(
        {
          errors
        },
        "Authentication integrity validation failed."
      );

      throw new Error(
        `Authentication integrity validation failed: ${errors.join(
          ", "
        )}`
      );
    }

    logger.info(
      "Authentication integrity validation passed."
    );

    return true;
  }

  assertDependency(name, dependency, errors) {
    if (!dependency) {
      errors.push(`${name} is missing`);
    }
  }
}

module.exports = AuthIntegrityValidator;
