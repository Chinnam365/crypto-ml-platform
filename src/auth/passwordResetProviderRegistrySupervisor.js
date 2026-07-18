"use strict";

const PasswordResetProviderRegistryCoordinator = require("./passwordResetProviderRegistryCoordinator");

class PasswordResetProviderRegistrySupervisor {
  constructor(options = {}) {
    this.coordinator =
      options.coordinator ||
      new PasswordResetProviderRegistryCoordinator(options);

    this.state = "stopped";
  }

  async start(name, app) {
    const result = await this.coordinator.initialize(name, app);
    this.state = "running";
    return result;
  }

  async stop(name) {
    const result = await this.coordinator.shutdown(name);

    if (!this.coordinator.isActive()) {
      this.state = "stopped";
    }

    return result;
  }

  async restart(name, app) {
    this.state = "restarting";
    const result = await this.coordinator.restart(name, app);
    this.state = "running";
    return result;
  }

  getState() {
    return this.state;
  }

  registrations() {
    return this.coordinator.registrations();
  }

  status() {
    return {
      state: this.state,
      coordinator: this.coordinator.status(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = PasswordResetProviderRegistrySupervisor;
