"use strict";

const PasswordResetProviderRegistryApi = require("./passwordResetProviderRegistryApi");

class PasswordResetProviderRegistryClient {
  constructor(options = {}) {
    this.api =
      options.api ||
      new PasswordResetProviderRegistryApi(options);

    this.connected = false;
  }

  async connect(app) {
    this.api.register(app);
    this.connected = true;
    return this.status();
  }

  async disconnect() {
    this.connected = false;
    return this.status();
  }

  isConnected() {
    return this.connected;
  }

  getApi() {
    return this.api;
  }

  status() {
    return {
      connected: this.connected,
      endpoint: this.api.getPath(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = PasswordResetProviderRegistryClient;
