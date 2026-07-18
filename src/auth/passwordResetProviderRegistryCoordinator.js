"use strict";

const PasswordResetProviderRegistryOrchestrator = require("./passwordResetProviderRegistryOrchestrator");

class PasswordResetProviderRegistryCoordinator {
  constructor(options = {}) {
    this.orchestrator =
      options.orchestrator ||
      new PasswordResetProviderRegistryOrchestrator(options);

    this.active = false;
  }

  async initialize(name, app) {
    const result = await this.orchestrator.start(name, app);
    this.active = true;
    return result;
  }

  async shutdown(name) {
    const result = await this.orchestrator.stop(name);

    if (this.orchestrator.registrations().length === 0) {
      this.active = false;
    }

    return result;
  }

  async restart(name, app) {
    this.active = false;
    const result = await this.orchestrator.restart(name, app);
    this.active = true;
    return result;
  }

  registrations() {
    return this.orchestrator.registrations();
  }

  isActive() {
    return this.active;
  }

  status() {
    return {
      active: this.active,
      registrations: this.orchestrator.registrations().length,
      orchestrator: this.orchestrator.status(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = PasswordResetProviderRegistryCoordinator;
