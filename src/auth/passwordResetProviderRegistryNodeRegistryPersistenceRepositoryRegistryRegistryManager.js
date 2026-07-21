"use strict";

const PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryFactory = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryFactory");

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryManager {
  constructor(options = {}) {
    this.factory =
      options.factory ||
      new PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryFactory(
        options
      );

    this.registryRegistry =
      options.registryRegistry ||
      this.factory.create(options);
  }

  getRegistryRegistry() {
    return this.registryRegistry;
  }

  getFactory() {
    return this.factory;
  }

  register(name, registry) {
    return this.registryRegistry.register(name, registry);
  }

  unregister(name) {
    return this.registryRegistry.unregister(name);
  }

  get(name = "default") {
    return this.registryRegistry.get(name);
  }

  has(name) {
    return this.registryRegistry.has(name);
  }

  list() {
    return this.registryRegistry.list();
  }

  clear() {
    this.registryRegistry.clear();
    return true;
  }

  count() {
    return this.registryRegistry.count();
  }

  status() {
    return {
      component:
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryManager",
      registryRegistry: this.registryRegistry.status(),
      factory: this.factory.status(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryManager;
