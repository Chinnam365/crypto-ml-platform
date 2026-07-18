"use strict";

const PasswordResetProviderRegistryNodeBootstrap = require("./passwordResetProviderRegistryNodeBootstrap");

class PasswordResetProviderRegistryNodeFacade {
  constructor(options = {}) {
    this.bootstrap =
      options.bootstrap ||
      new PasswordResetProviderRegistryNodeBootstrap(options);
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

  getApi() {
    return this.bootstrap.api;
  }

  getModule() {
    return this.bootstrap.api.getModule();
  }

  getService() {
    return this.bootstrap.api.getService();
  }

  isBooted() {
    return this.bootstrap.isBooted();
  }

  status() {
    return {
      facade: "PasswordResetProviderRegistryNodeFacade",
      bootstrap: this.bootstrap.status(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = PasswordResetProviderRegistryNodeFacade;
