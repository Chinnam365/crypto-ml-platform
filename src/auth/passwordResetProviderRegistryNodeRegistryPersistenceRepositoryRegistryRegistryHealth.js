"use strict";

const PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryBootstrap = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryBootstrap");

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryHealth {
  constructor(options = {}) {
    this.bootstrap =
      options.bootstrap ||
      new PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryBootstrap(
        options
      );
  }

  check() {
    const status = this.bootstrap.status();

    return {
      component:
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryHealth",
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
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryHealth;
