"use strict";

const fs = require("fs/promises");

class PasswordResetProviderBackup {
  constructor(manager) {
    this.manager = manager;
  }

  async create(filePath) {
    const providers = this.manager
      .list()
      .map(name => ({
        name
      }));

    const backup = {
      version: "1.0.0",
      createdAt: new Date().toISOString(),
      providers
    };

    await fs.writeFile(
      filePath,
      JSON.stringify(backup, null, 2),
      "utf8"
    );

    return {
      success: true,
      filePath,
      providerCount: providers.length
    };
  }

  async restore(filePath) {
    const content = await fs.readFile(
      filePath,
      "utf8"
    );

    const backup = JSON.parse(content);

    let restored = 0;

    if (Array.isArray(backup.providers)) {
      for (const provider of backup.providers) {
        if (!this.manager.get(provider.name)) {
          this.manager.register(provider.name);
          restored++;
        }
      }
    }

    return {
      success: true,
      restored,
      providerCount: backup.providers?.length || 0
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
      providerCount: backup.providers?.length || 0
    };
  }
}

module.exports = PasswordResetProviderBackup;
