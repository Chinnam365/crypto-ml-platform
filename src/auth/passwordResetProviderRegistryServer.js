"use strict";

const PasswordResetProviderRegistrySystem = require("./passwordResetProviderRegistrySystem");

class PasswordResetProviderRegistryServer {
  constructor(options = {}) {
    this.system =
      options.system ||
      new PasswordResetProviderRegistrySystem(options);

    this.started = false;
  }

  async start(name, app) {
    const result = await this.system.start(name, app);
    this.started = true;
    return result;
  }

  async stop(name) {
    const result = await this.system.stop(name);

    if (!this.system.isOnline()) {
      this.started = false;
    }

    return result;
  }

  async restart(name, app) {
    const result = await this.system.restart(name, app);
    this.started = true;
    return result;
  }

  isStarted() {
    return this.started;
  }

  getSystem() {
    return this.system;
  }

  status() {
    return {
      started: this.started,
      system: this.system.status(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = PasswordResetProviderRegistryServer;
