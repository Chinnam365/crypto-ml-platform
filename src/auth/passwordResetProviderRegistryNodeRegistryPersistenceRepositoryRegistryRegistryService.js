"use strict";

const PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryManager = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryManager");

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryService {
  constructor(options = {}) {
    this.manager =
      options.manager ||
      new PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryManager(
        options
      );
  }

  getManager() {
    return this.manager;
  }

  getRegistryRegistry() {
    return this.manager.getRegistryRegistry();
  }

  getFactory() {
    return this.manager.getFactory();
  }

  register(name, registry) {
    return this.manager.register(name, registry);
  }

  unregister(name) {
    return this.manager.unregister(name);
  }

  get(name = "default") {
    return this.manager.get(name);
  }

  has(name) {
    return this.manager.has(name);
  }

  list() {
    return this.manager.list();
  }

  clear() {
    return this.manager.clear();
  }

  count() {
    return this.manager.count();
  }

  status() {
    return {
      component:
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryService",
      manager: this.manager.status(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryService;
