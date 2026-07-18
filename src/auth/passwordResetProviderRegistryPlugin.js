"use strict";

const PasswordResetProviderRegistrySdk = require("./passwordResetProviderRegistrySdk");

class PasswordResetProviderRegistryPlugin {
  constructor(options = {}) {
    this.sdk =
      options.sdk ||
      new PasswordResetProviderRegistrySdk(options);

    this.initialized = false;
  }

  async install(app) {
    if (!this.initialized) {
      await this.sdk.initialize(app);
      this.initialized = true;
    }

    return this.status();
  }

  async uninstall() {
    if (this.initialized) {
      await this.sdk.shutdown();
      this.initialized = false;
    }

    return this.status();
  }

  getSdk() {
    return this.sdk;
  }

  isInstalled() {
    return this.initialized;
  }

  status() {
    return {
      installed: this.initialized,
      sdk: this.sdk.status(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = PasswordResetProviderRegistryPlugin;
