"use strict";

const PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryHealth = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryHealth");

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryMetrics {
  constructor(options = {}) {
    this.health =
      options.health ||
      new PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryHealth(
        options
      );

    this.startedAt = Date.now();
  }

  collect() {
    const health = this.health.status();

    return {
      component:
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryMetrics",
      uptimeMs: Date.now() - this.startedAt,
      healthy: health.healthy,
      state: health.state,
      readiness: this.health.readiness(),
      liveness: this.health.liveness(),
      timestamp: new Date().toISOString()
    };
  }

  prometheus() {
    const metrics = this.collect();

    return [
      "# HELP registry_up Registry availability",
      "# TYPE registry_up gauge",
      `registry_up ${metrics.healthy ? 1 : 0}`,
      "# HELP registry_uptime_ms Registry uptime in milliseconds",
      "# TYPE registry_uptime_ms counter",
      `registry_uptime_ms ${metrics.uptimeMs}`
    ].join("\n");
  }

  status() {
    return this.collect();
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryMetrics;
