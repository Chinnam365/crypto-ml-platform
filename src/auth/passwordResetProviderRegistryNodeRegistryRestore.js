"use strict";

const fs = require("fs");
const PasswordResetProviderRegistryNodeRegistryManager = require("./passwordResetProviderRegistryNodeRegistryManager");

class PasswordResetProviderRegistryNodeRegistryRestore {
  constructor(options = {}) {
    this.manager =
      options.manager ||
      new PasswordResetProviderRegistryNodeRegistryManager(options);
  }

  restore(filePath) {
    const backup = JSON.parse(
      fs.readFileSync(filePath, "utf8")
    );

    if (!Array.isArray(backup.nodes)) {
      throw new Error(
        "Invalid registry backup format."
      );
    }

    this.manager.registry.clear();

    let restored = 0;

    for (const node of backup.nodes) {
      if (node && node.id) {
        this.manager.registry.registry.set(
          node.id,
          node
        );

        restored++;
      }
    }

    return {
      success: true,
      restored,
      totalNodes: this.manager.nodeCount(),
      restoredAt: new Date().toISOString()
    };
  }

  status() {
    return {
      restorer:
        "PasswordResetProviderRegistryNodeRegistryRestore",
      nodeCount: this.manager.nodeCount(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryRestore;
