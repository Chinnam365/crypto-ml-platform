"use strict";

const PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryApi = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryApi");

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryBootstrap {
  constructor(options = {}) {
    this.api =
      options.api ||
      new PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryApi(
        options
      );

    this.initialized = false;
    this.startedAt = null;
  }

  initialize() {
    if (!this.initialized) {
      this.initialized = true;
      this.startedAt = new Date().toISOString();
    }

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
      component:
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryBootstrap",
      initialized: this.initialized,
      startedAt: this.startedAt,
      api: this.api.status(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryBootstrap;
