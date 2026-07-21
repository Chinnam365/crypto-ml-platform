"use strict";

const Constants = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryConstants");
const {
  InvalidProviderError,
  InvalidProviderNameError
} = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryErrors");

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryValidator {
  validateName(name) {
    if (typeof name !== "string") {
      throw new InvalidProviderNameError(name);
    }

    const normalized = name.trim();

    if (!normalized.length) {
      throw new InvalidProviderNameError(name);
    }

    return normalized;
  }

  validateProvider(provider) {
    if (provider === null || provider === undefined) {
      throw new InvalidProviderError(provider);
    }

    const type = typeof provider;

    if (type !== "object" && type !== "function") {
      throw new InvalidProviderError(provider);
    }

    return provider;
  }

  validateRegistration(name, provider) {
    return {
      name: this.validateName(name),
      provider: this.validateProvider(provider)
    };
  }

  validateCapacity(currentCount) {
    if (currentCount >= Constants.DEFAULTS.MAX_PROVIDERS) {
      throw new Error(
        `Maximum provider limit (${Constants.DEFAULTS.MAX_PROVIDERS}) reached.`
      );
    }

    return true;
  }

  validate(name, provider, currentCount = 0) {
    this.validateCapacity(currentCount);
    return this.validateRegistration(name, provider);
  }

  status() {
    return {
      component:
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryValidator",
      healthy: true,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryValidator;
