"use strict";

const PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryBuilder = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryBuilder");

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryContainer {
  constructor(options = {}) {
    this.builder =
      options.builder ||
      new PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryBuilder(
        options
      );

    this.components = this.builder.build();
  }

  resolve(name) {
    return this.components[name];
  }

  has(name) {
    return Object.prototype.hasOwnProperty.call(this.components, name);
  }

  register(name, instance) {
    this.components[name] = instance;
    return instance;
  }

  unregister(name) {
    const instance = this.components[name];
    delete this.components[name];
    return instance;
  }

  keys() {
    return Object.keys(this.components);
  }

  values() {
    return Object.values(this.components);
  }

  entries() {
    return Object.entries(this.components);
  }

  clear() {
    this.components = {};
    return true;
  }

  status() {
    return {
      component:
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryContainer",
      registeredComponents: this.keys(),
      count: this.keys().length,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryContainer;
