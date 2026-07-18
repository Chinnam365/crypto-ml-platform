"use strict";

const PasswordResetProviderRegistryManager = require("./passwordResetProviderRegistryManager");

class PasswordResetProviderRegistryBootstrap {
  constructor(options = {}) {
    this.manager =
      options.manager ||
      new PasswordResetProviderRegistryManager();

    this.bootstrapped = false;
    this.bootstrappedAt = null;
  }

  async bootstrap() {
    if (this.bootstrapped) {
      return this.status();
    }

    await this.manager.start();

    this.bootstrapped = true;
    this.bootstrappedAt = new Date().toISOString();

    return this.status();
  }

  async shutdown() {
    if (!this.bootstrapped) {
      return this.status();
    }

    await this.manager.stop();

    this.bootstrapped = false;

    return this.status();
  }

  async restart() {
    await this.shutdown();
    return this.bootstrap();
  }

  status() {
    return {
      bootstrapped: this.bootstrapped,
      bootstrappedAt: this.bootstrappedAt,
      providerCount: this.manager.list().length,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryBootstrap;
