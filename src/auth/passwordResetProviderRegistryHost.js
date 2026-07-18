"use strict";

const PasswordResetProviderRegistryServer = require("./passwordResetProviderRegistryServer");

class PasswordResetProviderRegistryHost {
  constructor(options = {}) {
    this.server =
      options.server ||
      new PasswordResetProviderRegistryServer(options);

    this.hosting = false;
  }

  async start(name, app) {
    const result = await this.server.start(name, app);
    this.hosting = true;
    return result;
  }

  async stop(name) {
    const result = await this.server.stop(name);

    if (!this.server.isStarted()) {
      this.hosting = false;
    }

    return result;
  }

  async restart(name, app) {
    const result = await this.server.restart(name, app);
    this.hosting = true;
    return result;
  }

  isHosting() {
    return this.hosting;
  }

  getServer() {
    return this.server;
  }

  status() {
    return {
      hosting: this.hosting,
      server: this.server.status(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = PasswordResetProviderRegistryHost;
