"use strict";

const PasswordResetProviderRegistryClient = require("./passwordResetProviderRegistryClient");

class PasswordResetProviderRegistrySdk {
  constructor(options = {}) {
    this.client =
      options.client ||
      new PasswordResetProviderRegistryClient(options);
  }

  async initialize(app) {
    return this.client.connect(app);
  }

  async shutdown() {
    return this.client.disconnect();
  }

  status() {
    return this.client.status();
  }

  isConnected() {
    return this.client.isConnected();
  }

  getClient() {
    return this.client;
  }

  getApi() {
    return this.client.getApi();
  }
}

module.exports = PasswordResetProviderRegistrySdk;
