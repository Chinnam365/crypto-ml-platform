"use strict";

const PasswordResetProviderRegistryNodeRegistryPersistenceRepository = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepository");
const PasswordResetProviderRegistryNodeRegistryPersistenceStore = require("./passwordResetProviderRegistryNodeRegistryPersistenceStore");
const PasswordResetProviderRegistryNodeRegistryPersistenceSerializer = require("./passwordResetProviderRegistryNodeRegistryPersistenceSerializer");

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryFactory {
  constructor(defaultOptions = {}) {
    this.defaultOptions = { ...defaultOptions };
  }

  create(options = {}) {
    const settings = {
      ...this.defaultOptions,
      ...options
    };

    return new PasswordResetProviderRegistryNodeRegistryPersistenceRepository({
      store:
        settings.store ||
        new PasswordResetProviderRegistryNodeRegistryPersistenceStore(
          settings
        ),
      serializer:
        settings.serializer ||
        new PasswordResetProviderRegistryNodeRegistryPersistenceSerializer(
          settings
        )
    });
  }

  createBatch(count = 1, options = {}) {
    if (!Number.isInteger(count) || count < 1) {
      throw new TypeError(
        "count must be a positive integer."
      );
    }

    return Array.from({ length: count }, () =>
      this.create(options)
    );
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
      factory:
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryFactory",
      defaults: this.getDefaults(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryFactory;
