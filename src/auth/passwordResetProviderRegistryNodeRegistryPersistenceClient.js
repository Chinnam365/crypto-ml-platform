"use strict";

const PasswordResetProviderRegistryNodeRegistryPersistenceFacade = require("./passwordResetProviderRegistryNodeRegistryPersistenceFacade");

class PasswordResetProviderRegistryNodeRegistryPersistenceClient {
  constructor(options = {}) {
    this.facade =
      options.facade ||
      new PasswordResetProviderRegistryNodeRegistryPersistenceFacade(options);

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

  isConnected() {
    return this.connected;
  }

  getFacade() {
    return this.facade;
  }

  getApi() {
    return this.facade.getApi();
  }

  getModule() {
    return this.facade.getModule();
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

  status() {
    return {
      client:
        "PasswordResetProviderRegistryNodeRegistryPersistenceClient",
      connected: this.connected,
      connectedAt: this.connectedAt,
      facade: this.facade.status(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceClient;
