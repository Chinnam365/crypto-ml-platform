"use strict";

const PasswordResetProviderRegistryKernel = require("./passwordResetProviderRegistryKernel");

class PasswordResetProviderRegistryPlatform {
  constructor(options = {}) {
    this.kernel =
      options.kernel ||
      new PasswordResetProviderRegistryKernel(options);

    this.online = false;
  }

  async start(name, app) {
    const result = await this.kernel.initialize(name, app);
    this.online = true;
    return result;
  }

  async stop(name) {
    const result = await this.kernel.terminate(name);

    if (!this.kernel.isInitialized()) {
      this.online = false;
    }

    return result;
  }

  async restart(name, app) {
    const result = await this.kernel.reload(name, app);
    this.online = true;
    return result;
  }

  isOnline() {
    return this.online;
  }

  getKernel() {
    return this.kernel;
  }

  status() {
    return {
      online: this.online,
      kernel: this.kernel.status(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = PasswordResetProviderRegistryPlatform;
