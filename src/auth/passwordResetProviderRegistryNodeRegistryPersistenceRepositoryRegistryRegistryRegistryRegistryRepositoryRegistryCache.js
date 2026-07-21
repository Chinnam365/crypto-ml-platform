"use strict";

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryRegistryCache {
  constructor() {
    this.cache = new Map();
  }

  set(name, repositoryRegistry) {
    this.cache.set(name, {
      repositoryRegistry,
      cachedAt: new Date().toISOString()
    });

    return repositoryRegistry;
  }

  get(name) {
    const entry = this.cache.get(name);
    return entry ? entry.repositoryRegistry : null;
  }

  has(name) {
    return this.cache.has(name);
  }

  delete(name) {
    return this.cache.delete(name);
  }

  clear() {
    this.cache.clear();
  }

  keys() {
    return Array.from(this.cache.keys());
  }

  values() {
    return Array.from(this.cache.values()).map(
      entry => entry.repositoryRegistry
    );
  }

  size() {
    return this.cache.size;
  }

  status() {
    return {
      component:
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryRegistryCache",
      healthy: true,
      entries: this.size(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryRegistryCache;
