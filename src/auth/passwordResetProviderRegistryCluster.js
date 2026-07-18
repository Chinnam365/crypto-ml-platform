"use strict";

const PasswordResetProviderRegistryHost = require("./passwordResetProviderRegistryHost");

class PasswordResetProviderRegistryCluster {
  constructor(options = {}) {
    this.host =
      options.host ||
      new PasswordResetProviderRegistryHost(options);

    this.nodes = new Map();
  }

  async addNode(name, app) {
    await this.host.start(name, app);

    const node = {
      name,
      status: "online",
      startedAt: new Date().toISOString()
    };

    this.nodes.set(name, node);

    return node;
  }

  async removeNode(name) {
    if (!this.nodes.has(name)) {
      return false;
    }

    await this.host.stop(name);

    this.nodes.delete(name);

    return true;
  }

  async restartNode(name, app) {
    await this.host.restart(name, app);

    const node = this.nodes.get(name);

    if (node) {
      node.status = "online";
      node.restartedAt = new Date().toISOString();
    }

    return node || null;
  }

  getNode(name) {
    return this.nodes.get(name) || null;
  }

  listNodes() {
    return Array.from(this.nodes.values());
  }

  size() {
    return this.nodes.size;
  }

  status() {
    return {
      clusterSize: this.nodes.size,
      host: this.host.status(),
      nodes: this.listNodes(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = PasswordResetProviderRegistryCluster;
