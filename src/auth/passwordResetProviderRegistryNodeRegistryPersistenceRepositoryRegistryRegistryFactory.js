"use strict";

const PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistry = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistry");
const PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistry = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistry");

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryFactory {
  constructor(defaultOptions = {}) {
    this.defaultOptions = { ...defaultOptions };
  }

  create(options = {}) {
    const settings = {
      ...this.defaultOptions,
      ...options
    };

    const registryRegistry =
      new PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistry(
        settings
      );

    if (settings.createDefaultRegistry) {
      registryRegistry.register(
        "default",
        new PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistry(
          settings
        )
      );
    }

    return registryRegistry;
  }

  createBatch(count = 1, options = {}) {
    if (!Number.isInteger(count) || count < 1) {
      throw new TypeError("count must be a positive integer.");
    }

    return Array.from({ length: count }, () => this.create(options));
  }

  setDefaults(defaultOptions = {}) {
    this.defaultOptions = {
      ...this.defaultOptions,
      ...defaultOptions
    };

    return this;
  }

  getDefaults() {
    return {
      ...this.defaultOptions
    };
  }

  status() {
    return {
      component:
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryFactory",
      defaults: this.getDefaults(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryFactory;
