"use strict";

const PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryConstants = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryConstants");

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryConfig {
  constructor(config = {}) {
    this.config = {
      namespace:
        config.namespace ||
        PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryConstants.DEFAULT_NAMESPACE,

      registryName:
        config.registryName ||
        PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryConstants.DEFAULT_REGISTRY_NAME,

      autoCreate:
        config.autoCreate !== undefined ? config.autoCreate : true,

      allowOverwrite:
        config.allowOverwrite !== undefined
          ? config.allowOverwrite
          : false,

      emitEvents:
        config.emitEvents !== undefined
          ? config.emitEvents
          : true,

      maxRepositories:
        Number.isInteger(config.maxRepositories)
          ? config.maxRepositories
          : 1000,

      createdAt: new Date().toISOString()
    };
  }

  get(key) {
    return this.config[key];
  }

  set(key, value) {
    this.config[key] = value;
    return this;
  }

  has(key) {
    return Object.prototype.hasOwnProperty.call(this.config, key);
  }

  merge(values = {}) {
    Object.assign(this.config, values);
    return this;
  }

  toJSON() {
    return { ...this.config };
  }

  status() {
    return {
      component:
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryConfig",
      config: this.toJSON(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryConfig;
