"use strict";

const fs = require("fs/promises");

class PasswordResetProviderImporter {
  constructor(manager) {
    this.manager = manager;
  }

  async importJson(filePath) {
    const content = await fs.readFile(
      filePath,
      "utf8"
    );

    const configuration = JSON.parse(content);

    return this.importConfiguration(
      configuration
    );
  }

  importConfiguration(configuration = {}) {
    const imported = [];

    if (
      Array.isArray(configuration.providers)
    ) {
      for (const provider of configuration.providers) {
        if (
          provider.name &&
          !this.manager.get(provider.name)
        ) {
          this.manager.register(
            provider.name
          );

          imported.push(provider.name);
        }
      }
    }

    return {
      success: true,
      imported,
      count: imported.length
    };
  }

  validate(configuration = {}) {
    return {
      valid: Array.isArray(
        configuration.providers
      ),
      errors: Array.isArray(
        configuration.providers
      )
        ? []
        : [
            "providers array is required."
          ]
    };
  }
}

module.exports = PasswordResetProviderImporter;
