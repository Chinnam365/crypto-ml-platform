"use strict";

const fs = require("fs");
const PasswordResetProviderRegistryNodeRegistryManager = require("./passwordResetProviderRegistryNodeRegistryManager");

class PasswordResetProviderRegistryNodeRegistryImporter {
  constructor(options = {}) {
    this.manager =
      options.manager ||
      new PasswordResetProviderRegistryNodeRegistryManager(options);
  }

  import(filePath) {
    const data = JSON.parse(
      fs.readFileSync(filePath, "utf8")
    );

    if (!Array.isArray(data.nodes)) {
      throw new Error(
        "Invalid registry import format."
      );
    }

    let imported = 0;

    for (const node of data.nodes) {
      if (
        node &&
        node.id &&
        !this.manager.hasNode(node.id)
      ) {
        this.manager.registry.registry.set(
          node.id,
          node
        );

        imported++;
      }
    }

    return {
      success: true,
      imported,
      totalNodes: this.manager.nodeCount(),
      importedAt: new Date().toISOString()
    };
  }

  status() {
    return {
      importer:
        "PasswordResetProviderRegistryNodeRegistryImporter",
      nodeCount: this.manager.nodeCount(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryImporter;
