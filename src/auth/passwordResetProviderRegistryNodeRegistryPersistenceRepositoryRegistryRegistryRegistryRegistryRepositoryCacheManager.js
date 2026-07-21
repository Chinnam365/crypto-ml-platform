"use strict";

const RepositoryCache = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryCache");

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryCacheManager {
  constructor(options = {}) {
    this.cache = options.cache || new RepositoryCache();
  }

  register(name, repository) {
    this.cache.add(name, repository);
    return repository;
  }

  resolve(name) {
    return this.cache.get(name);
  }

  exists(name) {
    return this.cache.has(name);
  }

  unregister(name) {
    return this.cache.remove(name);
  }

  list() {
    return this.cache.keys();
  }

  clear() {
    this.cache.clear();
  }

  size() {
    return this.cache.size();
  }

  status() {
    return {
      component:
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryCacheManager",
      healthy: true,
      repositoryCount: this.size(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryCacheManager;
