"use strict";

const PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryApi = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryApi");

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryBootstrap {
  constructor(options = {}) {
    this.options = { ...options };

    this.api =
      options.api ||
      new PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryApi(
        options
      );

    this.initialized = false;
    this.startedAt = null;
  }

  initialize() {
    if (this.initialized) {
      return this.status();
    }

    this.initialized = true;
    this.startedAt = new Date().toISOString();

    return this.status();
  }

  shutdown() {
    this.initialized = false;

    return {
      success: true,
      timestamp: new Date().toISOString()
    };
  }

  getApi() {
    return this.api;
  }

  getRouter() {
    return this.api.getRouter();
  }

  status() {
    return {
      bootstrap:
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryBootstrap",
      initialized: this.initialized,
      startedAt: this.startedAt,
      api: this.api.status(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryBootstrap;
