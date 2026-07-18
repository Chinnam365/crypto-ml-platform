"use strict";

const PasswordResetProviderRegistryNodeManager = require("./passwordResetProviderRegistryNodeManager");

class PasswordResetProviderRegistryNodeSnapshot {
  constructor(options = {}) {
    this.nodeManager =
      options.nodeManager ||
      new PasswordResetProviderRegistryNodeManager();

    this.snapshots = new Map();
  }

  create(name = "default") {
    const snapshot = {
      name,
      createdAt: new Date().toISOString(),
      nodes: this.nodeManager
        .list()
        .map((node) => node.status())
    };

    this.snapshots.set(name, snapshot);

    return snapshot;
  }

  get(name = "default") {
    return this.snapshots.get(name) || null;
  }

  list() {
    return Array.from(this.snapshots.values());
  }

  delete(name = "default") {
    return this.snapshots.delete(name);
  }

  clear() {
    this.snapshots.clear();
  }

  status() {
    return {
      snapshotCount: this.snapshots.size,
      nodeCount: this.nodeManager.count(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = PasswordResetProviderRegistryNodeSnapshot;
