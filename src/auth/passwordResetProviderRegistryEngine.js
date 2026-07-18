"use strict";

const PasswordResetProviderRegistryRuntime = require("./passwordResetProviderRegistryRuntime");

class PasswordResetProviderRegistryEngine {
  constructor(options = {}) {
    this.runtime =
      options.runtime ||
      new PasswordResetProviderRegistryRuntime(options);

    this.state = "idle";
  }

  async boot(name, app) {
    this.state = "booting";

    const result = await this.runtime.start(name, app);

    this.state = "running";

    return result;
  }

  async shutdown(name) {
    this.state = "stopping";

    const result = await this.runtime.stop(name);

    this.state = this.runtime.isRunning()
      ? "running"
      : "stopped";

    return result;
  }

  async reboot(name, app) {
    this.state = "restarting";

    const result = await this.runtime.restart(name, app);

    this.state = "running";

    return result;
  }

  isRunning() {
    return this.runtime.isRunning();
  }

  uptime() {
    return this.runtime.uptime();
  }

  status() {
    return {
      state: this.state,
      runtime: this.runtime.status(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = PasswordResetProviderRegistryEngine;
