"use strict";

const PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryConstants = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryConstants");

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryOptions {
  constructor(options = {}) {
    this.options = {
      autoInitialize:
        options.autoInitialize ??
        PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryConstants.DEFAULTS.AUTO_INITIALIZE,

      maxProviders:
        options.maxProviders ??
        PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryConstants.DEFAULTS.MAX_PROVIDERS,

      caseSensitive:
        options.caseSensitive ??
        PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryConstants.DEFAULTS.CASE_SENSITIVE,

      ...options
    };
  }

  get(name, defaultValue = undefined) {
    return Object.prototype.hasOwnProperty.call(this.options, name)
      ? this.options[name]
      : defaultValue;
  }

  set(name, value) {
    this.options[name] = value;
    return this;
  }

  has(name) {
    return Object.prototype.hasOwnProperty.call(this.options, name);
  }

  delete(name) {
    const existed = this.has(name);
    delete this.options[name];
    return existed;
  }

  merge(options = {}) {
    Object.assign(this.options, options);
    return this;
  }

  clone() {
    return new PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryOptions(
      this.toJSON()
    );
  }

  toJSON() {
    return { ...this.options };
  }

  status() {
    return {
      component:
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryOptions",
      optionCount: Object.keys(this.options).length,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryOptions;
