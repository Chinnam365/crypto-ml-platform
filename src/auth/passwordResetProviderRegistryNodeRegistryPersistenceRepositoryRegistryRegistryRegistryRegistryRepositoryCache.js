"use strict";

const Repository = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepository");

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryCache {
  constructor() {
    this.repositories = new Map();
  }

  add(name, repository = new Repository()) {
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

  keys() {
    return Array.from(this.repositories.keys());
  }

  values() {
    return Array.from(this.repositories.values());
  }

  entries() {
    return Array.from(this.repositories.entries());
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
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryCache",
      healthy: true,
      repositories: this.size(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryCache;
