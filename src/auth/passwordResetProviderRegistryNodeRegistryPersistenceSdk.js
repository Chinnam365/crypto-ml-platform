"use strict";

const PasswordResetProviderRegistryNodeRegistryPersistenceClient = require("./passwordResetProviderRegistryNodeRegistryPersistenceClient");

class PasswordResetProviderRegistryNodeRegistryPersistenceSdk {
  constructor(options = {}) {
    this.client =
      options.client ||
      new PasswordResetProviderRegistryNodeRegistryPersistenceClient(options);
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

  isConnected() {
    return this.client.isConnected();
  }

  getClient() {
    return this.client;
  }

  getFacade() {
    return this.client.getFacade();
  }

  getApi() {
    return this.client.getApi();
  }

  getModule() {
    return this.client.getModule();
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

  health() {
    return {
      connected: this.client.isConnected(),
      timestamp: new Date().toISOString()
    };
  }

  status() {
    return {
      sdk: "PasswordResetProviderRegistryNodeRegistryPersistenceSdk",
      client: this.client.status(),
      health: this.health(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceSdk;
