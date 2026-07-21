"use strict";

const Repository = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepository");

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryLifecycle {
  constructor(options = {}) {
    this.repository =
      options.repository || new Repository();

    this.createdAt = new Date().toISOString();
    this.started = false;
    this.stopped = false;
  }

  start() {
    this.started = true;
    this.stopped = false;

    return {
      success: true,
      startedAt: new Date().toISOString()
    };
  }

  stop() {
    this.started = false;
    this.stopped = true;

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
    this.repository.clear();

    return {
      success: true,
      resetAt: new Date().toISOString()
    };
  }

  status() {
    return {
      component:
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryLifecycle",
      healthy: true,
      started: this.started,
      stopped: this.stopped,
      createdAt: this.createdAt,
      repositorySize: this.repository.count(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryLifecycle;
