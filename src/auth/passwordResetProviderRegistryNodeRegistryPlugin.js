"use strict";

const PasswordResetProviderRegistryNodeRegistrySdk = require("./passwordResetProviderRegistryNodeRegistrySdk");

class PasswordResetProviderRegistryNodeRegistryPlugin {
  constructor(options = {}) {
    this.sdk =
      options.sdk ||
      new PasswordResetProviderRegistryNodeRegistrySdk(options);

    this.name =
      options.name || "password-reset-provider-registry-node-registry";

    this.version =
      options.version || "1.0.0";

    this.enabled = false;
  }

  install(app) {
    if (!this.enabled) {
      this.sdk.initialize(app);
      this.enabled = true;
    }

    return this.status();
  }

  uninstall() {
    if (this.enabled) {
      this.sdk.shutdown();
      this.enabled = false;
    }

    return this.status();
  }

  enable(app) {
    return this.install(app);
  }

  disable() {
    return this.uninstall();
  }

  isEnabled() {
    return this.enabled;
  }

  getSdk() {
    return this.sdk;
  }

  getService() {
    return this.sdk.getService();
  }

  getController() {
    return this.sdk.getController();
  }

  getRouter() {
    return this.sdk.getRouter();
  }

  status() {
    return {
      plugin: "PasswordResetProviderRegistryNodeRegistryPlugin",
      name: this.name,
      version: this.version,
      enabled: this.enabled,
      sdk: this.sdk.status(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = PasswordResetProviderRegistryNodeRegistryPlugin;
