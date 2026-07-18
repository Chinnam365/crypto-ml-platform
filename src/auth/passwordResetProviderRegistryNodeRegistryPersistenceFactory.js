"use strict";

const PasswordResetProviderRegistryNodeRegistryPersistence = require("./passwordResetProviderRegistryNodeRegistryPersistence");
const PasswordResetProviderRegistryNodeRegistryPersistenceAdapter = require("./passwordResetProviderRegistryNodeRegistryPersistenceAdapter");

class PasswordResetProviderRegistryNodeRegistryPersistenceFactory {
  constructor(defaultOptions = {}) {
    this.defaultOptions = { ...defaultOptions };
  }

  createPersistence(options = {}) {
    return new PasswordResetProviderRegistryNodeRegistryPersistence({
      ...this.defaultOptions,
      ...options
    });
  }

  createAdapter(options = {}) {
    const persistence =
      options.persistence ||
      this.createPersistence(options);

    return new PasswordResetProviderRegistryNodeRegistryPersistenceAdapter({
      ...this.defaultOptions,
      ...options,
      persistence
    });
  }

  createConnectedAdapter(options = {}) {
    const adapter = this.createAdapter(options);
    adapter.connect();
    return adapter;
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
      factory: "PasswordResetProviderRegistryNodeRegistryPersistenceFactory",
      defaults: this.getDefaults(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = PasswordResetProviderRegistryNodeRegistryPersistenceFactory;
