"use strict";

const PasswordResetProviderRegistryInstaller = require("./passwordResetProviderRegistryInstaller");

class PasswordResetProviderRegistryRegistrar {
  constructor(options = {}) {
    this.installer =
      options.installer ||
      new PasswordResetProviderRegistryInstaller(options);

    this.registrations = new Map();
  }

  async register(name, app) {
    const status = await this.installer.install(app);

    this.registrations.set(name, {
      name,
      installedAt: new Date().toISOString(),
      status
    });

    return this.registrations.get(name);
  }

  async unregister(name) {
    if (!this.registrations.has(name)) {
      return false;
    }

    await this.installer.uninstall();
    this.registrations.delete(name);

    return true;
  }

  get(name) {
    return this.registrations.get(name) || null;
  }

  list() {
    return Array.from(this.registrations.values());
  }

  clear() {
    this.registrations.clear();
  }

  status() {
    return {
      registered: this.registrations.size,
      installer: this.installer.status(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = PasswordResetProviderRegistryRegistrar;
