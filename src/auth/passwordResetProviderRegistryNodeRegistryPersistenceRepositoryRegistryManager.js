"use strict";

const PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryFactory = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryFactory");

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryManager {
  constructor(options = {}) {
    this.factory =
      options.factory ||
      new PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryFactory(
        options
      );

    this.registry =
      options.registry ||
      this.factory.create(options);
  }

  getRegistry() {
    return this.registry;
  }

  getFactory() {
    return this.factory;
  }

  register(name, repository) {
    return this.registry.register(name, repository);
  }

  unregister(name) {
    return this.registry.unregister(name);
  }

  get(name = "default") {
    return this.registry.get(name);
  }

  has(name) {
    return this.registry.has(name);
  }

  list() {
    return this.registry.list();
  }

  clear() {
    this.registry.clear();
    return true;
  }

  count() {
    return this.registry.count();
  }

  status() {
    return {
      component:
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryManager",
      registry: this.registry.status(),
      factory: this.factory.status(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryManager;
