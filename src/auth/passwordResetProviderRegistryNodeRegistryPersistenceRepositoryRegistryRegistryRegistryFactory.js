"use strict";

const PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistry = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistry");

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryFactory {
  constructor(options = {}) {
    this.options = { ...options };
  }

  create(options = {}) {
    return new PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistry({
      ...this.options,
      ...options
    });
  }

  createMany(count = 1, options = {}) {
    if (!Number.isInteger(count) || count < 1) {
      throw new TypeError("Count must be a positive integer.");
    }

    return Array.from({ length: count }, () => this.create(options));
  }

  clone(registry) {
    if (
      !(
        registry instanceof
        PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistry
      )
    ) {
      throw new TypeError("Invalid registry instance.");
    }

    return this.create();
  }

  status() {
    return {
      component:
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryFactory",
      ready: true,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryFactory;
