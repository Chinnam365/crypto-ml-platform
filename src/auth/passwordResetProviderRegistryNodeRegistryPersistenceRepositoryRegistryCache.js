"use strict";

const PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryConstants = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryConstants");

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryCache {
  constructor(options = {}) {
    this.namespace =
      options.namespace ||
      PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryConstants.DEFAULT_NAMESPACE;

    this.cache = new Map();

    this.maxEntries =
      Number.isInteger(options.maxEntries) && options.maxEntries > 0
        ? options.maxEntries
        : 1000;
  }

  set(key, value) {
    if (this.cache.size >= this.maxEntries && !this.cache.has(key)) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, {
      value,
      cachedAt: new Date().toISOString()
    });

    return value;
  }

  get(key) {
    const entry = this.cache.get(key);
    return entry ? entry.value : undefined;
  }

  has(key) {
    return this.cache.has(key);
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

  keys() {
    return [...this.cache.keys()];
  }

  values() {
    return [...this.cache.values()].map((entry) => entry.value);
  }

  entries() {
    return [...this.cache.entries()].map(([key, entry]) => [
      key,
      entry.value
    ]);
  }

  status() {
    return {
      component:
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryCache",
      namespace: this.namespace,
      entries: this.size(),
      maxEntries: this.maxEntries,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryCache;
