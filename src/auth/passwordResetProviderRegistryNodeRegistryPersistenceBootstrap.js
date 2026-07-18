"use strict";

const PasswordResetProviderRegistryNodeRegistryPersistenceApi = require("./passwordResetProviderRegistryNodeRegistryPersistenceApi");

class PasswordResetProviderRegistryNodeRegistryPersistenceBootstrap {
  constructor(options = {}) {
    this.api =
      options.api ||
      new PasswordResetProviderRegistryNodeRegistryPersistenceApi(options);

    this.booted = false;
    this.bootedAt = null;
  }

  initialize(app) {
    const status = this.api.initialize(app);

    this.booted = true;
    this.bootedAt = new Date().toISOString();

    return {
      ...status,
      booted: this.booted,
      bootedAt: this.bootedAt
    };
  }

  shutdown() {
    const status = this.api.shutdown();

    this.booted = false;

    return {
      ...status,
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

  getApi() {
    return this.api;
  }

  status() {
    return {
      bootstrap:
        "PasswordResetProviderRegistryNodeRegistryPersistenceBootstrap",
      booted: this.booted,
      bootedAt: this.bootedAt,
      api: this.api.status(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceBootstrap;
