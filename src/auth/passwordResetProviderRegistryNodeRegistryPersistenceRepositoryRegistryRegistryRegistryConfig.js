"use strict";

const Constants = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryConstants");

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryConfig {
  constructor(config = {}) {
    this.config = {
      autoInitialize:
        config.autoInitialize ??
        Constants.DEFAULTS.AUTO_INITIALIZE,

      maxRegistries:
        config.maxRegistries ??
        Constants.DEFAULTS.MAX_REGISTRIES,

      caseSensitive:
        config.caseSensitive ??
        Constants.DEFAULTS.CASE_SENSITIVE,

      ...config
    };
  }

  get(key, defaultValue = undefined) {
    return Object.prototype.hasOwnProperty.call(this.config, key)
      ? this.config[key]
      : defaultValue;
  }

  set(key, value) {
    this.config[key] = value;
    return value;
  }

  has(key) {
    return Object.prototype.hasOwnProperty.call(this.config, key);
  }

  remove(key) {
    const existed = this.has(key);
    delete this.config[key];
    return existed;
  }

  merge(values = {}) {
    Object.assign(this.config, values);
    return this.toJSON();
  }

  reset() {
    this.config = {
      autoInitialize: Constants.DEFAULTS.AUTO_INITIALIZE,
      maxRegistries: Constants.DEFAULTS.MAX_REGISTRIES,
      caseSensitive: Constants.DEFAULTS.CASE_SENSITIVE
    };

    return this.toJSON();
  }

  toJSON() {
    return { ...this.config };
  }

  status() {
    return {
      component:
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryConfig",
      configuration: this.toJSON(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryConfig;
