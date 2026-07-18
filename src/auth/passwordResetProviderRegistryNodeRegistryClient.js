"use strict";

const PasswordResetProviderRegistryNodeRegistryFacade = require("./passwordResetProviderRegistryNodeRegistryFacade");

class PasswordResetProviderRegistryNodeRegistryClient {
  constructor(options = {}) {
    this.facade =
      options.facade ||
      new PasswordResetProviderRegistryNodeRegistryFacade(options);

    this.connected = false;
    this.connectedAt = null;
  }

  connect(app) {
    if (!this.connected) {
      this.facade.initialize(app);
      this.connected = true;
      this.connectedAt = new Date().toISOString();
    }

    return this.status();
  }

  disconnect() {
    if (this.connected) {
      this.facade.shutdown();
      this.connected = false;
    }

    return this.status();
  }

  restart(app) {
    this.facade.restart(app);
    this.connected = true;
    this.connectedAt = new Date().toISOString();

    return this.status();
  }

  getService() {
    return this.facade.getService();
  }

  getController() {
    return this.facade.getController();
  }

  getRouter() {
    return this.facade.getRouter();
  }

  getModule() {
    return this.facade.getModule();
  }

  isConnected() {
    return this.connected;
  }

  status() {
    return {
      client: "PasswordResetProviderRegistryNodeRegistryClient",
      connected: this.connected,
      connectedAt: this.connectedAt,
      facade: this.facade.status(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = PasswordResetProviderRegistryNodeRegistryClient;
