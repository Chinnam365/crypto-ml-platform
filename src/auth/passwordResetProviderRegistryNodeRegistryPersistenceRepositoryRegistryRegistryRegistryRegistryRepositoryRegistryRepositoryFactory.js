"use strict";

const RepositoryRegistryRepository = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryRegistryRepository");
const Repository = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepository");

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryRegistryRepositoryFactory {
  create(entries = []) {
    const repository = new RepositoryRegistryRepository();

    if (Array.isArray(entries)) {
      for (const entry of entries) {
        if (!entry || typeof entry.name !== "string") {
          continue;
        }

        repository.save(
          entry.name,
          entry.repository || new Repository()
        );
      }
    }

    return repository;
  }

  createEmpty() {
    return new RepositoryRegistryRepository();
  }

  status() {
    return {
      component:
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryRegistryRepositoryFactory",
      healthy: true,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryRegistryRepositoryFactory;
