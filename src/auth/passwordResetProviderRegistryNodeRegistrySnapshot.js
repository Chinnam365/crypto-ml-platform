"use strict";

const PasswordResetProviderRegistryNodeRegistryManager = require("./passwordResetProviderRegistryNodeRegistryManager");

class PasswordResetProviderRegistryNodeRegistrySnapshot {
  constructor(options = {}) {
    this.manager =
      options.manager ||
      new PasswordResetProviderRegistryNodeRegistryManager(options);

    this.snapshots = new Map();
  }

  create(name = "default") {
    const snapshot = {
      name,
      createdAt: new Date().toISOString(),
      nodeCount: this.manager.nodeCount(),
      nodes: this.manager.listNodes()
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

  remove(name = "default") {
    return this.snapshots.delete(name);
  }

  clear() {
    this.snapshots.clear();
  }

  count() {
    return this.snapshots.size;
  }

  status() {
    return {
      snapshotManager:
        "PasswordResetProviderRegistryNodeRegistrySnapshot",
      snapshots: this.count(),
      nodeCount: this.manager.nodeCount(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistrySnapshot;
