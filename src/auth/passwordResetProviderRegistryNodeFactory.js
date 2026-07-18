"use strict";

const PasswordResetProviderRegistryNode = require("./passwordResetProviderRegistryNode");

class PasswordResetProviderRegistryNodeFactory {
  constructor(defaultOptions = {}) {
    this.defaultOptions = { ...defaultOptions };
  }

  create(options = {}) {
    return new PasswordResetProviderRegistryNode({
      ...this.defaultOptions,
      ...options
    });
  }

  createBatch(nodes = []) {
    if (!Array.isArray(nodes)) {
      throw new TypeError("Expected an array of node definitions.");
    }

    return nodes.map((node) => this.create(node));
  }

  clone(node) {
    if (!(node instanceof PasswordResetProviderRegistryNode)) {
      throw new TypeError(
        "Expected PasswordResetProviderRegistryNode instance."
      );
    }

    const status = node.status();

    const cloned = this.create({
      id: status.id,
      name: status.name,
      host: status.host,
      port: status.port,
      metadata: {
        ...status.metadata
      }
    });

    if (status.state === "online") {
      cloned.start();
    }

    return cloned;
  }

  setDefaults(defaultOptions = {}) {
    this.defaultOptions = {
      ...this.defaultOptions,
      ...defaultOptions
    };

    return this;
  }

  getDefaults() {
    return {
      ...this.defaultOptions
    };
  }

  status() {
    return {
      factory: "PasswordResetProviderRegistryNodeFactory",
      defaults: this.defaultOptions,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = PasswordResetProviderRegistryNodeFactory;
