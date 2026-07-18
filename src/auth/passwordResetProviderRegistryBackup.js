"use strict";

const fs = require("fs/promises");

class PasswordResetProviderRegistryBackup {
  constructor(registry) {
    this.registry = registry;
  }

  async create(filePath) {
    const backup = {
      version: "1.0.0",
      createdAt: new Date().toISOString(),
      providerCount: this.registry.size(),
      providers: this.registry.entries().map(entry => ({
        name: entry.name,
        configured: entry.configured,
        providerName:
          typeof entry.provider?.getName === "function"
            ? entry.provider.getName()
            : entry.name
      }))
    };

    await fs.writeFile(
      filePath,
      JSON.stringify(backup, null, 2),
      "utf8"
    );

    return {
      success: true,
      filePath,
      providerCount: backup.providerCount
    };
  }

  async verify(filePath) {
    const content = await fs.readFile(
      filePath,
      "utf8"
    );

    const backup = JSON.parse(content);

    return {
      valid: Array.isArray(backup.providers),
      version: backup.version || null,
      createdAt: backup.createdAt || null,
      providerCount: backup.providerCount || 0
    };
  }

  async restore(filePath, factory) {
    const content = await fs.readFile(
      filePath,
      "utf8"
    );

    const backup = JSON.parse(content);

    const restored = [];

    for (const provider of backup.providers || []) {
      if (this.registry.has(provider.name)) {
        continue;
      }

      const instance = factory.create(
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
      restoredCount: restored.length
    };
  }
}

module.exports =
  PasswordResetProviderRegistryBackup;
