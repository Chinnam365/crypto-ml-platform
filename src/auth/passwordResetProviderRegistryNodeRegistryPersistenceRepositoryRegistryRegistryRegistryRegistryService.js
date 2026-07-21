"use strict";

const PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryManager = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryManager");

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryService {
  constructor(options = {}) {
    this.manager =
      options.manager ||
      new PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryManager(
        options
      );
  }

  create(name, options = {}) {
    return this.manager.create(name, options);
  }

  get(name) {
    return this.manager.get(name);
  }

  has(name) {
    return this.manager.has(name);
  }

  remove(name) {
    return this.manager.remove(name);
  }

  list() {
    return this.manager.list();
  }

  entries() {
    return this.manager.entries();
  }

  count() {
    return this.manager.count();
  }

  clear() {
    return this.manager.clear();
  }

  status() {
    return {
      component:
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryService",
      manager: this.manager.status(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryService;
