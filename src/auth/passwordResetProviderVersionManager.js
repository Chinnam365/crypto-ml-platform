"use strict";

class PasswordResetProviderVersionManager {
  constructor() {
    this.currentVersion = "1.0.0";
    this.history = [];
  }

  getCurrentVersion() {
    return this.currentVersion;
  }

  setVersion(version) {
    if (!version) {
      throw new Error("Version is required.");
    }

    this.history.push({
      version: this.currentVersion,
      replacedAt: new Date().toISOString()
    });

    this.currentVersion = version;

    return this.currentVersion;
  }

  getHistory() {
    return [...this.history];
  }

  rollback() {
    if (this.history.length === 0) {
      return {
        success: false,
        reason: "NO_PREVIOUS_VERSION"
      };
    }

    const previous = this.history.pop();

    this.currentVersion = previous.version;

    return {
      success: true,
      version: this.currentVersion,
      restoredAt: new Date().toISOString()
    };
  }

  compare(version) {
    return {
      current: this.currentVersion,
      target: version,
      matches: this.currentVersion === version
    };
  }

  info() {
    return {
      currentVersion: this.currentVersion,
      historyCount: this.history.length,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = PasswordResetProviderVersionManager;
