"use strict";

const PasswordResetProviderRegistryNodeRegistryPersistence = require("./passwordResetProviderRegistryNodeRegistryPersistence");

class PasswordResetProviderRegistryNodeRegistryPersistenceAdapter {
  constructor(options = {}) {
    this.persistence =
      options.persistence ||
      new PasswordResetProviderRegistryNodeRegistryPersistence(options);

    this.connected = false;
  }

  connect() {
    this.connected = true;
    return this.status();
  }

  disconnect() {
    this.connected = false;
    return this.status();
  }

  isConnected() {
    return this.connected;
  }

  save(data) {
    this.ensureConnected();
    return this.persistence.save(data);
  }

  load() {
    this.ensureConnected();
    return this.persistence.load();
  }

  backup(destinationPath) {
    this.ensureConnected();
    return this.persistence.backup(destinationPath);
  }

  restore(sourcePath) {
    this.ensureConnected();
    return this.persistence.restore(sourcePath);
  }

  exists() {
    return this.persistence.exists();
  }

  delete() {
    this.ensureConnected();
    return this.persistence.delete();
  }

  ensureConnected() {
    if (!this.connected) {
      throw new Error(
        "PasswordResetProviderRegistryNodeRegistryPersistenceAdapter is not connected."
      );
    }
  }

  status() {
    return {
      adapter: "PasswordResetProviderRegistryNodeRegistryPersistenceAdapter",
      connected: this.connected,
      persistence: this.persistence.status(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = PasswordResetProviderRegistryNodeRegistryPersistenceAdapter;
