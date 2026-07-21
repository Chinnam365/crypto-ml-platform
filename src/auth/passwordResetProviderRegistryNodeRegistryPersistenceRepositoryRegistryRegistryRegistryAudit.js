"use strict";

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryAudit {
  constructor(options = {}) {
    this.maxEntries = Number(options.maxEntries) || 10000;
    this.entries = [];
  }

  record(action, registryName, metadata = {}) {
    const entry = {
      id: this.#generateId(),
      action,
      registryName,
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

  findByRegistry(registryName) {
    return this.entries.filter(
      entry => entry.registryName === registryName
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
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryAudit",
      entries: this.count(),
      maxEntries: this.maxEntries,
      healthy: true,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryAudit;
