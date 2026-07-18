"use strict";

const PasswordResetProviderRegistryNodeRegistryPersistenceFactory = require("./passwordResetProviderRegistryNodeRegistryPersistenceFactory");

class PasswordResetProviderRegistryNodeRegistryPersistenceManager {
  constructor(options = {}) {
    this.factory =
      options.factory ||
      new PasswordResetProviderRegistryNodeRegistryPersistenceFactory(options);

    this.adapter =
      options.adapter ||
      this.factory.createConnectedAdapter(options);

    this.startedAt = new Date().toISOString();
  }

  save(data) {
    return this.adapter.save(data);
  }

  load() {
    return this.adapter.load();
  }

  backup(destinationPath) {
    return this.adapter.backup(destinationPath);
  }

  restore(sourcePath) {
    return this.adapter.restore(sourcePath);
  }

  exists() {
    return this.adapter.exists();
  }

  delete() {
    return this.adapter.delete();
  }

  connect() {
    if (!this.adapter.isConnected()) {
      this.adapter.connect();
    }

    return this.status();
  }

  disconnect() {
    if (this.adapter.isConnected()) {
      this.adapter.disconnect();
    }

    return this.status();
  }

  getAdapter() {
    return this.adapter;
  }

  getFactory() {
    return this.factory;
  }

  status() {
    return {
      manager: "PasswordResetProviderRegistryNodeRegistryPersistenceManager",
      connected: this.adapter.isConnected(),
      startedAt: this.startedAt,
      adapter: this.adapter.status(),
      factory: this.factory.status(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = PasswordResetProviderRegistryNodeRegistryPersistenceManager;
