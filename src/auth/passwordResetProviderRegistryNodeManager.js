"use strict";

const PasswordResetProviderRegistryNode = require("./passwordResetProviderRegistryNode");

class PasswordResetProviderRegistryNodeManager {
  constructor() {
    this.nodes = new Map();
  }

  create(config = {}) {
    const node = new PasswordResetProviderRegistryNode(config);

    if (node.id) {
      this.nodes.set(node.id, node);
    }

    return node;
  }

  register(node) {
    if (!(node instanceof PasswordResetProviderRegistryNode)) {
      throw new TypeError(
        "Expected PasswordResetProviderRegistryNode instance."
      );
    }

    if (!node.id) {
      throw new Error("Node id is required.");
    }

    this.nodes.set(node.id, node);

    return node;
  }

  unregister(id) {
    return this.nodes.delete(id);
  }

  get(id) {
    return this.nodes.get(id) || null;
  }

  exists(id) {
    return this.nodes.has(id);
  }

  list() {
    return Array.from(this.nodes.values());
  }

  clear() {
    this.nodes.clear();
  }

  count() {
    return this.nodes.size;
  }

  heartbeat(id) {
    const node = this.get(id);

    if (!node) {
      return null;
    }

    return node.heartbeat();
  }

  status() {
    return {
      totalNodes: this.count(),
      nodes: this.list().map((node) => node.status()),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = PasswordResetProviderRegistryNodeManager;
