"use strict";

const Constants = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryConstants");

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryOptions {
  constructor(options = {}) {
    this.options = {
      autoInitialize:
        options.autoInitialize ??
        Constants.DEFAULTS.AUTO_INITIALIZE,

      maxRegistries:
        options.maxRegistries ??
        Constants.DEFAULTS.MAX_REGISTRIES,

      caseSensitive:
        options.caseSensitive ??
        Constants.DEFAULTS.CASE_SENSITIVE,

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
    return new PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryOptions(
      this.toJSON()
    );
  }

  toJSON() {
    return { ...this.options };
  }

  status() {
    return {
      component:
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryOptions",
      optionCount: Object.keys(this.options).length,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryOptions;
