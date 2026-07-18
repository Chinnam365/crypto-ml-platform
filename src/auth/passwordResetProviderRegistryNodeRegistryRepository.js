"use strict";

const PasswordResetProviderRegistryNodeRegistryFactory = require("./passwordResetProviderRegistryNodeRegistryFactory");

class PasswordResetProviderRegistryNodeRegistryRepository {
  constructor(options = {}) {
    this.factory =
      options.factory ||
      new PasswordResetProviderRegistryNodeRegistryFactory(options);

    this.registry =
      this.factory.create();

    this.createdAt = new Date().toISOString();
  }

  getRegistry() {
    return this.registry;
  }

  save(registry) {
    this.registry = registry;
    return this.registry;
  }

  reset() {
    this.registry =
      this.factory.create();

    return this.registry;
  }

  exists() {
    return !!this.registry;
  }

  created() {
    return this.createdAt;
  }

  status() {
    return {
      repository:
        "PasswordResetProviderRegistryNodeRegistryRepository",
      exists: this.exists(),
      createdAt: this.createdAt,
      registry: this.registry.status(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryRepository;
