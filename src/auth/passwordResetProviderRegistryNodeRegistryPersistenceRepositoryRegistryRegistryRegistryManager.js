"use strict";

const PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryFactory = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryFactory");

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryManager {
  constructor(options = {}) {
    this.factory =
      options.factory ||
      new PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryFactory(
        options
      );

    this.registries = new Map();
  }

  create(name, options = {}) {
    if (this.registries.has(name)) {
      return this.registries.get(name);
    }

    const registry = this.factory.create(options);

    this.registries.set(name, registry);

    return registry;
  }

  get(name) {
    return this.registries.get(name) || null;
  }

  has(name) {
    return this.registries.has(name);
  }

  remove(name) {
    const registry = this.get(name);

    this.registries.delete(name);

    return registry;
  }

  clear() {
    this.registries.clear();
    return true;
  }

  list() {
    return Array.from(this.registries.keys());
  }

  entries() {
    return Array.from(this.registries.entries());
  }

  count() {
    return this.registries.size;
  }

  status() {
    return {
      component:
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryManager",
      registryCount: this.count(),
      registries: this.list(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryManager;
