"use strict";

const PasswordResetProviderRegistryNodeManager = require("./passwordResetProviderRegistryNodeManager");

class PasswordResetProviderRegistryNodeMetrics {
  constructor(options = {}) {
    this.nodeManager =
      options.nodeManager ||
      new PasswordResetProviderRegistryNodeManager();
  }

  collect() {
    const nodes = this.nodeManager.list();

    const metrics = nodes.map((node) => {
      const status = node.status();

      return {
        nodeId: status.id,
        nodeName: status.name,
        state: status.state,
        lastHeartbeat: status.lastHeartbeat,
        uptimeStartedAt: status.startedAt
      };
    });

    return {
      totalNodes: metrics.length,
      onlineNodes: metrics.filter(
        (m) => m.state === "online"
      ).length,
      offlineNodes: metrics.filter(
        (m) => m.state !== "online"
      ).length,
      metrics,
      collectedAt: new Date().toISOString()
    };
  }

  export() {
    return JSON.stringify(this.collect(), null, 2);
  }

  status() {
    return {
      collector: "PasswordResetProviderRegistryNodeMetrics",
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = PasswordResetProviderRegistryNodeMetrics;
