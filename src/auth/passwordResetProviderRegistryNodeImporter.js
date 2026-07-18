"use strict";

const fs = require("fs");
const PasswordResetProviderRegistryNodeManager = require("./passwordResetProviderRegistryNodeManager");

class PasswordResetProviderRegistryNodeImporter {
  constructor(options = {}) {
    this.nodeManager =
      options.nodeManager ||
      new PasswordResetProviderRegistryNodeManager();
  }

  import(filePath) {
    const content = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(content);

    const imported = [];

    if (Array.isArray(data.nodes)) {
      for (const nodeData of data.nodes) {
        const node = this.nodeManager.create({
          id: nodeData.id,
          name: nodeData.name,
          host: nodeData.host,
          port: nodeData.port,
          metadata: nodeData.metadata
        });

        if (nodeData.state === "online") {
          node.start();
        }

        this.nodeManager.register(node);
        imported.push(node.status());
      }
    }

    return {
      success: true,
      importedCount: imported.length,
      nodes: imported,
      importedAt: new Date().toISOString()
    };
  }

  status() {
    return {
      importer: "PasswordResetProviderRegistryNodeImporter",
      totalNodes: this.nodeManager.count(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = PasswordResetProviderRegistryNodeImporter;
