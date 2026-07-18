"use strict";

const PasswordResetProviderRegistryPlugin = require("./passwordResetProviderRegistryPlugin");

class PasswordResetProviderRegistryInstaller {
  constructor(options = {}) {
    this.plugin =
      options.plugin ||
      new PasswordResetProviderRegistryPlugin(options);

    this.installed = false;
  }

  async install(app) {
    const status = await this.plugin.install(app);
    this.installed = true;
    return status;
  }

  async uninstall() {
    const status = await this.plugin.uninstall();
    this.installed = false;
    return status;
  }

  async reinstall(app) {
    await this.uninstall();
    return this.install(app);
  }

  isInstalled() {
    return this.installed;
  }

  getPlugin() {
    return this.plugin;
  }

  status() {
    return {
      installed: this.installed,
      plugin: this.plugin.status(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = PasswordResetProviderRegistryInstaller;
