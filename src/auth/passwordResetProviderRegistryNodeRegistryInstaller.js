"use strict";

const PasswordResetProviderRegistryNodeRegistryPlugin = require("./passwordResetProviderRegistryNodeRegistryPlugin");

class PasswordResetProviderRegistryNodeRegistryInstaller {
  constructor(options = {}) {
    this.plugin =
      options.plugin ||
      new PasswordResetProviderRegistryNodeRegistryPlugin(options);

    this.installed = false;
    this.installedAt = null;
  }

  install(app) {
    if (!this.installed) {
      this.plugin.install(app);
      this.installed = true;
      this.installedAt = new Date().toISOString();
    }

    return this.status();
  }

  uninstall() {
    if (this.installed) {
      this.plugin.uninstall();
      this.installed = false;
    }

    return this.status();
  }

  reinstall(app) {
    this.uninstall();
    return this.install(app);
  }

  isInstalled() {
    return this.installed;
  }

  getPlugin() {
    return this.plugin;
  }

  getSdk() {
    return this.plugin.getSdk();
  }

  getService() {
    return this.plugin.getService();
  }

  getController() {
    return this.plugin.getController();
  }

  getRouter() {
    return this.plugin.getRouter();
  }

  status() {
    return {
      installer: "PasswordResetProviderRegistryNodeRegistryInstaller",
      installed: this.installed,
      installedAt: this.installedAt,
      plugin: this.plugin.status(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = PasswordResetProviderRegistryNodeRegistryInstaller;
