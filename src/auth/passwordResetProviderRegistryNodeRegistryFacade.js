"use strict";

const PasswordResetProviderRegistryNodeRegistryBootstrap = require("./passwordResetProviderRegistryNodeRegistryBootstrap");

class PasswordResetProviderRegistryNodeRegistryFacade {
  constructor(options = {}) {
    this.bootstrap =
      options.bootstrap ||
      new PasswordResetProviderRegistryNodeRegistryBootstrap(options);
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

  getApi() {
    return this.bootstrap.api;
  }

  getModule() {
    return this.bootstrap.api.getModule();
  }

  getService() {
    return this.bootstrap.api.getService();
  }

  getController() {
    return this.bootstrap.api.getController();
  }

  getRouter() {
    return this.bootstrap.api.getRouter();
  }

  status() {
    return {
      facade:
        "PasswordResetProviderRegistryNodeRegistryFacade",
      booted: this.bootstrap.isBooted(),
      bootstrap: this.bootstrap.status(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryFacade;
