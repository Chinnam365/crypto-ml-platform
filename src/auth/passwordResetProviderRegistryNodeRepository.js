"use strict";

const PasswordResetProviderRegistryNodeFactory = require("./passwordResetProviderRegistryNodeFactory");

class PasswordResetProviderRegistryNodeRepository {
  constructor(options = {}) {
    this.factory =
      options.factory ||
      new PasswordResetProviderRegistryNodeFactory(options);

    this.nodes = new Map();
  }

  create(data = {}) {
    const node = this.factory.create(data);

    if (!node.status().id) {
      throw new Error("Node id is required.");
    }

    this.nodes.set(node.status().id, node);

    return node;
  }

  save(node) {
    const status = node.status();

    if (!status.id) {
      throw new Error("Node id is required.");
    }

    this.nodes.set(status.id, node);

    return node;
  }

  findById(id) {
    return this.nodes.get(id) || null;
  }

  exists(id) {
    return this.nodes.has(id);
  }

  delete(id) {
    return this.nodes.delete(id);
  }

  findAll() {
    return Array.from(this.nodes.values());
  }

  count() {
    return this.nodes.size;
  }

  clear() {
    this.nodes.clear();
  }

  status() {
    return {
      repository: "PasswordResetProviderRegistryNodeRepository",
      nodeCount: this.count(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = PasswordResetProviderRegistryNodeRepository;
