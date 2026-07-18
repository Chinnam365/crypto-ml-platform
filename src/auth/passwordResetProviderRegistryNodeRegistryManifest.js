"use strict";

const PasswordResetProviderRegistryNodeRegistryInstaller = require("./passwordResetProviderRegistryNodeRegistryInstaller");

class PasswordResetProviderRegistryNodeRegistryManifest {
  constructor(options = {}) {
    this.name =
      options.name || "password-reset-provider-registry-node-registry";

    this.version =
      options.version || "1.0.0";

    this.description =
      options.description ||
      "Password Reset Provider Registry Node Registry module.";

    this.author =
      options.author || "AI Investment Operating System";

    this.license =
      options.license || "MIT";

    this.installer =
      options.installer ||
      new PasswordResetProviderRegistryNodeRegistryInstaller(options);
  }

  getName() {
    return this.name;
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
      version: this.version,
      description: this.description,
      author: this.author,
      license: this.license,
      installer: this.installer.status(),
      generatedAt: new Date().toISOString()
    };
  }

  status() {
    return {
      manifest: "PasswordResetProviderRegistryNodeRegistryManifest",
      metadata: this.toJSON(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = PasswordResetProviderRegistryNodeRegistryManifest;
