"use strict";

const PasswordResetProviderRegistryNodeSnapshot = require("./passwordResetProviderRegistryNodeSnapshot");

class PasswordResetProviderRegistryNodeVersionManager {
  constructor(options = {}) {
    this.snapshotManager =
      options.snapshotManager ||
      new PasswordResetProviderRegistryNodeSnapshot(options);

    this.versions = [];
    this.currentVersion = null;
  }

  createVersion(label = null) {
    const version = {
      id: this.versions.length + 1,
      label:
        label ||
        `v${this.versions.length + 1}`,
      createdAt: new Date().toISOString(),
      snapshot: this.snapshotManager.create(
        label || `v${this.versions.length + 1}`
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
      this.versions.find((v) => v.id === id) ||
      null
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
      currentVersion: this.currentVersion
        ? this.currentVersion.id
        : null,
      totalVersions: this.versions.length,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeVersionManager;
