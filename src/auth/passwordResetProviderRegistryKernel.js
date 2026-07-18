"use strict";

const PasswordResetProviderRegistryEngine = require("./passwordResetProviderRegistryEngine");

class PasswordResetProviderRegistryKernel {
  constructor(options = {}) {
    this.engine =
      options.engine ||
      new PasswordResetProviderRegistryEngine(options);

    this.initialized = false;
  }

  async initialize(name, app) {
    const result = await this.engine.boot(name, app);
    this.initialized = true;
    return result;
  }

  async terminate(name) {
    const result = await this.engine.shutdown(name);

    if (!this.engine.isRunning()) {
      this.initialized = false;
    }

    return result;
  }

  async reload(name, app) {
    const result = await this.engine.reboot(name, app);
    this.initialized = true;
    return result;
  }

  isInitialized() {
    return this.initialized;
  }

  getEngine() {
    return this.engine;
  }

  status() {
    return {
      initialized: this.initialized,
      engine: this.engine.status(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = PasswordResetProviderRegistryKernel;
