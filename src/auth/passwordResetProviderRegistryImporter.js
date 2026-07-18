"use strict";

const fs = require("fs/promises");

class PasswordResetProviderRegistryImporter {
  constructor(registry, factory) {
    this.registry = registry;
    this.factory = factory;
  }

  async import(filePath) {
    const content = await fs.readFile(
      filePath,
      "utf8"
    );

    const document = JSON.parse(content);

    const imported = [];
    const skipped = [];

    for (const provider of document.providers || []) {
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

      imported.push(provider.name);
    }

    return {
      success: true,
      imported,
      skipped,
      importedCount: imported.length,
      skippedCount: skipped.length,
      importedAt: new Date().toISOString()
    };
  }

  validate(document = {}) {
    const errors = [];

    if (!Array.isArray(document.providers)) {
      errors.push(
        "providers array is required."
      );
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}

module.exports =
  PasswordResetProviderRegistryImporter;
