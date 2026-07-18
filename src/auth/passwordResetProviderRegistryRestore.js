"use strict";

const fs = require("fs/promises");

class PasswordResetProviderRegistryRestore {
  constructor(registry, factory) {
    this.registry = registry;
    this.factory = factory;
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
      if (this.registry.has(provider.name)) {
        skipped.push(provider.name);
        continue;
      }

      const instance = this.factory.create(
        provider.name
      );

      this.registry.register(
        provider.name,
        instance
      );

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

    const willRestore = [];
    const alreadyRegistered = [];

    for (const provider of backup.providers || []) {
      if (this.registry.has(provider.name)) {
        alreadyRegistered.push(provider.name);
      } else {
        willRestore.push(provider.name);
      }
    }

    return {
      canRestore: willRestore.length > 0,
      willRestore,
      alreadyRegistered,
      checkedAt: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryRestore;
