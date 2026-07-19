"use strict";

const PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryValidator = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryValidator");

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryMiddleware {
  constructor(options = {}) {
    this.validator =
      options.validator ||
      new PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryValidator(
        options
      );
  }

  validateRequest() {
    return (req, res, next) => {
      try {
        const id = req.params ? req.params.id : undefined;
        const body = req.body || {};

        if (id !== undefined) {
          this.validator.validateId(id);
        }

        if (
          req.method === "POST" ||
          req.method === "PUT" ||
          req.method === "PATCH"
        ) {
          this.validator.validateRecord(body);
        }

        return next();
      } catch (error) {
        return res.status(400).json({
          success: false,
          error: error.message,
          timestamp: new Date().toISOString()
        });
      }
    };
  }

  status() {
    return {
      component:
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryMiddleware",
      validator: this.validator.status(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryMiddleware;
