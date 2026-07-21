"use strict";

const PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryBootstrap = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryBootstrap");

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryHealth {
  constructor(options = {}) {
    this.bootstrap =
      options.bootstrap ||
      new PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryBootstrap(
        options
      );
  }

  check() {
    const status = this.bootstrap.status();

    return {
      component:
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryHealth",
      healthy: true,
      state: this.bootstrap.initialized ? "UP" : "DOWN",
      uptimeStartedAt: status.startedAt,
      dependencies: {
        api: status.api
      },
      timestamp: new Date().toISOString()
    };
  }

  readiness() {
    return {
      ready: this.bootstrap.initialized,
      timestamp: new Date().toISOString()
    };
  }

  liveness() {
    return {
      alive: true,
      timestamp: new Date().toISOString()
    };
  }

  status() {
    return this.check();
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryHealth;
