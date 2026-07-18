"use strict";

const PasswordResetProviderRegistryNodeRegistrySnapshot = require("./passwordResetProviderRegistryNodeRegistrySnapshot");

class PasswordResetProviderRegistryNodeRegistryVersionManager {
  constructor(options = {}) {
    this.snapshotManager =
      options.snapshotManager ||
      new PasswordResetProviderRegistryNodeRegistrySnapshot(options);

    this.versions = [];
    this.currentVersion = null;
  }

  createVersion(label = null) {
    const versionNumber = this.versions.length + 1;

    const version = {
      id: versionNumber,
      label: label || `v${versionNumber}`,
      createdAt: new Date().toISOString(),
      snapshot: this.snapshotManager.create(
        label || `v${versionNumber}`
      )
    };

    this.versions.push(version);
    this.currentVersion = version;

    return version;
  }

  getCurrentVersion() {
    return this.currentVersion;
  }

  getVersion(id) {
    return (
      this.versions.find(
        (version) => version.id === id
      ) || null
    );
  }

  listVersions() {
    return [...this.versions];
  }

  rollback(id) {
    const version = this.getVersion(id);

    if (!version) {
      return null;
    }

    this.currentVersion = version;

    return version;
  }

  status() {
    return {
      versionManager:
        "PasswordResetProviderRegistryNodeRegistryVersionManager",
      currentVersion: this.currentVersion
        ? this.currentVersion.id
        : null,
      totalVersions: this.versions.length,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryVersionManager;
