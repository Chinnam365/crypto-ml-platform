"use strict";

const RepositoryRegistryCache = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryRegistryCache");

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryRegistryCacheManager {
  constructor(options = {}) {
    this.cache =
      options.cache || new RepositoryRegistryCache();
  }

  register(name, repositoryRegistry) {
    return this.cache.set(name, repositoryRegistry);
  }

  resolve(name) {
    return this.cache.get(name);
  }

  exists(name) {
    return this.cache.has(name);
  }

  unregister(name) {
    return this.cache.delete(name);
  }

  clear() {
    this.cache.clear();
  }

  keys() {
    return this.cache.keys();
  }

  values() {
    return this.cache.values();
  }

  size() {
    return this.cache.size();
  }

  status() {
    return {
      component:
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryRegistryCacheManager",
      healthy: true,
      cacheSize: this.size(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryRegistryCacheManager;
