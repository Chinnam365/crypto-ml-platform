"use strict";

const PasswordResetProviderRegistryManager = require("./passwordResetProviderRegistryManager");
const PasswordResetProviderRegistryBootstrap = require("./passwordResetProviderRegistryBootstrap");

class PasswordResetProviderRegistryModule {
  constructor(options = {}) {
    this.manager =
      options.manager ||
      new PasswordResetProviderRegistryManager();

    this.bootstrap =
      options.bootstrap ||
      new PasswordResetProviderRegistryBootstrap({
        manager: this.manager
      });
  }

  async initialize() {
    return this.bootstrap.bootstrap();
  }

  async shutdown() {
    return this.bootstrap.shutdown();
  }

  async restart() {
    return this.bootstrap.restart();
  }

  getManager() {
    return this.manager;
  }

  getRegistry() {
    return this.manager.registry;
  }

  getFactory() {
    return this.manager.factory;
  }

  async health() {
    return this.manager.healthCheck();
  }

  async diagnostics() {
    return this.manager.diagnosticsReport();
  }

  async report() {
    return this.manager.report();
  }

  status() {
    return this.bootstrap.status();
  }
}

module.exports = PasswordResetProviderRegistryModule;
