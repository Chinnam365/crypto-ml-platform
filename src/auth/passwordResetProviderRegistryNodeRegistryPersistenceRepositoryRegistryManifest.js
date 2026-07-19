"use strict";

const PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryInstaller = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryInstaller");

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryManifest {
  constructor(options = {}) {
    this.name =
      "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistry";
    this.version = options.version || "1.0.0";
    this.description =
      "Repository Registry manifest for Password Reset Provider Registry Node Registry.";

    this.installer =
      options.installer ||
      new PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryInstaller(
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
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryManifest;
