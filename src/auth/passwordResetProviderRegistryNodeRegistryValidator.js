"use strict";

const PasswordResetProviderRegistryNodeRegistryConstants = require("./passwordResetProviderRegistryNodeRegistryConstants");

class PasswordResetProviderRegistryNodeRegistryValidator {
  constructor(options = {}) {
    this.options = options;
    this.errors = [];
  }

  validate(config = {}) {
    this.errors = [];

    this.validateName(config.name);
    this.validateVersion(config.version);
    this.validateHost(config.host);
    this.validatePort(config.port);
    this.validateBaseRoute(config.baseRoute);

    return {
      valid: this.errors.length === 0,
      errors: [...this.errors]
    };
  }

  validateName(name) {
    if (typeof name !== "string" || name.trim() === "") {
      this.errors.push("Configuration 'name' must be a non-empty string.");
    }
  }

  validateVersion(version) {
    if (typeof version !== "string" || version.trim() === "") {
      this.errors.push("Configuration 'version' must be a non-empty string.");
    }
  }

  validateHost(host) {
    if (typeof host !== "string" || host.trim() === "") {
      this.errors.push("Configuration 'host' must be a non-empty string.");
    }
  }

  validatePort(port) {
    if (
      !Number.isInteger(port) ||
      port < 1 ||
      port > 65535
    ) {
      this.errors.push("Configuration 'port' must be an integer between 1 and 65535.");
    }
  }

  validateBaseRoute(baseRoute) {
    if (
      typeof baseRoute !== "string" ||
      !baseRoute.startsWith("/")
    ) {
      this.errors.push("Configuration 'baseRoute' must start with '/'.");
    }
  }

  validateDefaults() {
    return this.validate({
      name: PasswordResetProviderRegistryNodeRegistryConstants.NAME,
      version: PasswordResetProviderRegistryNodeRegistryConstants.VERSION,
      host: PasswordResetProviderRegistryNodeRegistryConstants.DEFAULT_HOST,
      port: PasswordResetProviderRegistryNodeRegistryConstants.DEFAULT_PORT,
      baseRoute: PasswordResetProviderRegistryNodeRegistryConstants.BASE_ROUTE
    });
  }

  getErrors() {
    return [...this.errors];
  }

  clearErrors() {
    this.errors = [];
    return this;
  }

  status() {
    return {
      validator: "PasswordResetProviderRegistryNodeRegistryValidator",
      valid: this.errors.length === 0,
      errorCount: this.errors.length,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = PasswordResetProviderRegistryNodeRegistryValidator;
