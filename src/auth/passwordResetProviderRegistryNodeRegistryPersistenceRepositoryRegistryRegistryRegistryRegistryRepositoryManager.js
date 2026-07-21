"use strict";

const Repository = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepository");
const Validator = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryValidator");

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryManager {
  constructor(options = {}) {
    this.validator = options.validator || new Validator();
    this.repositories = new Map();
  }

  register(name, repository = new Repository()) {
    const validated = this.validator.validate(name, repository);

    this.repositories.set(
      validated.name,
      validated.repository
    );

    return validated.repository;
  }

  resolve(name) {
    return this.repositories.get(name) || null;
  }

  unregister(name) {
    return this.repositories.delete(name);
  }

  exists(name) {
    return this.repositories.has(name);
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
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryManager",
      healthy: true,
      repositories: this.size(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryManager;
