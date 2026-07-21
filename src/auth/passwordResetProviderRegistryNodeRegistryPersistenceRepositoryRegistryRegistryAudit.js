"use strict";

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryAudit {
  constructor(options = {}) {
    this.maxEntries = Number(options.maxEntries) || 10000;
    this.entries = [];
  }

  record(action, providerName, metadata = {}) {
    const entry = {
      id: this.#generateId(),
      action,
      providerName,
      metadata,
      timestamp: new Date().toISOString()
    };

    this.entries.push(entry);

    if (this.entries.length > this.maxEntries) {
      this.entries.shift();
    }

    return entry;
  }

  list() {
    return [...this.entries];
  }

  findByProvider(providerName) {
    return this.entries.filter(
      entry => entry.providerName === providerName
    );
  }

  clear() {
    const removed = this.entries.length;
    this.entries.length = 0;

    return {
      removed,
      timestamp: new Date().toISOString()
    };
  }

  count() {
    return this.entries.length;
  }

  #generateId() {
    return [
      Date.now().toString(36),
      Math.random().toString(36).slice(2, 10)
    ].join("-");
  }

  status() {
    return {
      component:
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryAudit",
      entries: this.count(),
      maxEntries: this.maxEntries,
      healthy: true,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryAudit;
