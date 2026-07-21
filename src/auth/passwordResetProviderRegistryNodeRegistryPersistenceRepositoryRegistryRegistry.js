"use strict";

const PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistry = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistry");

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistry {
  constructor(options = {}) {
    this.registries = new Map();

    if (
      options.defaultRegistry instanceof
      PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistry
    ) {
      this.register("default", options.defaultRegistry);
    }
  }

  register(name, registry) {
    if (typeof name !== "string" || name.trim() === "") {
      throw new TypeError("Registry name must be a non-empty string.");
    }

    if (
      !(
        registry instanceof
        PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistry
      )
    ) {
      throw new TypeError("Invalid registry instance.");
    }

    this.registries.set(name, registry);

    return registry;
  }

  unregister(name) {
    return this.registries.delete(name);
  }

  get(name = "default") {
    return this.registries.get(name) || null;
  }

  has(name) {
    return this.registries.has(name);
  }

  list() {
    return [...this.registries.keys()];
  }

  clear() {
    this.registries.clear();
  }

  count() {
    return this.registries.size;
  }

  status() {
    return {
      component:
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistry",
      registries: this.list(),
      count: this.count(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistry;
