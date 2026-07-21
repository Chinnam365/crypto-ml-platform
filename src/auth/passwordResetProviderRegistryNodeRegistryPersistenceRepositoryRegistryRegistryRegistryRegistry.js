"use strict";

const PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryContainer = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryContainer");

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistry {
  constructor(options = {}) {
    this.container =
      options.container ||
      new PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryContainer(
        options
      );
  }

  resolve(name) {
    return this.container.resolve(name);
  }

  register(name, instance) {
    this.container.register(name, instance);
    return this;
  }

  unregister(name) {
    return this.container.unregister(name);
  }

  has(name) {
    return this.container.has(name);
  }

  list() {
    return this.container.keys();
  }

  entries() {
    return this.container.entries();
  }

  clear() {
    this.container.clear();
    return this;
  }

  status() {
    return {
      component:
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistry",
      components: this.list(),
      count: this.list().length,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistry;
