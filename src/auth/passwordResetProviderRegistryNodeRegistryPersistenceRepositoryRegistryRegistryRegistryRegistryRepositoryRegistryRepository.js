"use strict";

const Repository = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepository");

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryRegistryRepository {
  constructor() {
    this.repositories = new Map();
  }

  save(name, repository = new Repository()) {
    this.repositories.set(name, repository);

    return repository;
  }

  get(name) {
    return this.repositories.get(name) || null;
  }

  has(name) {
    return this.repositories.has(name);
  }

  delete(name) {
    return this.repositories.delete(name);
  }

  list() {
    return Array.from(this.repositories.entries()).map(
      ([name, repository]) => ({
        name,
        repository
      })
    );
  }

  clear() {
    this.repositories.clear();
  }

  count() {
    return this.repositories.size;
  }

  status() {
    return {
      component:
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryRegistryRepository",
      healthy: true,
      repositories: this.count(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryRegistryRepository;
