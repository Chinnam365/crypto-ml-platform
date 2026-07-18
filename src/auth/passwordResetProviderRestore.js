"use strict";

const fs = require("fs/promises");

class PasswordResetProviderRestore {
  constructor(manager) {
    this.manager = manager;
  }

  async restore(filePath) {
    const content = await fs.readFile(
      filePath,
      "utf8"
    );

    const backup = JSON.parse(content);

    const restored = [];
    const skipped = [];

    for (const provider of backup.providers || []) {
      if (this.manager.get(provider.name)) {
        skipped.push(provider.name);
        continue;
      }

      this.manager.register(provider.name);
      restored.push(provider.name);
    }

    return {
      success: true,
      restored,
      skipped,
      restoredCount: restored.length,
      skippedCount: skipped.length,
      restoredAt: new Date().toISOString()
    };
  }

  async dryRun(filePath) {
    const content = await fs.readFile(
      filePath,
      "utf8"
    );

    const backup = JSON.parse(content);

    const toRestore = [];
    const existing = [];

    for (const provider of backup.providers || []) {
      if (this.manager.get(provider.name)) {
        existing.push(provider.name);
      } else {
        toRestore.push(provider.name);
      }
    }

    return {
      canRestore: toRestore.length > 0,
      toRestore,
      existing
    };
  }
}

module.exports = PasswordResetProviderRestore;
