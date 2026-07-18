"use strict";

const PasswordResetProviderRegistryNodeRegistry = require("./passwordResetProviderRegistryNodeRegistry");

class PasswordResetProviderRegistryNodeRegistryFactory {
  constructor(defaultOptions = {}) {
    this.defaultOptions = {
      ...defaultOptions
    };
  }

  create(options = {}) {
    return new PasswordResetProviderRegistryNodeRegistry({
      ...this.defaultOptions,
      ...options
    });
  }

  createSingleton(options = {}) {
    if (!this.singleton) {
      this.singleton = this.create(options);
    }

    return this.singleton;
  }

  hasSingleton() {
    return !!this.singleton;
  }

  resetSingleton() {
    this.singleton = null;

    return this;
  }

  getSingleton() {
    return this.singleton || null;
  }

  status() {
    return {
      factory:
        "PasswordResetProviderRegistryNodeRegistryFactory",
      singleton: this.hasSingleton(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryFactory;
