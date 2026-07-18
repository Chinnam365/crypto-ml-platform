"use strict";

const fs = require("fs/promises");

class PasswordResetProviderRegistryExporter {
  constructor(registry) {
    this.registry = registry;
  }

  async export(filePath) {
    const providers = this.registry.entries().map(entry => ({
      name: entry.name,
      configured: entry.configured,
      providerName:
        typeof entry.provider?.getName === "function"
          ? entry.provider.getName()
          : entry.name
    }));

    const document = {
      version: "1.0.0",
      exportedAt: new Date().toISOString(),
      providerCount: providers.length,
      providers
    };

    await fs.writeFile(
      filePath,
      JSON.stringify(document, null, 2),
      "utf8"
    );

    return {
      success: true,
      filePath,
      providerCount: providers.length
    };
  }

  async exportObject() {
    return {
      version: "1.0.0",
      exportedAt: new Date().toISOString(),
      providerCount: this.registry.size(),
      providers: this.registry.entries().map(entry => ({
        name: entry.name,
        configured: entry.configured
      }))
    };
  }
}

module.exports =
  PasswordResetProviderRegistryExporter;
