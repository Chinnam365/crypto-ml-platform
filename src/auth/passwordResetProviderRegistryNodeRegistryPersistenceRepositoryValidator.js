"use strict";

const PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryConfig = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryConfig");

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryValidator {
  constructor(options = {}) {
    this.config =
      options.config ||
      new PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryConfig(
        options
      );
  }

  validateId(id) {
    if (typeof id !== "string") {
      throw new TypeError("Repository id must be a string.");
    }

    if (id.trim().length === 0) {
      throw new Error("Repository id cannot be empty.");
    }

    return true;
  }

  validateRecord(record) {
    if (!record || typeof record !== "object" || Array.isArray(record)) {
      throw new TypeError("Repository record must be an object.");
    }

    return true;
  }

  validate(id, record) {
    this.validateId(id);
    this.validateRecord(record);

    return {
      valid: true,
      timestamp: new Date().toISOString()
    };
  }

  status() {
    return {
      component:
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryValidator",
      config: this.config.status(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryValidator;
