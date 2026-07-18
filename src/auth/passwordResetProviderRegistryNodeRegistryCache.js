"use strict";

class PasswordResetProviderRegistryNodeRegistryCache {
  constructor(options = {}) {
    this.maxEntries = Number.isInteger(options.maxEntries)
      ? options.maxEntries
      : 1000;

    this.defaultTtlMs = Number.isInteger(options.defaultTtlMs)
      ? options.defaultTtlMs
      : 5 * 60 * 1000;

    this.cache = new Map();
  }

  set(key, value, ttlMs = this.defaultTtlMs) {
    const expiresAt = Date.now() + ttlMs;

    this.cache.set(key, {
      value,
      expiresAt,
      createdAt: new Date().toISOString()
    });

    this.evictIfNeeded();

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
  }

  cleanup() {
    const now = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      if (entry.expiresAt <= now) {
        this.cache.delete(key);
      }
    }

    return this.cache.size;
  }

  keys() {
    this.cleanup();
    return Array.from(this.cache.keys());
  }

  size() {
    this.cleanup();
    return this.cache.size;
  }

  evictIfNeeded() {
    while (this.cache.size > this.maxEntries) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
  }

  status() {
    this.cleanup();

    return {
      cache: "PasswordResetProviderRegistryNodeRegistryCache",
      entries: this.cache.size,
      maxEntries: this.maxEntries,
      defaultTtlMs: this.defaultTtlMs,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = PasswordResetProviderRegistryNodeRegistryCache;
