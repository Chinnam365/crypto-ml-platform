"use strict";

const PasswordResetProviderRegistryNodeRegistry = require("./passwordResetProviderRegistryNodeRegistry");

class PasswordResetProviderRegistryNodeRegistryManager {
  constructor(options = {}) {
    this.registry =
      options.registry ||
      new PasswordResetProviderRegistryNodeRegistry(options);

    this.started = false;
  }

  initialize(app) {
    this.started = true;
    this.app = app;

    return this.status();
  }

  shutdown() {
    this.registry.clear();
    this.started = false;

    return this.status();
  }

  registerNode(id) {
    if (!this.app) {
      throw new Error(
        "Registry manager has not been initialized."
      );
    }

    return this.registry.register(id, this.app);
  }

  unregisterNode(id) {
    return this.registry.unregister(id);
  }

  getNode(id) {
    return this.registry.get(id);
  }

  hasNode(id) {
    return this.registry.exists(id);
  }

  listNodes() {
    return this.registry.list();
  }

  nodeCount() {
    return this.registry.count();
  }

  status() {
    return {
      manager:
        "PasswordResetProviderRegistryNodeRegistryManager",
      started: this.started,
      registeredNodes: this.registry.count(),
      registry: this.registry.status(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = PasswordResetProviderRegistryNodeRegistryManager;
