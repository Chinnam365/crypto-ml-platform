"use strict";

const PasswordResetProviderRegistryNodeRegistryPersistenceSdk = require("./passwordResetProviderRegistryNodeRegistryPersistenceSdk");

class PasswordResetProviderRegistryNodeRegistryPersistencePlugin {
  constructor(options = {}) {
    this.sdk =
      options.sdk ||
      new PasswordResetProviderRegistryNodeRegistryPersistenceSdk(options);

    this.name =
      options.name ||
      "password-reset-provider-registry-node-registry-persistence";

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

  getClient() {
    return this.sdk.getClient();
  }

  getFacade() {
    return this.sdk.getFacade();
  }

  getApi() {
    return this.sdk.getApi();
  }

  getModule() {
    return this.sdk.getModule();
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
      plugin:
        "PasswordResetProviderRegistryNodeRegistryPersistencePlugin",
      name: this.name,
      version: this.version,
      enabled: this.enabled,
      sdk: this.sdk.status(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistencePlugin;
