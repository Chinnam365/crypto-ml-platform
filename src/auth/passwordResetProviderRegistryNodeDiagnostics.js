"use strict";

const PasswordResetProviderRegistryNodeManager = require("./passwordResetProviderRegistryNodeManager");

class PasswordResetProviderRegistryNodeDiagnostics {
  constructor(options = {}) {
    this.nodeManager =
      options.nodeManager ||
      new PasswordResetProviderRegistryNodeManager();
  }

  inspect(id) {
    const node = this.nodeManager.get(id);

    if (!node) {
      return {
        success: false,
        error: "Node not found",
        timestamp: new Date().toISOString()
      };
    }

    const status = node.status();

    return {
      success: true,
      diagnostics: {
        id: status.id,
        name: status.name,
        host: status.host,
        port: status.port,
        state: status.state,
        metadata: status.metadata,
        startedAt: status.startedAt,
        stoppedAt: status.stoppedAt,
        lastHeartbeat: status.lastHeartbeat
      },
      inspectedAt: new Date().toISOString()
    };
  }

  inspectAll() {
    return this.nodeManager
      .list()
      .map((node) => this.inspect(node.id));
  }

  summary() {
    const diagnostics = this.inspectAll();

    return {
      totalNodes: diagnostics.length,
      successful: diagnostics.filter((d) => d.success).length,
      failed: diagnostics.filter((d) => !d.success).length,
      diagnostics,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = PasswordResetProviderRegistryNodeDiagnostics;
