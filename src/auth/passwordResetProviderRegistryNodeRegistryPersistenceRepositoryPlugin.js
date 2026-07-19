"use strict";

const PasswordResetProviderRegistryNodeRegistryPersistenceRepositorySdk = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositorySdk");

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryPlugin {
  constructor(options = {}) {
    this.sdk =
      options.sdk ||
      new PasswordResetProviderRegistryNodeRegistryPersistenceRepositorySdk(
        options
      );

    this.installed = false;
  }

  install() {
    this.installed = true;

    return {
      success: true,
      installed: this.installed,
      timestamp: new Date().toISOString()
    };
  }

  uninstall() {
    this.installed = false;

    return {
      success: true,
      installed: this.installed,
      timestamp: new Date().toISOString()
    };
  }

  getRouter() {
    return this.sdk.getRouter();
  }

  getSdk() {
    return this.sdk;
  }

  status() {
    return {
      plugin:
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryPlugin",
      installed: this.installed,
      sdk: this.sdk.status(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryPlugin;
