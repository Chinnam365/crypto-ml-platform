"use strict";

const os = require("os");

class AuthTelemetry {
  constructor() {
    this.startedAt = Date.now();

    this.counters = {
      loginAttempts: 0,
      successfulLogins: 0,
      failedLogins: 0,
      refreshRequests: 0,
      refreshSuccess: 0,
      refreshFailures: 0,
      passwordResets: 0,
      emailVerifications: 0,
      mfaChallenges: 0,
      mfaSuccess: 0,
      accountLockouts: 0,
      apiKeyAuthentications: 0
    };
  }

  increment(metric, amount = 1) {
    if (!(metric in this.counters)) {
      this.counters[metric] = 0;
    }

    this.counters[metric] += amount;

    return this.counters[metric];
  }

  get(metric) {
    return this.counters[metric] || 0;
  }

  snapshot() {
    return {
      uptimeSeconds: Math.floor((Date.now() - this.startedAt) / 1000),
      hostname: os.hostname(),
      nodeVersion: process.version,
      platform: process.platform,
      memory: process.memoryUsage(),
      cpuLoad: os.loadavg(),
      metrics: {
        ...this.counters
      },
      timestamp: new Date().toISOString()
    };
  }

  reset() {
    Object.keys(this.counters).forEach(key => {
      this.counters[key] = 0;
    });
  }

  health() {
    return {
      healthy: true,
      uptimeSeconds: Math.floor((Date.now() - this.startedAt) / 1000),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = AuthTelemetry;
