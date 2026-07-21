"use strict";

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryMetrics {
  constructor() {
    this.reset();
  }

  incrementSaves() {
    this.metrics.saves++;
  }

  incrementReads() {
    this.metrics.reads++;
  }

  incrementDeletes() {
    this.metrics.deletes++;
  }

  incrementFailures() {
    this.metrics.failures++;
  }

  setRepositoryCount(count) {
    this.metrics.repositoryCount = Number(count) || 0;
  }

  snapshot() {
    return {
      ...this.metrics,
      timestamp: new Date().toISOString()
    };
  }

  reset() {
    this.metrics = {
      saves: 0,
      reads: 0,
      deletes: 0,
      failures: 0,
      repositoryCount: 0,
      startedAt: new Date().toISOString()
    };
  }

  status() {
    return {
      component:
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryMetrics",
      healthy: true,
      metrics: this.snapshot()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryRegistryRegistryRegistryRegistryRepositoryMetrics;
