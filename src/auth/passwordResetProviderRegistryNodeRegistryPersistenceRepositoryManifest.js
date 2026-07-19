"use strict";

const PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryInstaller = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryInstaller");

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryManifest {
  constructor(options = {}) {
    this.name =
      "PasswordResetProviderRegistryNodeRegistryPersistenceRepository";
    this.version = options.version || "1.0.0";
    this.description =
      "Persistence Repository module manifest for Password Reset Provider Registry Node Registry.";
    this.installer =
      options.installer ||
      new PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryInstaller(
        options
      );
  }

  getManifest() {
    return {
      name: this.name,
      version: this.version,
      description: this.description,
      installer: this.installer.status(),
      timestamp: new Date().toISOString()
    };
  }

  status() {
    return this.getManifest();
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryManifest;
