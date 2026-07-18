"use strict";

const PasswordResetProviderRegistryManager = require("./passwordResetProviderRegistryManager");

class PasswordResetProviderRegistryFacade {
  constructor(manager = new PasswordResetProviderRegistryManager()) {
    this.manager = manager;
  }

  register(type, implementation) {
    return this.manager.register(
      type,
      implementation
    );
  }

  unregister(type) {
    return this.manager.unregister(type);
  }

  get(type) {
    return this.manager.get(type);
  }

  list() {
    return this.manager.list();
  }

  async start() {
    return this.manager.start();
  }

  async stop() {
    return this.manager.stop();
  }

  async restart() {
    await this.manager.stop();
    return this.manager.start();
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
    return {
      providers: this.manager.list(),
      providerCount: this.manager.list().length,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = PasswordResetProviderRegistryFacade;
