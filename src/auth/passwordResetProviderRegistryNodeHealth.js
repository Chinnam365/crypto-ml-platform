"use strict";

const PasswordResetProviderRegistryNodeManager = require("./passwordResetProviderRegistryNodeManager");

class PasswordResetProviderRegistryNodeHealth {
  constructor(options = {}) {
    this.nodeManager =
      options.nodeManager ||
      new PasswordResetProviderRegistryNodeManager();
  }

  check(id) {
    const node = this.nodeManager.get(id);

    if (!node) {
      return {
        healthy: false,
        reason: "Node not found",
        timestamp: new Date().toISOString()
      };
    }

    const status = node.status();

    return {
      healthy: status.state === "online",
      nodeId: status.id,
      nodeName: status.name,
      state: status.state,
      lastHeartbeat: status.lastHeartbeat,
      checkedAt: new Date().toISOString()
    };
  }

  checkAll() {
    return this.nodeManager.list().map((node) => this.check(node.id));
  }

  summary() {
    const results = this.checkAll();

    return {
      total: results.length,
      healthy: results.filter((r) => r.healthy).length,
      unhealthy: results.filter((r) => !r.healthy).length,
      results,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = PasswordResetProviderRegistryNodeHealth;
