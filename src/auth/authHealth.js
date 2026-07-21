"use strict";

const os = require("os");

class AuthHealth {
  constructor(options = {}) {
    this.startedAt = options.startedAt || new Date().toISOString();
    this.version = options.version || "1.0.0";
    this.dependencies = options.dependencies || {};
  }

  async check() {
    const dependencyStatus = {};

    for (const [name, dependency] of Object.entries(this.dependencies)) {
      try {
        if (dependency && typeof dependency.health === "function") {
          dependencyStatus[name] = await dependency.health();
        } else if (dependency && typeof dependency.check === "function") {
          dependencyStatus[name] = await dependency.check();
        } else {
          dependencyStatus[name] = {
            healthy: true
          };
        }
      } catch (error) {
        dependencyStatus[name] = {
          healthy: false,
          error: error.message
        };
      }
    }

    const healthy = Object.values(dependencyStatus).every(
      d => d.healthy !== false
    );

    return {
      service: "Authentication",
      healthy,
      version: this.version,
      startedAt: this.startedAt,
      checkedAt: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      node: process.version,
      platform: process.platform,
      hostname: os.hostname(),
      memory: {
        rss: process.memoryUsage().rss,
        heapUsed: process.memoryUsage().heapUsed,
        heapTotal: process.memoryUsage().heapTotal
      },
      dependencies: dependencyStatus
    };
  }

  async status() {
    return this.check();
  }
}

module.exports = AuthHealth;
