"use strict";

const PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryCache = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryCache");
const PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryValidator = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryValidator");

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryStore {
  constructor(options = {}) {
    this.cache =
      options.cache ||
      new PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryCache(
        options
      );

    this.validator =
      options.validator ||
      new PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryValidator(
        options
      );
  }

  register(name, repository) {
    this.validator.validate(name, repository);

    this.cache.set(name, repository);

    return repository;
  }

  unregister(name) {
    if (!this.cache.has(name)) {
      return false;
    }

    this.cache.delete(name);

    return true;
  }

  get(name) {
    return this.cache.get(name) || null;
  }

  has(name) {
    return this.cache.has(name);
  }

  list() {
    return this.cache.keys();
  }

  entries() {
    return this.cache.entries();
  }

  clear() {
    this.cache.clear();
    return true;
  }

  count() {
    return this.cache.size();
  }

  status() {
    return {
      component:
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryStore",
      repositories: this.count(),
      cache: this.cache.status(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryStore;
