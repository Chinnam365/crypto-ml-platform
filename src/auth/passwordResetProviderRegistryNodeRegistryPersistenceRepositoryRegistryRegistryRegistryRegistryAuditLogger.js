"use strict";

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryAuditLogger {
  constructor(options = {}) {
    this.maxEntries = options.maxEntries || 10000;
    this.entries = [];
  }

  log(action, registryName, metadata = {}) {
    const entry = {
      timestamp: new Date().toISOString(),
      action,
      registryName,
      metadata
    };

    this.entries.push(entry);

    if (this.entries.length > this.maxEntries) {
      this.entries.shift();
    }

    return entry;
  }

  getAll() {
    return [...this.entries];
  }

  getByAction(action) {
    return this.entries.filter(e => e.action === action);
  }

  clear() {
    this.entries.length = 0;
  }

  status() {
    return {
      component:
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryAuditLogger",
      healthy: true,
      entries: this.entries.length,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryAuditLogger;
