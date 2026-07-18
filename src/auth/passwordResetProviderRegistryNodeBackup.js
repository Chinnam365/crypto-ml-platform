"use strict";

const fs = require("fs");
const path = require("path");
const PasswordResetProviderRegistryNodeManager = require("./passwordResetProviderRegistryNodeManager");

class PasswordResetProviderRegistryNodeBackup {
  constructor(options = {}) {
    this.nodeManager =
      options.nodeManager ||
      new PasswordResetProviderRegistryNodeManager();

    this.backupDirectory =
      options.backupDirectory ||
      path.join(process.cwd(), "backups");
  }

  create(fileName = "password-reset-provider-registry-node-backup.json") {
    if (!fs.existsSync(this.backupDirectory)) {
      fs.mkdirSync(this.backupDirectory, {
        recursive: true
      });
    }

    const backup = {
      version: 1,
      createdAt: new Date().toISOString(),
      nodes: this.nodeManager
        .list()
        .map((node) => node.status())
    };

    const filePath = path.join(
      this.backupDirectory,
      fileName
    );

    fs.writeFileSync(
      filePath,
      JSON.stringify(backup, null, 2),
      "utf8"
    );

    return {
      success: true,
      filePath,
      nodeCount: backup.nodes.length,
      createdAt: backup.createdAt
    };
  }

  status() {
    return {
      backupDirectory: this.backupDirectory,
      nodeCount: this.nodeManager.count(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = PasswordResetProviderRegistryNodeBackup;
