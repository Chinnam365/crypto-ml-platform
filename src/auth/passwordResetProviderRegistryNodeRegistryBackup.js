"use strict";

const fs = require("fs");
const path = require("path");
const PasswordResetProviderRegistryNodeRegistryManager = require("./passwordResetProviderRegistryNodeRegistryManager");

class PasswordResetProviderRegistryNodeRegistryBackup {
  constructor(options = {}) {
    this.manager =
      options.manager ||
      new PasswordResetProviderRegistryNodeRegistryManager(options);

    this.backupDirectory =
      options.backupDirectory ||
      path.join(process.cwd(), "backups");
  }

  create(fileName = "password-reset-provider-node-registry-backup.json") {
    if (!fs.existsSync(this.backupDirectory)) {
      fs.mkdirSync(this.backupDirectory, {
        recursive: true
      });
    }

    const backup = {
      version: 1,
      createdAt: new Date().toISOString(),
      nodes: this.manager.listNodes()
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
      backup:
        "PasswordResetProviderRegistryNodeRegistryBackup",
      nodeCount: this.manager.nodeCount(),
      backupDirectory: this.backupDirectory,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryBackup;
