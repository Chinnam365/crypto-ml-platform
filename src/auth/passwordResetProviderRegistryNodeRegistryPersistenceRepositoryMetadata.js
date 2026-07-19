"use strict";

const PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryManifest = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryManifest");

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryMetadata {
  constructor(options = {}) {
    this.manifest =
      options.manifest ||
      new PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryManifest(
        options
      );
  }

  get() {
    const manifest = this.manifest.getManifest();

    return {
      module: manifest.name,
      version: manifest.version,
      description: manifest.description,
      category: "authentication",
      component: "repository",
      layer: "persistence",
      createdAt: new Date().toISOString()
    };
  }

  toJSON() {
    return this.get();
  }

  status() {
    return {
      metadata:
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryMetadata",
      data: this.get(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryMetadata;
