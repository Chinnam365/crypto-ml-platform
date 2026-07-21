"use strict";

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryCache {
  constructor(options = {}) {
    this.ttl = options.ttl || 5 * 60 * 1000;
    this.cache = new Map();
  }

  set(key, value) {
    this.cache.set(key, {
      value,
      expiresAt: Date.now() + this.ttl
    });

    return value;
  }

  get(key) {
    const item = this.cache.get(key);

    if (!item) {
      return null;
    }

    if (item.expiresAt < Date.now()) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  has(key) {
    return this.get(key) !== null;
  }

  delete(key) {
    return this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }

  size() {
    return this.cache.size;
  }

  status() {
    return {
      component:
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryCache",
      healthy: true,
      entries: this.cache.size,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryCache;
