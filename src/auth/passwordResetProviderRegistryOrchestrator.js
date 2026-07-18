"use strict";

const PasswordResetProviderRegistryRegistrar = require("./passwordResetProviderRegistryRegistrar");

class PasswordResetProviderRegistryOrchestrator {
  constructor(options = {}) {
    this.registrar =
      options.registrar ||
      new PasswordResetProviderRegistryRegistrar(options);

    this.running = false;
  }

  async start(name, app) {
    const registration = await this.registrar.register(name, app);
    this.running = true;

    return {
      running: this.running,
      registration
    };
  }

  async stop(name) {
    const removed = await this.registrar.unregister(name);

    if (this.registrar.list().length === 0) {
      this.running = false;
    }

    return {
      running: this.running,
      removed
    };
  }

  async restart(name, app) {
    await this.stop(name);
    return this.start(name, app);
  }

  registrations() {
    return this.registrar.list();
  }

  status() {
    return {
      running: this.running,
      registrations: this.registrar.list().length,
      registrar: this.registrar.status(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = PasswordResetProviderRegistryOrchestrator;
