"use strict";

const PasswordResetProviderRegistryNodeRegistryApi = require("./passwordResetProviderRegistryNodeRegistryApi");

class PasswordResetProviderRegistryNodeRegistryBootstrap {
  constructor(options = {}) {
    this.api =
      options.api ||
      new PasswordResetProviderRegistryNodeRegistryApi(options);

    this.booted = false;
    this.bootedAt = null;
  }

  initialize(app) {
    const result = this.api.initialize(app);

    this.booted = true;
    this.bootedAt = new Date().toISOString();

    return {
      ...result,
      booted: this.booted,
      bootedAt: this.bootedAt
    };
  }

  shutdown() {
    const result = this.api.shutdown();

    this.booted = false;

    return {
      ...result,
      booted: this.booted,
      bootedAt: this.bootedAt
    };
  }

  restart(app) {
    this.shutdown();
    return this.initialize(app);
  }

  isBooted() {
    return this.booted;
  }

  status() {
    return {
      bootstrap:
        "PasswordResetProviderRegistryNodeRegistryBootstrap",
      booted: this.booted,
      bootedAt: this.bootedAt,
      api: this.api.status(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryBootstrap;
