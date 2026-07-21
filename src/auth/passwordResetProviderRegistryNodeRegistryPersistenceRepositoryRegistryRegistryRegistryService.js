"use strict";

const PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryManager = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryManager");

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryService {
  constructor(options = {}) {
    this.manager =
      options.manager ||
      new PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryManager(
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
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryService",
      manager: this.manager.status(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryService;
