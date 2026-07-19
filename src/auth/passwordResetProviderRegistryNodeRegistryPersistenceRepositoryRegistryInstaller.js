"use strict";

const PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryPlugin = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryPlugin");

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryInstaller {
  constructor(options = {}) {
    this.plugin =
      options.plugin ||
      new PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryPlugin(
        options
      );

    this.installed = false;
    this.installedAt = null;
  }

  install() {
    if (!this.installed) {
      this.plugin.install();
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

  isInstalled() {
    return this.installed;
  }

  getPlugin() {
    return this.plugin;
  }

  status() {
    return {
      component:
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryInstaller",
      installed: this.installed,
      installedAt: this.installedAt,
      plugin: this.plugin.status(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryInstaller;
