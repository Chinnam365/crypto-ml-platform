"use strict";

const PasswordResetProviderRegistryNodeRegistryPersistenceRepository = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepository");

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistry {
  constructor(options = {}) {
    this.repositories = new Map();

    if (options.defaultRepository instanceof PasswordResetProviderRegistryNodeRegistryPersistenceRepository) {
      this.register("default", options.defaultRepository);
    }
  }

  register(name, repository) {
    if (typeof name !== "string" || name.trim() === "") {
      throw new TypeError("Repository name must be a non-empty string.");
    }

    if (!(repository instanceof PasswordResetProviderRegistryNodeRegistryPersistenceRepository)) {
      throw new TypeError("Invalid repository instance.");
    }

    this.repositories.set(name, repository);

    return repository;
  }

  unregister(name) {
    return this.repositories.delete(name);
  }

  get(name = "default") {
    return this.repositories.get(name) || null;
  }

  has(name) {
    return this.repositories.has(name);
  }

  list() {
    return [...this.repositories.keys()];
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
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistry",
      repositories: this.list(),
      count: this.count(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistry;
