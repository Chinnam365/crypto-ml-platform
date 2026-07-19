"use strict";

const PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryConstants = require("./passwordResetProviderRegistryNodeRegistryPersistenceRepositoryConstants");

class PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryMetrics {
  constructor(options = {}) {
    this.namespace =
      options.namespace ||
      PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryConstants.DEFAULT_NAMESPACE;

    this.metrics = {
      saves: 0,
      updates: 0,
      deletes: 0,
      reads: 0,
      imports: 0,
      exports: 0,
      errors: 0,
      startedAt: new Date().toISOString()
    };
  }

  increment(metric, value = 1) {
    if (!Object.prototype.hasOwnProperty.call(this.metrics, metric)) {
      return false;
    }

    if (typeof this.metrics[metric] !== "number") {
      return false;
    }

    this.metrics[metric] += value;
    return true;
  }

  get(metric) {
    return this.metrics[metric];
  }

  snapshot() {
    return {
      namespace: this.namespace,
      ...this.metrics,
      timestamp: new Date().toISOString()
    };
  }

  reset() {
    this.metrics.saves = 0;
    this.metrics.updates = 0;
    this.metrics.deletes = 0;
    this.metrics.reads = 0;
    this.metrics.imports = 0;
    this.metrics.exports = 0;
    this.metrics.errors = 0;
    this.metrics.startedAt = new Date().toISOString();

    return this.snapshot();
  }

  status() {
    return {
      component:
        "PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryMetrics",
      metrics: this.snapshot(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports =
  PasswordResetProviderRegistryNodeRegistryPersistenceRepositoryMetrics;
