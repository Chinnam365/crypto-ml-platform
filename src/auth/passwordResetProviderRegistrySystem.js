"use strict";

const PasswordResetProviderRegistryApplication = require("./passwordResetProviderRegistryApplication");

class PasswordResetProviderRegistrySystem {
  constructor(options = {}) {
    this.application =
      options.application ||
      new PasswordResetProviderRegistryApplication(options);

    this.state = "offline";
  }

  async start(name, app) {
    const result = await this.application.start(name, app);
    this.state = "online";
    return result;
  }

  async stop(name) {
    const result = await this.application.stop(name);

    if (!this.application.isRunning()) {
      this.state = "offline";
    }

    return result;
  }

  async restart(name, app) {
    this.state = "restarting";

    const result = await this.application.restart(name, app);

    this.state = "online";

    return result;
  }

  isOnline() {
    return this.state === "online";
  }

  getApplication() {
    return this.application;
  }

  status() {
    return {
      state: this.state,
      application: this.application.status(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = PasswordResetProviderRegistrySystem;
