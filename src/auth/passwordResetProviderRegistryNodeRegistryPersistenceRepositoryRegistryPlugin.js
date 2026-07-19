"use strict";

const PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistrySdk = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistrySdk");

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryPlugin {
  constructor(options = {}) {
    this.sdk =
      options.sdk ||
      new PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistrySdk(
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

  getSdk() {
    return this.sdk;
  }

  getRouter() {
    return this.sdk.getRouter();
  }

  status() {
    return {
      component:
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryPlugin",
      installed: this.installed,
      sdk: this.sdk.status(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryPlugin;
