"use strict";

class PasswordResetProviderRegistryNodeRegistryPersistenceMetrics {
  constructor() {
    this.reset();
  }

  increment(metric, value = 1) {
    if (typeof this.metrics[metric] !== "number") {
      this.metrics[metric] = 0;
    }

    this.metrics[metric] += value;
    this.metrics.lastUpdated = new Date().toISOString();

    return this.metrics[metric];
  }

  decrement(metric, value = 1) {
    return this.increment(metric, -value);
  }

  set(metric, value) {
    this.metrics[metric] = value;
    this.metrics.lastUpdated = new Date().toISOString();

    return value;
  }

  get(metric) {
    return this.metrics[metric];
  }

  snapshot() {
    return {
      ...this.metrics
    };
  }

  reset() {
    this.metrics = {
      saveOperations: 0,
      loadOperations: 0,
      backupOperations: 0,
      restoreOperations: 0,
      deleteOperations: 0,
      successfulOperations: 0,
      failedOperations: 0,
      bytesWritten: 0,
      bytesRead: 0,
      lastUpdated: new Date().toISOString()
    };

    return this;
  }

  status() {
    return {
      metrics:
        "PasswordResetProviderRegistryNodeRegistryPersistenceMetrics",
      values: this.snapshot(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceMetrics;
