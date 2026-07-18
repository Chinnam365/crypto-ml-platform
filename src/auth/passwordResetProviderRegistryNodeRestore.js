"use strict";

const fs = require("fs");
const PasswordResetProviderRegistryNodeManager = require("./passwordResetProviderRegistryNodeManager");

class PasswordResetProviderRegistryNodeRestore {
  constructor(options = {}) {
    this.nodeManager =
      options.nodeManager ||
      new PasswordResetProviderRegistryNodeManager();
  }

  restore(filePath) {
    const backup = JSON.parse(
      fs.readFileSync(filePath, "utf8")
    );

    this.nodeManager.clear();

    const restored = [];

    for (const nodeData of backup.nodes || []) {
      const node = this.nodeManager.create({
        id: nodeData.id,
        name: nodeData.name,
        host: nodeData.host,
        port: nodeData.port,
        metadata: nodeData.metadata
      });

      if (nodeData.state === "online") {
        node.start();
      } else {
        node.stop();
      }

      this.nodeManager.register(node);
      restored.push(node.status());
    }

    return {
      success: true,
      restoredCount: restored.length,
      restored,
      restoredAt: new Date().toISOString()
    };
  }

  status() {
    return {
      restorer: "PasswordResetProviderRegistryNodeRestore",
      nodeCount: this.nodeManager.count(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = PasswordResetProviderRegistryNodeRestore;
