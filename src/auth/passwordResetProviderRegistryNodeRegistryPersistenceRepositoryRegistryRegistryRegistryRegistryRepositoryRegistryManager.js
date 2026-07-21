"use strict";

const RepositoryRegistry = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryRegistry");
const Repository = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepository");

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryRegistryManager {
  constructor(options = {}) {
    this.registry =
      options.registry || new RepositoryRegistry();
  }

  register(name, repository = new Repository()) {
    return this.registry.register(name, repository);
  }

  resolve(name) {
    return this.registry.get(name);
  }

  unregister(name) {
    return this.registry.remove(name);
  }

  exists(name) {
    return this.registry.has(name);
  }

  list() {
    return this.registry.list();
  }

  clear() {
    this.registry.clear();
  }

  size() {
    return this.registry.size();
  }

  status() {
    return {
      component:
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryRegistryManager",
      healthy: true,
      registrySize: this.size(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryRegistryManager;
