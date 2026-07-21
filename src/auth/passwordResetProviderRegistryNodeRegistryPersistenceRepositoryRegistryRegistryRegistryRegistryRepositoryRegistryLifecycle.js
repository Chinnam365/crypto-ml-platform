"use strict";

const RepositoryRegistry = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryRegistry");

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryRegistryLifecycle {
  constructor(options = {}) {
    this.registry =
      options.registry || new RepositoryRegistry();

    this.started = false;
    this.createdAt = new Date().toISOString();
  }

  start() {
    this.started = true;

    return {
      success: true,
      startedAt: new Date().toISOString()
    };
  }

  stop() {
    this.started = false;

    return {
      success: true,
      stoppedAt: new Date().toISOString()
    };
  }

  restart() {
    this.stop();
    return this.start();
  }

  reset() {
    this.registry.clear();

    return {
      success: true,
      resetAt: new Date().toISOString()
    };
  }

  isRunning() {
    return this.started;
  }

  status() {
    return {
      component:
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryRegistryLifecycle",
      healthy: true,
      running: this.started,
      registryCount: this.registry.size(),
      createdAt: this.createdAt,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryRegistryLifecycle;
