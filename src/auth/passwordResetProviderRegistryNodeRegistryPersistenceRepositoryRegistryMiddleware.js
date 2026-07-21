"use strict";

const PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryValidator = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryValidator");

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryMiddleware {
  constructor(options = {}) {
    this.validator =
      options.validator ||
      new PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryValidator(
        options
      );
  }

  validateRequest() {
    return (req, res, next) => {
      try {
        const name = req.params ? req.params.name : undefined;
        const repository = req.body;

        if (name !== undefined) {
          this.validator.validateName(name);
        }

        if (
          req.method === "POST" ||
          req.method === "PUT" ||
          req.method === "PATCH"
        ) {
          this.validator.validateRepository(repository);
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
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryMiddleware",
      validator: this.validator.status(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryMiddleware;
