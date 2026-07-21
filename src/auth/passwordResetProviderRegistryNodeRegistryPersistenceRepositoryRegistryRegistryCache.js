"use strict";

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryCache {
  constructor(options = {}) {
    this.cache = new Map();
    this.defaultTtl = Number(options.defaultTtl) || 300000;
  }

  set(key, value, ttl = this.defaultTtl) {
    const expiresAt = Date.now() + ttl;

    this.cache.set(key, {
      value,
      expiresAt
    });

    return value;
  }

  get(key) {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    if (entry.expiresAt <= Date.now()) {
      this.cache.delete(key);
      return null;
    }

    return entry.value;
  }

  has(key) {
    return this.get(key) !== null;
  }

  delete(key) {
    return this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
    return true;
  }

  cleanup() {
    let removed = 0;

    const now = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      if (entry.expiresAt <= now) {
        this.cache.delete(key);
        removed++;
      }
    }

    return removed;
  }

  size() {
    this.cleanup();
    return this.cache.size;
  }

  status() {
    return {
      component:
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryCache",
      entries: this.size(),
      healthy: true,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryCache;
