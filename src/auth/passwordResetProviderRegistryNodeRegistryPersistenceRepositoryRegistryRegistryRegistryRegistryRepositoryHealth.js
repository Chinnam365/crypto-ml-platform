"use strict";

const os = require("os");

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryHealth {
  constructor(options = {}) {
    this.startedAt = options.startedAt || new Date().toISOString();
    this.version = options.version || "1.0.0";
  }

  check() {
    return {
      healthy: true,
      component:
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryHealth",
      version: this.version,
      startedAt: this.startedAt,
      checkedAt: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      nodeVersion: process.version,
      platform: process.platform,
      hostname: os.hostname(),
      memory: {
        total: os.totalmem(),
        free: os.freemem()
      }
    };
  }

  isHealthy() {
    return this.check().healthy;
  }

  status() {
    return this.check();
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryHealth;
