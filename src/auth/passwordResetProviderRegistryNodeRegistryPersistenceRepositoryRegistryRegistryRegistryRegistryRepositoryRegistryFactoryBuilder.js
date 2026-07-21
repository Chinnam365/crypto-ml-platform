"use strict";

const RepositoryRegistryFactory = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryRegistryFactory");
const Repository = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepository");

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryRegistryFactoryBuilder {
  constructor() {
    this.entries = [];
  }

  add(name, repository = new Repository()) {
    this.entries.push({
      name,
      repository
    });

    return this;
  }

  addMany(entries = []) {
    for (const entry of entries) {
      if (
        entry &&
        typeof entry.name === "string"
      ) {
        this.entries.push({
          name: entry.name,
          repository: entry.repository || new Repository()
        });
      }
    }

    return this;
  }

  clear() {
    this.entries = [];
    return this;
  }

  build() {
    const factory = new RepositoryRegistryFactory();
    return factory.create(this.entries);
  }

  status() {
    return {
      component:
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryRegistryFactoryBuilder",
      healthy: true,
      pendingEntries: this.entries.length,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryRegistryFactoryBuilder;
