"use strict";

const Repository = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepository");

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryRegistry {
  constructor() {
    this.repositories = new Map();
  }

  register(name, repository = new Repository()) {
    this.repositories.set(name, repository);
    return repository;
  }

  get(name) {
    return this.repositories.get(name) || null;
  }

  has(name) {
    return this.repositories.has(name);
  }

  remove(name) {
    return this.repositories.delete(name);
  }

  list() {
    return Array.from(this.repositories.keys());
  }

  clear() {
    this.repositories.clear();
  }

  size() {
    return this.repositories.size;
  }

  status() {
    return {
      component:
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryRegistry",
      healthy: true,
      repositories: this.size(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryRegistry;
