"use strict";

const PasswordResetProviderRegistryNodeRegistryConstants = require("./passwordResetProviderRegistryNodeRegistryConstants");

class PasswordResetProviderRegistryNodeRegistryConfig {
  constructor(config = {}) {
    this.config = {
      name:
        config.name ||
        PasswordResetProviderRegistryNodeRegistryConstants.NAME,

      version:
        config.version ||
        PasswordResetProviderRegistryNodeRegistryConstants.VERSION,

      host:
        config.host ||
        PasswordResetProviderRegistryNodeRegistryConstants.DEFAULT_HOST,

      port:
        config.port ||
        PasswordResetProviderRegistryNodeRegistryConstants.DEFAULT_PORT,

      baseRoute:
        config.baseRoute ||
        PasswordResetProviderRegistryNodeRegistryConstants.BASE_ROUTE,

      timeoutMs:
        config.timeoutMs ||
        PasswordResetProviderRegistryNodeRegistryConstants.DEFAULT_TIMEOUT_MS,

      retryAttempts:
        config.retryAttempts ||
        PasswordResetProviderRegistryNodeRegistryConstants.DEFAULT_RETRY_ATTEMPTS,

      retryDelayMs:
        config.retryDelayMs ||
        PasswordResetProviderRegistryNodeRegistryConstants.DEFAULT_RETRY_DELAY_MS,

      healthCheckIntervalMs:
        config.healthCheckIntervalMs ||
        PasswordResetProviderRegistryNodeRegistryConstants.DEFAULT_HEALTH_CHECK_INTERVAL_MS
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

  remove(key) {
    delete this.config[key];
    return this;
  }

  merge(config = {}) {
    this.config = {
      ...this.config,
      ...config
    };

    return this;
  }

  reset() {
    this.config = {
      name: PasswordResetProviderRegistryNodeRegistryConstants.NAME,
      version: PasswordResetProviderRegistryNodeRegistryConstants.VERSION,
      host: PasswordResetProviderRegistryNodeRegistryConstants.DEFAULT_HOST,
      port: PasswordResetProviderRegistryNodeRegistryConstants.DEFAULT_PORT,
      baseRoute: PasswordResetProviderRegistryNodeRegistryConstants.BASE_ROUTE,
      timeoutMs:
        PasswordResetProviderRegistryNodeRegistryConstants.DEFAULT_TIMEOUT_MS,
      retryAttempts:
        PasswordResetProviderRegistryNodeRegistryConstants.DEFAULT_RETRY_ATTEMPTS,
      retryDelayMs:
        PasswordResetProviderRegistryNodeRegistryConstants.DEFAULT_RETRY_DELAY_MS,
      healthCheckIntervalMs:
        PasswordResetProviderRegistryNodeRegistryConstants.DEFAULT_HEALTH_CHECK_INTERVAL_MS
    };

    return this;
  }

  toJSON() {
    return {
      ...this.config
    };
  }

  status() {
    return {
      config: "PasswordResetProviderRegistryNodeRegistryConfig",
      values: this.toJSON(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = PasswordResetProviderRegistryNodeRegistryConfig;
