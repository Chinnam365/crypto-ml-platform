"use strict";

const PasswordResetProviderRegistryNodeRegistryClient = require("./passwordResetProviderRegistryNodeRegistryClient");

class PasswordResetProviderRegistryNodeRegistrySdk {
  constructor(options = {}) {
    this.client =
      options.client ||
      new PasswordResetProviderRegistryNodeRegistryClient(options);
  }

  initialize(app) {
    return this.client.connect(app);
  }

  shutdown() {
    return this.client.disconnect();
  }

  restart(app) {
    return this.client.restart(app);
  }

  getService() {
    return this.client.getService();
  }

  getController() {
    return this.client.getController();
  }

  getRouter() {
    return this.client.getRouter();
  }

  getModule() {
    return this.client.getModule();
  }

  isConnected() {
    return this.client.isConnected();
  }

  health() {
    return {
      healthy: this.client.isConnected(),
      timestamp: new Date().toISOString()
    };
  }

  status() {
    return {
      sdk: "PasswordResetProviderRegistryNodeRegistrySdk",
      client: this.client.status(),
      health: this.health(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = PasswordResetProviderRegistryNodeRegistrySdk;
