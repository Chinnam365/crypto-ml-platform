"use strict";

const RepositoryRegistry = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryRegistry");
const Repository = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepository");

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryRegistryValidator {
  validateRegistry(registry) {
    if (!(registry instanceof RepositoryRegistry)) {
      throw new TypeError("Invalid repository registry.");
    }

    return registry;
  }

  validateName(name) {
    if (typeof name !== "string" || !name.trim()) {
      throw new TypeError("Repository registry name must be a non-empty string.");
    }

    return name.trim();
  }

  validateRepository(repository) {
    if (!(repository instanceof Repository)) {
      throw new TypeError("Invalid repository instance.");
    }

    return repository;
  }

  validate(name, repository, registry) {
    return {
      name: this.validateName(name),
      repository: this.validateRepository(repository),
      registry: this.validateRegistry(registry)
    };
  }

  status() {
    return {
      component:
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryRegistryValidator",
      healthy: true,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryRegistryValidator;
