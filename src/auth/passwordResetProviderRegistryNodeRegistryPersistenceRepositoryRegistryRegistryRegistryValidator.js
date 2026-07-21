"use strict";

const Constants = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryConstants");
const {
  InvalidRegistryError,
  InvalidRegistryNameError
} = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryErrors");

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryValidator {
  validateName(name) {
    if (typeof name !== "string") {
      throw new InvalidRegistryNameError(name);
    }

    const normalized = name.trim();

    if (!normalized.length) {
      throw new InvalidRegistryNameError(name);
    }

    return normalized;
  }

  validateRegistry(registry) {
    if (registry === null || registry === undefined) {
      throw new InvalidRegistryError(registry);
    }

    const type = typeof registry;

    if (type !== "object" && type !== "function") {
      throw new InvalidRegistryError(registry);
    }

    return registry;
  }

  validateCreation(name, registry) {
    return {
      name: this.validateName(name),
      registry: this.validateRegistry(registry)
    };
  }

  validateCapacity(currentCount) {
    if (currentCount >= Constants.DEFAULTS.MAX_REGISTRIES) {
      throw new Error(
        `Maximum registry limit (${Constants.DEFAULTS.MAX_REGISTRIES}) reached.`
      );
    }

    return true;
  }

  validate(name, registry, currentCount = 0) {
    this.validateCapacity(currentCount);
    return this.validateCreation(name, registry);
  }

  status() {
    return {
      component:
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryValidator",
      healthy: true,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryValidator;
