"use strict";

const PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryBootstrap = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryBootstrap");

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryHealth {
  constructor(options = {}) {
    this.bootstrap =
      options.bootstrap ||
      new PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryBootstrap(
        options
      );
  }

  check() {
    const status = this.bootstrap.status();

    return {
      component:
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryHealth",
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
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryHealth;
