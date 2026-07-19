"use strict";

const PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryConstants = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryConstants");

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryConfig {
  constructor(config = {}) {
    this.config = {
      namespace:
        config.namespace ||
        PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryConstants.DEFAULT_NAMESPACE,

      storageKey:
        config.storageKey ||
        PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryConstants.DEFAULT_STORAGE_KEY,

      autoCreate:
        config.autoCreate !== undefined ? config.autoCreate : true,

      validateOnSave:
        config.validateOnSave !== undefined
          ? config.validateOnSave
          : true,

      emitEvents:
        config.emitEvents !== undefined
          ? config.emitEvents
          : true,

      maxRecords:
        Number.isInteger(config.maxRecords)
          ? config.maxRecords
          : 100000,

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
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryConfig",
      config: this.toJSON(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryConfig;
