"use strict";

const PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryContainer = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryContainer");

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistry {
  constructor(options = {}) {
    this.container =
      options.container ||
      new PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryContainer(
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
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistry",
      components: this.list(),
      count: this.list().length,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistry;
