"use strict";

const PasswordResetProviderRegistryNodeRegistryPersistenceInstaller = require("./passwordResetProviderRegistryNodeRegistryPersistenceInstaller");

class PasswordResetProviderRegistryNodeRegistryPersistenceManifest {
  constructor(options = {}) {
    this.name =
      options.name ||
      "password-reset-provider-registry-node-registry-persistence";

    this.displayName =
      options.displayName ||
      "Password Reset Provider Registry Node Registry Persistence";

    this.version =
      options.version ||
      "1.0.0";

    this.description =
      options.description ||
      "Persistence module for the Password Reset Provider Registry Node Registry.";

    this.author =
      options.author ||
      "AI Investment Operating System";

    this.license =
      options.license ||
      "MIT";

    this.installer =
      options.installer ||
      new PasswordResetProviderRegistryNodeRegistryPersistenceInstaller(
        options
      );

    this.createdAt = new Date().toISOString();
  }

  getName() {
    return this.name;
  }

  getDisplayName() {
    return this.displayName;
  }

  getVersion() {
    return this.version;
  }

  getDescription() {
    return this.description;
  }

  getAuthor() {
    return this.author;
  }

  getLicense() {
    return this.license;
  }

  getInstaller() {
    return this.installer;
  }

  toJSON() {
    return {
      name: this.name,
      displayName: this.displayName,
      version: this.version,
      description: this.description,
      author: this.author,
      license: this.license,
      installer: this.installer.status(),
      createdAt: this.createdAt
    };
  }

  status() {
    return {
      manifest:
        "PasswordResetProviderRegistryNodeRegistryPersistenceManifest",
      metadata: this.toJSON(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceManifest;
