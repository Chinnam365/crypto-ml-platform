"use strict";

const RepositoryRegistry = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryRegistry");
const Repository = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepository");

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryRegistryFactory {
  create(initialRepositories = []) {
    const registry = new RepositoryRegistry();

    if (Array.isArray(initialRepositories)) {
      for (const entry of initialRepositories) {
        if (!entry || typeof entry.name !== "string") {
          continue;
        }

        registry.register(
          entry.name,
          entry.repository instanceof Repository
            ? entry.repository
            : new Repository()
        );
      }
    }

    return registry;
  }

  createEmpty() {
    return new RepositoryRegistry();
  }

  status() {
    return {
      component:
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryRegistryFactory",
      healthy: true,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryRegistryFactory;
