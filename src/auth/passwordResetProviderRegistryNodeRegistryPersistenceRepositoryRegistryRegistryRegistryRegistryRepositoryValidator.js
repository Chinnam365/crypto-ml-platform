"use strict";

const Repository = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepository");

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryValidator {
  validateName(name) {
    if (typeof name !== "string" || !name.trim()) {
      throw new TypeError("Repository name must be a non-empty string.");
    }

    return name.trim();
  }

  validateRepository(repository) {
    if (!(repository instanceof Repository)) {
      throw new TypeError("Invalid repository instance.");
    }

    return repository;
  }

  validate(name, repository) {
    return {
      name: this.validateName(name),
      repository: this.validateRepository(repository)
    };
  }

  status() {
    return {
      component:
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryValidator",
      healthy: true,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryValidator;
