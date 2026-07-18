"use strict";

const PasswordResetProviderRegistryNodeFacade = require("./passwordResetProviderRegistryNodeFacade");

class PasswordResetProviderRegistryNodeRegistry {
  constructor(options = {}) {
    this.facade =
      options.facade ||
      new PasswordResetProviderRegistryNodeFacade(options);

    this.registry = new Map();
  }

  register(id, app) {
    if (this.registry.has(id)) {
      throw new Error(`Node '${id}' is already registered.`);
    }

    const result = this.facade.initialize(app);

    this.registry.set(id, {
      id,
      registeredAt: new Date().toISOString(),
      result
    });

    return this.registry.get(id);
  }

  unregister(id) {
    if (!this.registry.has(id)) {
      return false;
    }

    this.facade.shutdown();
    this.registry.delete(id);

    return true;
  }

  get(id) {
    return this.registry.get(id) || null;
  }

  exists(id) {
    return this.registry.has(id);
  }

  list() {
    return Array.from(this.registry.values());
  }

  clear() {
    this.registry.clear();
  }

  count() {
    return this.registry.size;
  }

  status() {
    return {
      registry: "PasswordResetProviderRegistryNodeRegistry",
      registeredNodes: this.count(),
      facade: this.facade.status(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = PasswordResetProviderRegistryNodeRegistry;
