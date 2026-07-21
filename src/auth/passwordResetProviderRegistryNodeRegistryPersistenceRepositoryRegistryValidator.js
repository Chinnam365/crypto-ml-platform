"use strict";

const PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryConfig = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryConfig");
const PasswordResetProviderRegistryNodeRegistryPersistenceRepository = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepository");

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryValidator {
  constructor(options = {}) {
    this.config =
      options.config ||
      new PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryConfig(
        options
      );
  }

  validateName(name) {
    if (typeof name !== "string") {
      throw new TypeError("Repository registry name must be a string.");
    }

    if (name.trim().length === 0) {
      throw new Error("Repository registry name cannot be empty.");
    }

    return true;
  }

  validateRepository(repository) {
    if (
      !(repository instanceof
        PasswordResetProviderRegistryNodeRegistryPersistenceRepository)
    ) {
      throw new TypeError(
        "Repository must be an instance of PasswordResetProviderRegistryNodeRegistryPersistenceRepository."
      );
    }

    return true;
  }

  validate(name, repository) {
    this.validateName(name);
    this.validateRepository(repository);

    return {
      valid: true,
      timestamp: new Date().toISOString()
    };
  }

  status() {
    return {
      component:
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryValidator",
      config: this.config.status(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryValidator;
