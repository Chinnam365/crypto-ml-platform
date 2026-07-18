"use strict";

class PasswordResetProviderRegistryVersionManager {
  constructor() {
    this.version = "1.0.0";
    this.history = [];
  }

  getVersion() {
    return this.version;
  }

  updateVersion(version) {
    if (!version) {
      throw new Error("Version is required.");
    }

    this.history.push({
      version: this.version,
      updatedAt: new Date().toISOString()
    });

    this.version = version;

    return this.version;
  }

  rollback() {
    if (this.history.length === 0) {
      return {
        success: false,
        reason: "NO_PREVIOUS_VERSION"
      };
    }

    const previous = this.history.pop();

    this.version = previous.version;

    return {
      success: true,
      version: this.version,
      restoredAt: new Date().toISOString()
    };
  }

  getHistory() {
    return [...this.history];
  }

  compare(version) {
    return {
      current: this.version,
      target: version,
      matches: this.version === version
    };
  }

  getMetadata() {
    return {
      version: this.version,
      historyEntries: this.history.length,
      generatedAt: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryVersionManager;
