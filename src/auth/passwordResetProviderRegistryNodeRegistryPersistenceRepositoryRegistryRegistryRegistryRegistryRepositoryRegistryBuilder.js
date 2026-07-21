"use strict";

const RepositoryRegistry = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryRegistry");
const Repository = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepository");

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryRegistryBuilder {
  constructor() {
    this.registry = new RepositoryRegistry();
  }

  add(name, repository = new Repository()) {
    this.registry.register(name, repository);
    return this;
  }

  addMany(entries = []) {
    for (const entry of entries) {
      if (!entry || typeof entry.name !== "string") {
        continue;
      }

      this.registry.register(
        entry.name,
        entry.repository || new Repository()
      );
    }

    return this;
  }

  remove(name) {
    this.registry.remove(name);
    return this;
  }

  clear() {
    this.registry.clear();
    return this;
  }

  build() {
    return this.registry;
  }

  status() {
    return {
      component:
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryRegistryBuilder",
      healthy: true,
      registrySize: this.registry.size(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryRegistryBuilder;
