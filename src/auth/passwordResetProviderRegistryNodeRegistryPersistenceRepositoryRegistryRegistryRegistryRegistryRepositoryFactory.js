"use strict";

const Repository = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepository");

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryFactory {
  constructor(options = {}) {
    this.options = options;
  }

  create(initialEntries = []) {
    const repository = new Repository();

    if (Array.isArray(initialEntries)) {
      for (const entry of initialEntries) {
        if (
          entry &&
          typeof entry.name === "string" &&
          entry.provider !== undefined
        ) {
          repository.save(entry.name, entry.provider);
        }
      }
    }

    return repository;
  }

  createEmpty() {
    return new Repository();
  }

  createFromMap(map) {
    const repository = new Repository();

    if (map instanceof Map) {
      for (const [name, provider] of map.entries()) {
        repository.save(name, provider);
      }
    }

    return repository;
  }

  status() {
    return {
      component:
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryFactory",
      healthy: true,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryFactory;
