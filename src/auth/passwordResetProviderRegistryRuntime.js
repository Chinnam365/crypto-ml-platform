"use strict";

const PasswordResetProviderRegistrySupervisor = require("./passwordResetProviderRegistrySupervisor");

class PasswordResetProviderRegistryRuntime {
  constructor(options = {}) {
    this.supervisor =
      options.supervisor ||
      new PasswordResetProviderRegistrySupervisor(options);

    this.started = false;
    this.startedAt = null;
  }

  async start(name, app) {
    const result = await this.supervisor.start(name, app);

    this.started = true;
    this.startedAt = new Date().toISOString();

    return result;
  }

  async stop(name) {
    const result = await this.supervisor.stop(name);

    if (this.supervisor.getState() === "stopped") {
      this.started = false;
    }

    return result;
  }

  async restart(name, app) {
    return this.supervisor.restart(name, app);
  }

  isRunning() {
    return this.started;
  }

  uptime() {
    return {
      running: this.started,
      startedAt: this.startedAt
    };
  }

  status() {
    return {
      running: this.started,
      startedAt: this.startedAt,
      supervisor: this.supervisor.status(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = PasswordResetProviderRegistryRuntime;
