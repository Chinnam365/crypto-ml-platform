"use strict";

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryAuditLogger {
  constructor(options = {}) {
    this.maxEntries = options.maxEntries || 10000;
    this.logs = [];
  }

  log(action, repositoryName, metadata = {}) {
    const entry = {
      timestamp: new Date().toISOString(),
      action,
      repositoryName,
      metadata
    };

    this.logs.push(entry);

    if (this.logs.length > this.maxEntries) {
      this.logs.shift();
    }

    return entry;
  }

  getAll() {
    return [...this.logs];
  }

  getByAction(action) {
    return this.logs.filter(log => log.action === action);
  }

  getByRepository(repositoryName) {
    return this.logs.filter(
      log => log.repositoryName === repositoryName
    );
  }

  clear() {
    this.logs.length = 0;
  }

  status() {
    return {
      component:
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryAuditLogger",
      healthy: true,
      entries: this.logs.length,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryAuditLogger;
