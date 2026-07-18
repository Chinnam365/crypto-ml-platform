"use strict";

const PasswordResetProviderRegistryPlatform = require("./passwordResetProviderRegistryPlatform");

class PasswordResetProviderRegistryApplication {
  constructor(options = {}) {
    this.platform =
      options.platform ||
      new PasswordResetProviderRegistryPlatform(options);

    this.running = false;
  }

  async start(name, app) {
    const result = await this.platform.start(name, app);
    this.running = true;
    return result;
  }

  async stop(name) {
    const result = await this.platform.stop(name);

    if (!this.platform.isOnline()) {
      this.running = false;
    }

    return result;
  }

  async restart(name, app) {
    const result = await this.platform.restart(name, app);
    this.running = true;
    return result;
  }

  isRunning() {
    return this.running;
  }

  getPlatform() {
    return this.platform;
  }

  status() {
    return {
      running: this.running,
      platform: this.platform.status(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = PasswordResetProviderRegistryApplication;
