"use strict";

const PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistry = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistry");
const PasswordResetProviderRegistryNodeRegistryPersistenceRepository = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepository");

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryFactory {
  constructor(defaultOptions = {}) {
    this.defaultOptions = { ...defaultOptions };
  }

  create(options = {}) {
    const settings = {
      ...this.defaultOptions,
      ...options
    };

    const registry =
      new PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistry(
        settings
      );

    if (settings.createDefaultRepository) {
      registry.register(
        "default",
        new PasswordResetProviderRegistryNodeRegistryPersistenceRepository(
          settings
        )
      );
    }

    return registry;
  }

  createBatch(count = 1, options = {}) {
    if (!Number.isInteger(count) || count < 1) {
      throw new TypeError("count must be a positive integer.");
    }

    return Array.from({ length: count }, () => this.create(options));
  }

  getDefaults() {
    return { ...this.defaultOptions };
  }

  setDefaults(defaultOptions = {}) {
    this.defaultOptions = {
      ...this.defaultOptions,
      ...defaultOptions
    };

    return this;
  }

  status() {
    return {
      component:
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryFactory",
      defaults: this.getDefaults(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryFactory;
