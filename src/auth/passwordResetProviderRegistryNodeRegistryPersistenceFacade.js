"use strict";

const PasswordResetProviderRegistryNodeRegistryPersistenceBootstrap = require("./passwordResetProviderRegistryNodeRegistryPersistenceBootstrap");

class PasswordResetProviderRegistryNodeRegistryPersistenceFacade {
  constructor(options = {}) {
    this.bootstrap =
      options.bootstrap ||
      new PasswordResetProviderRegistryNodeRegistryPersistenceBootstrap(
        options
      );
  }

  initialize(app) {
    return this.bootstrap.initialize(app);
  }

  shutdown() {
    return this.bootstrap.shutdown();
  }

  restart(app) {
    return this.bootstrap.restart(app);
  }

  isBooted() {
    return this.bootstrap.isBooted();
  }

  getBootstrap() {
    return this.bootstrap;
  }

  getApi() {
    return this.bootstrap.getApi();
  }

  getModule() {
    return this.getApi().getModule();
  }

  getService() {
    return this.getApi().getService();
  }

  getController() {
    return this.getApi().getController();
  }

  getRouter() {
    return this.getApi().getRouter();
  }

  status() {
    return {
      facade:
        "PasswordResetProviderRegistryNodeRegistryPersistenceFacade",
      booted: this.bootstrap.isBooted(),
      bootstrap: this.bootstrap.status(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceFacade;
