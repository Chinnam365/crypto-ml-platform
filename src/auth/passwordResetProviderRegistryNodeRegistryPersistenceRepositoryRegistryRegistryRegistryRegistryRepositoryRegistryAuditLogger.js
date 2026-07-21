"use strict";

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryRegistryAuditLogger {
  constructor(options = {}) {
    this.maxEntries = options.maxEntries || 10000;
    this.entries = [];
  }

  log(action, registryName, repositoryName, metadata = {}) {
    const entry = {
      timestamp: new Date().toISOString(),
      action,
      registryName,
      repositoryName,
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
    return this.entries.filter(entry => entry.action === action);
  }

  getByRegistry(registryName) {
    return this.entries.filter(
      entry => entry.registryName === registryName
    );
  }

  clear() {
    this.entries.length = 0;
  }

  status() {
    return {
      component:
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryRegistryAuditLogger",
      healthy: true,
      entries: this.entries.length,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryRegistryAuditLogger;
