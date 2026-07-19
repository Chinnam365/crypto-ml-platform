"use strict";

const PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryManager = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryManager");

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryService {
  constructor(options = {}) {
    this.manager =
      options.manager ||
      new PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryManager(
        options
      );
  }

  getManager() {
    return this.manager;
  }

  getRegistry() {
    return this.manager.getRegistry();
  }

  getFactory() {
    return this.manager.getFactory();
  }

  register(name, repository) {
    return this.manager.register(name, repository);
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
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryService",
      manager: this.manager.status(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryService;
