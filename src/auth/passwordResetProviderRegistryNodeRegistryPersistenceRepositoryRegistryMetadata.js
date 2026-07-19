"use strict";

const PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryManifest = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryManifest");

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryMetadata {
  constructor(options = {}) {
    this.manifest =
      options.manifest ||
      new PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryManifest(
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
      component: "repository-registry",
      layer: "persistence",
      createdAt: new Date().toISOString()
    };
  }

  toJSON() {
    return this.get();
  }

  status() {
    return {
      component:
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryMetadata",
      data: this.get(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryMetadata;
