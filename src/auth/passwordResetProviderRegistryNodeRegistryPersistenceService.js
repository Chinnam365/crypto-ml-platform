"use strict";

const PasswordResetProviderRegistryNodeRegistryPersistenceManager = require("./passwordResetProviderRegistryNodeRegistryPersistenceManager");

class PasswordResetProviderRegistryNodeRegistryPersistenceService {
  constructor(options = {}) {
    this.manager =
      options.manager ||
      new PasswordResetProviderRegistryNodeRegistryPersistenceManager(options);
  }

  save(data) {
    return this.manager.save(data);
  }

  load() {
    return this.manager.load();
  }

  backup(destinationPath) {
    return this.manager.backup(destinationPath);
  }

  restore(sourcePath) {
    return this.manager.restore(sourcePath);
  }

  exists() {
    return this.manager.exists();
  }

  delete() {
    return this.manager.delete();
  }

  connect() {
    return this.manager.connect();
  }

  disconnect() {
    return this.manager.disconnect();
  }

  getManager() {
    return this.manager;
  }

  getAdapter() {
    return this.manager.getAdapter();
  }

  getFactory() {
    return this.manager.getFactory();
  }

  status() {
    return {
      service: "PasswordResetProviderRegistryNodeRegistryPersistenceService",
      manager: this.manager.status(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = PasswordResetProviderRegistryNodeRegistryPersistenceService;
