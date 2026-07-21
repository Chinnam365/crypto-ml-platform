"use strict";

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryRegistryMetrics {
  constructor() {
    this.reset();
  }

  incrementRegistrations() {
    this.metrics.registrations++;
  }

  incrementResolutions() {
    this.metrics.resolutions++;
  }

  incrementRemovals() {
    this.metrics.removals++;
  }

  incrementFailures() {
    this.metrics.failures++;
  }

  setRegistryCount(count) {
    this.metrics.registryCount = Number(count) || 0;
  }

  snapshot() {
    return {
      ...this.metrics,
      timestamp: new Date().toISOString()
    };
  }

  reset() {
    this.metrics = {
      registrations: 0,
      resolutions: 0,
      removals: 0,
      failures: 0,
      registryCount: 0,
      startedAt: new Date().toISOString()
    };
  }

  status() {
    return {
      component:
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryRegistryMetrics",
      healthy: true,
      metrics: this.snapshot()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryRegistryMetrics;
